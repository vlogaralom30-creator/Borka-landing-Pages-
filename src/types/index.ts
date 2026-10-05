export type ThemePreset = 'luxury-gold' | 'royal-emerald' | 'rose-velvet' | 'minimal-noir';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export type DatabaseMode = 'demo-local' | 'supabase-cloud';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'seller';
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  code: string;
  image: string;
  price: number;
  oldPrice: number;
}

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
}

export interface StoreConfig {
  brandName: string;
  brandTagline: string;
  announcement: string;
  theme: ThemePreset;
  product: {
    title: string;
    subtitle: string;
    basePrice: number;
    oldPrice: number;
    discountText: string;
    hijabTitle: string;
    hijabSubtitle: string;
    hijabPrice: number;
    stockRemaining: number;
    countdownMinutes: number;
    features: string[];
    returnPolicy: string;
    variants: ProductVariant[];
    sizes: string[];
    galleryImages: GalleryImage[];
  };
  delivery: {
    insideDhaka: number;
    outsideDhaka: number;
  };
  contact: {
    whatsappNumber: string;
    messengerUrl: string;
    phone: string;
  };
  agencyBranding: {
    agencyName: string;
    creatorName: string;
    websiteUrl: string;
    contactNumber: string;
    enabled: boolean;
  };
  reviews: CustomerReview[];
  supabaseConfig?: {
    url: string;
    anonKey: string;
    connected: boolean;
  };
}

export interface OrderItemDetails {
  variantId: string;
  variantName: string;
  variantCode: string;
  size: string;
  includeHijab: boolean;
  hijabPrice: number;
  productPrice: number;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note?: string;
  variant_id: string;
  variant_name: string;
  variant_code: string;
  size: string;
  include_hijab: boolean;
  hijab_price: number;
  product_price: number;
  delivery_area: 'inside' | 'outside';
  delivery_charge: number;
  total_amount: number;
  payment_method: string;
  status: OrderStatus;
}
