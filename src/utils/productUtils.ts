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
    mrp: product.mrp, // Map MRP
    originalPrice: product.mrp || product.price, // Use MRP as original price if available
    discount: product.discount,
    link: `/product/${product.id}`,
    alt: product.alt || product.title,
    description: product.description || `${product.title} - ${product.category || ''} - ${product.subcategory || ''}`,
    // Add proper QuickView support
    // Add proper QuickView support
    sizes: product.sizes || product.availableSizes || [],
    thumbnails: thumbnails,
    images: thumbnails,
    imageUrls: product.imageUrls, // Pass through original imageUrls
    isAdminUploaded: product.isAdminUploaded || false,
    category: product.category || 'clothing',
    subcategory: product.subcategory || '',
    status: product.status || 'active',
    sizeChartHtml: product.sizeChartHtml,
    colorOptions: product.colorOptions || []
  };
};

const STORAGE_KEY = 'nplusoneProducts';

// Import mock data to seed/merge
// function getAllProducts
export const getAllProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];

  const productsJSON = localStorage.getItem(STORAGE_KEY);
  const storedProducts: Product[] = productsJSON ? JSON.parse(productsJSON) : [];

  return storedProducts;
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