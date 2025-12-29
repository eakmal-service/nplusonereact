/**
 * Product utilities for managing products in localStorage
 */

export interface Product {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  price: string;
  salePrice: string;
  discount: string;
  imageUrl: string;
  imageUrls?: string[]; // Array of image URLs for multiple images
  stockQuantity: number;
  viewCount: number;
  cartCount: number;
  purchaseCount: number;
  dateAdded: string;
  status: 'active' | 'inactive' | 'draft';
  // Additional fields for UI integration
  description?: string;
  sizes?: string[];
  colorName?: string;
  colorOptions?: Array<{ name: string, code: string }>;
  material?: string;
  washCare?: string;
  alt?: string;
  isAdminUploaded?: boolean;
  isGloballyVisible?: boolean;
  responsive?: boolean;
  browserCompatible?: boolean;
  sizeChartHtml?: string;
}

// Convert from utils/productUtils Product to types/index Product for use with contexts
export const convertToTypeProduct = (product: any): any => {
  // Create thumbnails/images arrays from imageUrls if available, or fall back to single imageUrl
  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls.map((url: string) => ({
      url,
      alt: product.alt || product.title
    }))
    : [{ url: product.imageUrl || product.image, alt: product.alt || product.title }];

  // Ensure we always have at least the main image in thumbnails/images
  const thumbnails = images;

  return {
    id: product.id,
    title: product.title,
    image: product.imageUrl || product.image,
    imageUrl: product.imageUrl || product.image,
    price: product.price,
    salePrice: product.salePrice,
    originalPrice: product.price,
    discount: product.discount,
    link: `/product/${product.id}`,
    alt: product.alt || product.title,
    description: product.description || `${product.title} - ${product.category || ''} - ${product.subcategory || ''}`,
    // Add proper QuickView support
    sizes: product.sizes || ['32', '34', '36', '38', '40', '42'],
    thumbnails: thumbnails,
    images: thumbnails,
    imageUrls: product.imageUrls, // Pass through original imageUrls
    isAdminUploaded: product.isAdminUploaded || false,
    category: product.category || 'clothing',
    subcategory: product.subcategory || '',
    status: product.status || 'active',
    sizeChartHtml: product.sizeChartHtml,
    colorOptions: product.colorOptions || [
      { name: 'Black', code: '#000000' },
      { name: 'White', code: '#FFFFFF' },
      { name: 'Red', code: '#FF0000' },
      { name: 'Blue', code: '#0000FF' },
    ]
  };
};

const STORAGE_KEY = 'nplusoneProducts';

// Import mock data to seed/merge
import { recommendedProducts } from '../data/mockData';

/**
 * Get all products from localStorage
 */
export const getAllProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];

  const productsJSON = localStorage.getItem(STORAGE_KEY);
  const storedProducts: Product[] = productsJSON ? JSON.parse(productsJSON) : [];

  // Convert recommendedProducts to Product interface
  const staticProducts: Product[] = recommendedProducts.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category || 'clothing',
    subcategory: p.subcategory || '',
    price: p.price,
    salePrice: p.salePrice || p.price,
    discount: p.discount || '',
    imageUrl: p.image || p.imageUrl || '',
    stockQuantity: p.stockQuantity ?? 10,
    viewCount: 0,
    cartCount: 0,
    purchaseCount: 0,
    dateAdded: new Date().toISOString(),
    status: 'active',
    description: p.description,
    sizes: p.sizes,
    imageUrls: p.images?.map(i => i.url) || (p.image ? [p.image] : []),
    alt: p.alt,
    colorOptions: p.colorOptions,
    sizeChartHtml: p.sizeChartHtml
  }));

  // Filter out static products that are already in storage (by ID) to avoid duplicates if we save back to storage
  const storedIds = new Set(storedProducts.map(p => p.id));
  const newStaticProducts = staticProducts.filter(p => !storedIds.has(p.id));

  return [...storedProducts, ...newStaticProducts];
};

/**
 * Get product by ID
 */
export const getProductById = (id: number): Product | null => {
  const products = getAllProducts();
  return products.find(product => product.id === id) || null;
};

/**
 * Get products by category
 */
export const getProductsByCategory = (category: string): Product[] => {
  const products = getAllProducts();
  return products.filter(product => product.category === category);
};

/**
 * Get active products by category
 */
export const getActiveProductsByCategory = (category: string): Product[] => {
  const products = getAllProducts();
  return products.filter(product =>
    product.category === category &&
    product.status === 'active' &&
    product.stockQuantity > 0
  );
};

/**
 * Save a new product
 */
export const saveProduct = (product: Omit<Product, 'id'>): Product => {
  const products = getAllProducts();
  const newProduct = {
    ...product,
    id: Date.now(),
  };

  const updatedProducts = [newProduct, ...products];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

  return newProduct;
};

/**
 * Update an existing product
 */
export const updateProduct = (product: Product): boolean => {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === product.id);

  if (index === -1) return false;

  products[index] = product;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  return true;
};

/**
 * Delete a product
 */
export const deleteProduct = (id: number): boolean => {
  const products = getAllProducts();
  const filteredProducts = products.filter(product => product.id !== id);

  if (filteredProducts.length === products.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
  return true;
};

/**
 * Update product status
 */
export const updateProductStatus = (id: number, status: 'active' | 'inactive' | 'draft'): boolean => {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return false;

  products[index].status = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  return true;
};

/**
 * Update product stock
 */
export const updateProductStock = (id: number, newStock: number): boolean => {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return false;

  products[index].stockQuantity = Math.max(0, newStock);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  return true;
}; 