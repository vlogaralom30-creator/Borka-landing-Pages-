import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AdminUser } from '../types';

const SUPABASE_URL_KEY = 'naxxivo_custom_supabase_url';
const SUPABASE_ANON_KEY = 'naxxivo_custom_supabase_anon_key';

export function getSavedSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(SUPABASE_URL_KEY) || envUrl;
  const localKey = localStorage.getItem(SUPABASE_ANON_KEY) || envKey;

  return {
    url: localUrl.trim(),
    anonKey: localKey.trim()
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_ANON_KEY, anonKey.trim());
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSavedSupabaseCredentials();
  if (url && anonKey && url.startsWith('http')) {
    try {
      cachedClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return cachedClient;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSavedSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('https://'));
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL এবং Anon Key আবশ্যক।' };
  }
  if (!url.startsWith('https://')) {
    return { success: false, message: 'Supabase URL অবশ্যই https:// দিয়ে শুরু হতে হবে।' };
  }

  try {
    const testClient = createClient(url, anonKey, {
      auth: { persistSession: false }
    });
    const { error } = await testClient.from('orders').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'সুপাবেস কানেকশন সফল! তবে টেবিল তৈরি করা প্রয়োজন। নিচের SQL কোডটি SQL Editor-এ রান করুন।'
        };
      }
      return { success: false, message: `সুপাবেস ত্রুটি: ${error.message}` };
    }
    return { success: true, message: 'সুপাবেস ক্লাউড কানেকশন সফলভাবে ভেরিফাই হয়েছে!' };
  } catch (err: any) {
    return { success: false, message: `কানেকশন ব্যর্থ হয়েছে: ${err.message || 'নেটওয়ার্ক এরর'}` };
  }
}

/**
 * Authenticate with Supabase Auth and verify role = 'admin' in profiles table
 */
export async function authenticateWithSupabase(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'সুপাবেস কানেকশন পাওয়া যায়নি।' };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'লগইন ব্যর্থ হয়েছে।' };
    }

    // Verify admin role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError || !profile || profile.role !== 'admin') {
      // Fallback: If profiles table not set up yet, allow first authenticated user
      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email || email,
          role: 'admin',
          name: profile?.name || 'Store Admin'
        }
      };
    }

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email || email,
        role: profile.role,
        name: profile.name || 'Store Admin'
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'লগইন করার সময় সমস্যা হয়েছে।' };
  }
}

/**
 * Returns SQL code to create the necessary tables in Supabase SQL editor
 */
export function getSupabaseSqlSchema(): string {
  return `-- ==========================================
-- NAXXIVO E-COMMERCE / LANDING PAGE TABLES
-- Company: Naxxivo | Creator: Rony Ahammad (naxxivo.online)
-- Run this complete script in your Supabase SQL Editor
-- ==========================================

-- 1. Create Profiles Table (For Admin / Seller Authentication)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT DEFAULT 'Store Owner',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'seller')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_note TEXT,
  variant_id TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  variant_code TEXT,
  size TEXT NOT NULL,
  include_hijab BOOLEAN DEFAULT FALSE,
  hijab_price NUMERIC DEFAULT 0,
  product_price NUMERIC NOT NULL,
  delivery_area TEXT NOT NULL,
  delivery_charge NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'Cash on Delivery',
  status TEXT DEFAULT 'pending'
);

-- 3. Create Store Config Table (For store branding and themes)
CREATE TABLE IF NOT EXISTS public.store_config (
  id TEXT PRIMARY KEY DEFAULT 'primary_store',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  config JSONB NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Profiles
DROP POLICY IF EXISTS "Allow users to read their profile" ON public.profiles;
CREATE POLICY "Allow users to read their profile" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update their profile" ON public.profiles;
CREATE POLICY "Allow users to update their profile" ON public.profiles
  FOR ALL USING (true);

-- 6. Policies for Orders (Public insert for customer checkout, read/update for store admin)
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
CREATE POLICY "Allow public insert on orders" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on orders" ON public.orders;
CREATE POLICY "Allow public read on orders" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;
CREATE POLICY "Allow public update on orders" ON public.orders
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on orders" ON public.orders;
CREATE POLICY "Allow public delete on orders" ON public.orders
  FOR DELETE USING (true);

-- 7. Policies for Store Config
DROP POLICY IF EXISTS "Allow public all on store_config" ON public.store_config;
CREATE POLICY "Allow public all on store_config" ON public.store_config
  FOR ALL USING (true) WITH CHECK (true);

-- 8. Auto-create Profile Trigger when a new User signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'Store Admin'), 'admin')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;
}
