"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, getAllProducts, saveProduct, updateProduct, updateProductStatus, updateProductStock, deleteProduct } from '../utils/productUtils';

// Define context type
interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  saveNewProduct: (product: Omit<Product, 'id'>) => Product;
  updateExistingProduct: (product: Product) => boolean;
  updateStatus: (id: number, status: 'active' | 'inactive' | 'draft') => boolean;
  updateStock: (id: number, newStock: number) => boolean;
  removeProduct: (id: number) => boolean;
  refreshProducts: () => void;
  getProductsByCategory: (category: string) => Product[];
  getActiveProductsByCategory: (category: string) => Product[];
}

// Create context with default values
const ProductContext = createContext<ProductContextType>({
  products: [],
  isLoading: true,
  saveNewProduct: () => ({} as Product),
  updateExistingProduct: () => false,
  updateStatus: () => false,
  updateStock: () => false,
  removeProduct: () => false,
  refreshProducts: () => {},
  getProductsByCategory: () => [],
  getActiveProductsByCategory: () => [],
});

// Provider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize products from localStorage
  useEffect(() => {
    refreshProducts();
  }, []);

  // Refresh products from localStorage
  const refreshProducts = () => {
    setIsLoading(true);
    const loadedProducts = getAllProducts();
    setProducts(loadedProducts);
    setIsLoading(false);
  };

  // Save new product
  const saveNewProduct = (productData: Omit<Product, 'id'>) => {
    // Ensure product is active and globally visible
    const productWithDefaults: Omit<Product, 'id'> = {
      ...productData,
      status: 'active' as const,
      isAdminUploaded: true,
      isGloballyVisible: true,
      responsive: true,
      browserCompatible: true,
      viewCount: 0,
      cartCount: 0,
      purchaseCount: 0,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    const newProduct = saveProduct(productWithDefaults);
    
    // Update state immediately for real-time visibility
    setProducts(prev => {
      const updatedProducts = [newProduct, ...prev];
      // Sort by date added (newest first)
      return updatedProducts.sort((a, b) => 
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    });

    return newProduct;
  };

  // Update existing product
  const updateExistingProduct = (product: Product) => {
    // Ensure product remains active and visible
    const productWithDefaults = {
      ...product,
      isAdminUploaded: true,
      isGloballyVisible: true,
      responsive: true,
      browserCompatible: true,
    };

    const success = updateProduct(productWithDefaults);
    if (success) {
      setProducts(prev => {
        const updatedProducts = prev.map(p => 
          p.id === product.id ? productWithDefaults : p
        );
        // Sort by date added (newest first)
        return updatedProducts.sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      });
    }
    return success;
  };

  // Update product status
  const updateStatus = (id: number, status: 'active' | 'inactive' | 'draft') => {
    const success = updateProductStatus(id, status);
    if (success) {
      setProducts(prev => {
        const updatedProducts = prev.map(p => 
          p.id === id ? { ...p, status } : p
        );
        // Sort by date added (newest first)
        return updatedProducts.sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      });
    }
    return success;
  };

  // Update product stock
  const updateStock = (id: number, newStock: number) => {
    const success = updateProductStock(id, newStock);
    if (success) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stockQuantity: newStock } : p));
    }
    return success;
  };

  // Remove product
  const removeProduct = (id: number) => {
    const success = deleteProduct(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    return success;
  };

  // Get products by category
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  // Get active products by category with proper sorting
  const getActiveProductsByCategory = (category: string) => {
    return products
      .filter(product => 
        product.category === category && 
        product.status === 'active' && 
        product.stockQuantity > 0 &&
        product.isGloballyVisible
      )
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  };

  // Context value
  const value = {
    products,
    isLoading,
    saveNewProduct,
    updateExistingProduct,
    updateStatus,
    updateStock,
    removeProduct,
    refreshProducts,
    getProductsByCategory,
    getActiveProductsByCategory,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for using the product context
export const useProducts = () => useContext(ProductContext);

export default ProductContext; 