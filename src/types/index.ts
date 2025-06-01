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
  description?: string;
  colors?: Array<{name: string, color: string}>;
  colorOptions?: Array<{name: string, code: string}>;
  sizes?: Array<string>;
  availableSizes?: Array<string>;
  thumbnails?: Array<{url: string, alt: string}>;
  images?: Array<{url: string, alt: string}>;
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
}

// Category interface for category cards
export interface Category {
  title: string;
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