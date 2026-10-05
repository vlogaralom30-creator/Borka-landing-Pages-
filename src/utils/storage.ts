import { StoreConfig, Order, OrderStatus, DatabaseMode } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  brandName: "HAUT MODESTY",
  brandTagline: "এক্সক্লুসিভ কোট স্টাইল আবায়া কালেকশন",
  announcement: "🚚 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি · মাত্র ৯৯৯৳",
  theme: "luxury-gold",
  product: {
    title: "এক্সক্লুসিভ কোট স্টাইল আবায়া কালেকশন",
    subtitle: "প্রিমিয়াম দুবাই চেরি কাপড়ের এক্সক্লুসিভ কোট স্টাইল আবায়া ও বোরকা কালেকশন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    basePrice: 999,
    oldPrice: 1550,
    discountText: "৩৫% ছাড়",
    hijabTitle: "নুড কালার হিজাব সহ নিন",
    hijabSubtitle: "দুবাই চেরি ফেব্রিক্স · সাইজ ৪০/৩০ ইঞ্চি ফুল কভারেজ",
    hijabPrice: 250,
    stockRemaining: 45,
    countdownMinutes: 30,
    features: [
      "প্রিমিয়াম চেরি কাপড়",
      "বডি সাইজ ফ্রি (৩২-৪৪)",
      "নোট: নুড কালার হিজাব নিলে ২৫০ টাকা যোগ হবে। দুবাই চেরি ফেব্রিক্স। সাইজ ৪০/৩০ ইঞ্চি। ফুল কভারেজ।",
      "সাইজ ৫০, ৫২, ৫৪, ৫৬",
      "কটি এডজাস্ট করা। বাটন ফিক্সড করা। শুধু আবায়া ৯৯৯ টাকা। নুড কালার হিজাব সহ নিলে ১২৫০ টাকা।"
    ],
    returnPolicy: "প্রোডাক্ট পাঠানোর পর যেকোনো কারণে রিটার্ন করতে চাইলে ডেলিভারি চার্জ দিয়ে রিটার্ন করতে পারবেন।",
    variants: [
      {
        id: "black-nude",
        name: "কালো-নুড কালার",
        code: "কোড-1005",
        image: "https://i.ibb.co.com/Kp9mX3Tc/file-00000000d9e88211bf110a51ec7121c9.png",
        price: 999,
        oldPrice: 1550
      },
      {
        id: "full-black",
        name: "ফুল-কালো কালার",
        code: "কোড-1005",
        image: "/src/assets/images/abaya_full_black_detail_1791210967698.jpg",
        price: 999,
        oldPrice: 1550
      }
    ],
    sizes: ["৫০", "৫২", "৫৪", "৫৬"],
    galleryImages: [
      {
        url: "https://i.ibb.co.com/Kp9mX3Tc/file-00000000d9e88211bf110a51ec7121c9.png",
        alt: "কোট স্টাইল আবায়া বোরকা - কালো ও নুড কালার"
      },
      {
        url: "/src/assets/images/abaya_coat_style_black_nude_1791210954234.jpg",
        alt: "প্রিমিয়াম চেরি ফেব্রিক কোট আবায়া লুক"
      },
      {
        url: "/src/assets/images/abaya_full_black_detail_1791210967698.jpg",
        alt: "ফুল-কালো কালার ও বোতাম ফিনিশিং ডিটেইল"
      },
      {
        url: "/src/assets/images/abaya_nude_hijab_styling_1791210981864.jpg",
        alt: "নুড কালার চেরি হিজাব সহ সম্পূর্ণ ড্রেপ"
      }
    ]
  },
  delivery: {
    insideDhaka: 80,
    outsideDhaka: 150
  },
  contact: {
    whatsappNumber: "8801868278051",
    messengerUrl: "https://m.me/yourpage",
    phone: "01868278051"
  },
  agencyBranding: {
    agencyName: "Naxxivo",
    creatorName: "Rony Ahammad",
    websiteUrl: "https://naxxivo.online",
    contactNumber: "01868278051 (WhatsApp)",
    enabled: true
  },
  reviews: [
    {
      id: "rev-1",
      name: "রাবেয়া সুলতানা",
      city: "ধানমন্ডি, ঢাকা",
      rating: 5,
      text: "কাপড়টা আসলেই চমৎকার! ছবির চেয়েও বাস্তবে দেখতে বেশি সুন্দর। ফিটিং আর ফিনিশিং মাশাল্লাহ অনেক ভালো।",
      date: "২ দিন আগে"
    },
    {
      id: "rev-2",
      name: "ফারহানা ইসলাম",
      city: "চট্টগ্রাম",
      rating: 5,
      text: "চেরি ফেব্রিক্স খুব আরামদায়ক আর সফট। ডেলিভারিও মাত্র ২ দিনে পেয়েছি। হিজাবের সাইজও যথেষ্ট বড়।",
      date: "৩ দিন আগে"
    },
    {
      id: "rev-3",
      name: "তানিয়া আক্তার",
      city: "সিলেট",
      rating: 5,
      text: "কোট স্টাইল বাটনগুলো খুব প্রিমিয়াম লাগে। এই দামে এত ভালো আবায়া পাবো আশা করিনি। ধন্যবাদ!",
      date: "৫ দিন আগে"
    },
    {
      id: "rev-4",
      name: "সুমাইয়া জাহান",
      city: "উত্তরা, ঢাকা",
      rating: 5,
      text: "ক্যাশ অন ডেলিভারিতে চেক করে নিতে পেরেছি। কাপড়ের কোয়ালিটি ১০০% প্রিমিয়াম। সবাইকে নেওয়ার পরামর্শ দিচ্ছি।",
      date: "১ সপ্তাহ আগে"
    }
  ]
};

