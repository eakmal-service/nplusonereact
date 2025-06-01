import { Product } from '@/types';

// Base API URL - use relative paths for local API routes
const API_URL = '/api';

/**
 * Fetch all products from the API
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    // In a real implementation, this would be a fetch call to your API
    // For now, we'll simulate a delayed response that would come from a real API
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: number | string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Fetch products by category
 */
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products?category=${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
}

/**
 * Fetch similar products
 */
export async function fetchSimilarProducts(productId: number | string, limit: number = 4): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products/${productId}/similar?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching similar products for ${productId}:`, error);
    return [];
  }
}

/**
 * Check delivery availability by pincode
 */
export async function checkDeliveryAvailability(pincode: string): Promise<{ available: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/delivery/check?pincode=${pincode}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error checking delivery for pincode ${pincode}:`, error);
    return {
      available: false,
      message: 'Unable to check delivery availability at the moment'
    };
  }
} 