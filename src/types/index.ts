// Product interface for all product data
export interface Product {
  id: number;
  title: string;
  image: string;
  imageUrl?: string;
  imageUrls?: string[]; // Array of image URLs
  price: string;
  salePrice?: string;
  originalPrice?: string;
  discount?: string;
  link: string;
  alt: string;
  badge?: string;
  discountBadgeColor?: string;
  description?: string;
  colors?: Array<{ name: string, color: string }>;
  colorOptions?: Array<{ name: string, code: string }>;
  sizes?: Array<string>;
  availableSizes?: Array<string>;
  thumbnails?: Array<{ url: string, alt: string }>;
  images?: Array<{ url: string, alt: string }>;
  category?: string;
  subcategory?: string;
  stockQuantity?: number;
  status?: string;
  isAdminUploaded?: boolean;
  isGloballyVisible?: boolean;
  viewCount?: number;
  cartCount?: number;
  purchaseCount?: number;
  dateAdded?: string;
  // Additional product details
  topStyle?: string;
  topPattern?: string;
  bottomFabric?: string;
  fabricDupattaStole?: string;
  neckline?: string;
  sleeveDetail?: string;
  liningFabric?: string;
  fabric?: string;
  washCare?: string;
  responsive?: boolean;
  browserCompatible?: boolean;
  sizeChartHtml?: string;
  fit?: string;
  occasion?: string;
  sku?: string;
  barcode?: string;
  // Deep details
  brandName?: string;
  styleCode?: string;
  hsnCode?: string;
  gstPercentage?: number;
  workType?: string;
  bottomType?: string;
  setContains?: string;
  productWeight?: string;
  searchKeywords?: string;
  sizeSkus?: Record<string, string>; // Size -> SKU ID map
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  sizeStock?: Record<string, number>; // Map of size -> stock quantity
}

// Category interface for category cards
export interface Category {
  title: string;
  id?: number;
  name?: string;
  image: string;
  link: string;
  alt: string;
}

// Collection item interface
export interface CollectionItem {
  title: string;
  image: string;
  link: string;
  alt: string;
}

// Order Tracking Interfaces
export interface TrackingEvent {
  status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  label: string;
  message: string;
  location?: string;
  timestamp: string;
  source: 'system' | 'admin' | 'courier';
}

export interface PaymentInfo {
  method: string;
  status: 'pending' | 'paid' | 'failed';
  transaction_id?: string;
}

export interface CourierInfo {
  name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string; // NPO-2025-XXXXXX technically, but DB uses UUID usually. User specified "NPO-..." format in JSON.
  user_id?: string;
  order_date: string;
  payment: PaymentInfo;
  order_status: string;
  estimated_delivery?: string;
  courier: CourierInfo;
  shipping_address: ShippingAddress;
  tracking_events: TrackingEvent[];
  items?: any[]; // Simplified for now
  total_amount?: number;
}