export const SAMPLE_DEMO_ORDERS: Order[] = [
  {
    id: "ORD-849201",
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    customer_name: "সাদিয়া আফরিন",
    customer_phone: "01712345678",
    customer_address: "রোড ৪, সেক্টর ৯, উত্তরা, ঢাকা",
    customer_note: "অফিসের পরে ৫টার পর ডেলিভারি দিলে ভালো হয়",
    variant_id: "black-nude",
    variant_name: "কালো-নুড কালার",
    variant_code: "কোড-1005",
    size: "৫২",
    include_hijab: true,
    hijab_price: 250,
    product_price: 999,
    delivery_area: "inside",
    delivery_charge: 80,
    total_amount: 1329,
    payment_method: "Cash on Delivery",
    status: "pending"
  },
  {
    id: "ORD-793112",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    customer_name: "মেহজাবিন চৌধুরী",
    customer_phone: "01819283746",
    customer_address: "জিইসি মোড়, লালখান বাজার, চট্টগ্রাম",
    variant_id: "full-black",
    variant_name: "ফুল-কালো কালার",
    variant_code: "কোড-1005",
    size: "৫৪",
    include_hijab: false,
    hijab_price: 0,
    product_price: 999,
    delivery_area: "outside",
    delivery_charge: 150,
    total_amount: 1149,
    payment_method: "Cash on Delivery",
    status: "confirmed"
  }
];

const STORE_CONFIG_STORAGE_KEY = 'naxxivo_store_config';
const ORDERS_STORAGE_KEY = 'naxxivo_store_orders';

export function getDatabaseMode(): DatabaseMode {
  return isSupabaseConfigured() ? 'supabase-cloud' : 'demo-local';
}

export async function loadStoreConfig(): Promise<StoreConfig> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('store_config')
        .select('config')
        .eq('id', 'primary_store')
        .maybeSingle();

      if (!error && data?.config) {
        localStorage.setItem(STORE_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
        return data.config as StoreConfig;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, fallback to local:', e);
    }
  }

  const local = localStorage.getItem(STORE_CONFIG_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Invalid local config format:', e);
    }
  }
  return DEFAULT_STORE_CONFIG;
}

export async function saveStoreConfig(config: StoreConfig): Promise<void> {
  localStorage.setItem(STORE_CONFIG_STORAGE_KEY, JSON.stringify(config));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('store_config').upsert({
        id: 'primary_store',
        config: config,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Could not sync store config to Supabase:', e);
    }
  }
}

export async function loadOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(data));
        return data as Order[];
      }
    } catch (e) {
      console.warn('Error fetching orders from Supabase:', e);
    }
  }

  const local = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Invalid local orders:', e);
    }
  }

  // Pre-seed with demo orders in Demo Mode so client can evaluate immediately
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SAMPLE_DEMO_ORDERS));
  return SAMPLE_DEMO_ORDERS;
}

export async function createOrder(order: Order): Promise<void> {
  const existingOrders = await loadOrders();
  const updatedOrders = [order, ...existingOrders.filter((o) => o.id !== order.id)];
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('orders').insert([order]);
    } catch (e) {
      console.warn('Could not insert order into Supabase:', e);
    }
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const existingOrders = await loadOrders();
  const updatedOrders = existingOrders.map((o) =>
    o.id === orderId ? { ...o, status } : o
  );
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (e) {
      console.warn('Could not update order status in Supabase:', e);
    }
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  const existingOrders = await loadOrders();
  const updatedOrders = existingOrders.filter((o) => o.id !== orderId);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (e) {
      console.warn('Could not delete order from Supabase:', e);
    }
  }
}

export function resetDemoData(): { config: StoreConfig; orders: Order[] } {
  localStorage.setItem(STORE_CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_STORE_CONFIG));
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SAMPLE_DEMO_ORDERS));
  return {
    config: DEFAULT_STORE_CONFIG,
    orders: SAMPLE_DEMO_ORDERS
  };
}
