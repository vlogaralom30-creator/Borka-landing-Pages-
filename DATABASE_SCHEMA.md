# 🗄️ Supabase Database Schema & Architecture Guide

**System Name**: Naxxivo E-Commerce Single-Product SaaS  
**Company**: Naxxivo  
**Creator**: Rony Ahammad  
**Website**: [naxxivo.online](https://naxxivo.online)  

---

## 📌 ১. ওভারভিউ (Dual Mode System)

এই সিস্টেমটিতে **ডুয়েল মোড ডাটাবেস আর্কিটেকচার** রয়েছে:
1. **Local Demo Mode**: কোনো ক্লাউড সেটআপ ছাড়াই নতুন ক্রেতা/সেলার পুরো ওয়েবসাইট ও অ্যাডমিন প্যানেল টেস্ট করতে পারে (ব্রাউজারের লোকাল স্টোরেজে স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে)।
2. **Supabase Cloud Mode**: ক্লায়েন্ট সফটওয়্যারটি কেনার পর তার নিজস্ব Supabase Project URL ও Public Anon Key অ্যাডমিন ড্যাশবোর্ডে বসালে সম্পূর্ণ ডাটা ক্লাউডে সিঙ্ক হয়।

---

## 📋 ২. ডাটাবেস টেবিল স্ট্রাকচার (Tables & Columns)

### টেবিল ১: `public.profiles`
অ্যাডমিন ও সেলারদের অথেনটিকেশন ও পারমিশন সংরক্ষণের জন্য।

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE` | Supabase Auth ইউজার আইডি |
| `email` | `TEXT` | `NOT NULL` | অ্যাডমিনের ইমেইল এড্রেস |
| `name` | `TEXT` | `DEFAULT 'Store Owner'` | অ্যাডমিন বা স্টোর ওনারের নাম |
| `role` | `TEXT` | `NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'seller'))` | ইউজারের রোল (admin/seller) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | তৈরির সময়কাল |

---

### টেবিল ২: `public.orders`
কাস্টমারদের প্লেস করা প্রতিটি অর্ডার রিয়েলটাইমে সংরক্ষণের জন্য।

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | ইউনিক অর্ডার আইডি (যেমন: `ORD-849201`) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | অর্ডার গ্রহণের তারিখ ও সময় |
| `customer_name` | `TEXT` | `NOT NULL` | কাস্টমারের সম্পূর্ণ নাম |
| `customer_phone` | `TEXT` | `NOT NULL` | ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর |
| `customer_address` | `TEXT` | `NOT NULL` | সম্পূর্ণ ডেলিভারি ঠিকানা |
| `customer_note` | `TEXT` | `NULLABLE` | ঐচ্ছিক বিশেষ নোট বা নির্দেশনা |
| `variant_id` | `TEXT` | `NOT NULL` | কালার ভ্যারিয়েন্ট আইডি (যেমন: `black-nude`) |
| `variant_name` | `TEXT` | `NOT NULL` | নির্বাচিত কালার নাম (যেমন: `কালো-নুড কালার`) |
| `variant_code` | `TEXT` | `NULLABLE` | পোশাকের কোড (যেমন: `কোড-1005`) |
| `size` | `TEXT` | `NOT NULL` | সাইজ (যেমন: `৫০`, `৫২`, `৫৪`, `৫৬`) |
| `include_hijab` | `BOOLEAN` | `DEFAULT FALSE` | নুড কালার হিজাব অ্যাড-অন নেওয়া হয়েছে কি না |
| `hijab_price` | `NUMERIC` | `DEFAULT 0` | হিজাবের অতিরিক্ত মূল্য (যেমন: ২৫০৳) |
| `product_price` | `NUMERIC` | `NOT NULL` | মূল পোশাকের অফার মূল্য (যেমন: ৯৯৯৳) |
| `delivery_area` | `TEXT` | `NOT NULL` | `inside` (ঢাকা সিটি) অথবা `outside` (ঢাকা বাইরে) |
| `delivery_charge`| `NUMERIC` | `NOT NULL` | ডেলিভারি ফি (৮০৳ বা ১৫০৳) |
| `total_amount` | `NUMERIC` | `NOT NULL` | সর্বমোট বিল (ক্যাশ অন ডেলিভারি) |
| `payment_method` | `TEXT` | `DEFAULT 'Cash on Delivery'` | পেমেন্ট মেথড |
| `status` | `TEXT` | `DEFAULT 'pending'` | স্ট্যাটাস: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled` |

---

### টেবিল ৩: `public.store_config`
ওয়েবসাইটের ডিজাইন থিম, প্রাইস, ব্র্যান্ড নাম ও কন্টাক্ট ইনফো সংরক্ষণের জন্য।

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY DEFAULT 'primary_store'` | স্টোর রেকর্ড আইডেন্টিফায়ার |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | সর্বশেষ আপডেটের সময় |
| `config` | `JSONB` | `NOT NULL` | সম্পূর্ণ কনফিগারেশন অবজেক্ট (Product, Theme, Contact, Delivery, Reviews) |

---

## 💻 ৩. সম্পূর্ণ প্রস্তুত SQL মাইগ্রেশন স্ক্রিপ্ট

Supabase ড্যাশবোর্ডের **SQL Editor** ট্যাবে গিয়ে নিচের স্ক্রিপ্টটি কপি করে **RUN** করলেই সমস্ত টেবিল, পলিসি ও অটো-ট্রিগার তৈরি হয়ে যাবে:

```sql
-- =========================================================
-- NAXXIVO E-COMMERCE DATABASE SETUP
-- Company: Naxxivo | Creator: Rony Ahammad (naxxivo.online)
-- =========================================================

-- ১. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT DEFAULT 'Store Owner',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'seller')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ২. Orders Table
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

-- ৩. Store Config Table
CREATE TABLE IF NOT EXISTS public.store_config (
  id TEXT PRIMARY KEY DEFAULT 'primary_store',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  config JSONB NOT NULL
);

-- ৪. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;

-- ৫. Policies for Profiles
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;
CREATE POLICY "Allow users to read profiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update profiles" ON public.profiles;
CREATE POLICY "Allow users to update profiles" ON public.profiles
  FOR ALL USING (true);

-- ৬. Policies for Orders (Public insert for customer checkout, read/update for store admin)
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

-- ৭. Policies for Store Config
DROP POLICY IF EXISTS "Allow public all on store_config" ON public.store_config;
CREATE POLICY "Allow public all on store_config" ON public.store_config
  FOR ALL USING (true) WITH CHECK (true);

-- ৮. Auto-create Profile Trigger when a user signs up
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
```

---

## 🔑 ৪. কীভাবে ক্লায়েন্টের জন্য অ্যাডমিন ইউজার তৈরি করবেন

1. Supabase ড্যাশবোর্ডে গিয়ে **Authentication -> Users** এ যান।
2. **Add User -> Create User** এ ক্লিক করুন।
3. ক্লায়েন্টের ইমেইল ও একটি পাসওয়ার্ড দিন।
4. `on_auth_user_created` ট্রিগারের কারণে ইউজারের প্রোফাইল স্বয়ংক্রিয়ভাবে `role = 'admin'` হিসেবে তৈরি হয়ে যাবে।
5. ক্লায়েন্ট এখন `https://example.com/#admin` লিংকে গিয়ে সেই ইমেইল ও পাসওয়ার্ড দিয়ে সরাসরি লগইন করতে পারবে!
