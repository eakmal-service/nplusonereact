"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product as UIProduct } from '@/types';
import { Product as StorageProduct, getAllProducts, saveProduct, updateProduct, updateProductStatus, updateProductStock, deleteProduct, convertToTypeProduct } from '../utils/productUtils';

// Define context type
interface ProductContextType {
  products: UIProduct[];
  isLoading: boolean;
  saveNewProduct: (product: Omit<StorageProduct, 'id'>) => UIProduct;
  updateExistingProduct: (product: StorageProduct) => boolean;
  updateStatus: (id: number, status: 'active' | 'inactive' | 'draft') => boolean;
  updateStock: (id: number, newStock: number) => boolean;
  removeProduct: (id: number) => boolean;
  refreshProducts: () => void;
  getProductsByCategory: (category: string) => UIProduct[];
  getActiveProductsByCategory: (category: string) => UIProduct[];
}

// Create context with default values
const ProductContext = createContext<ProductContextType>({
  products: [],
  isLoading: true,
  saveNewProduct: () => ({} as UIProduct),
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
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize products from localStorage
  useEffect(() => {
    refreshProducts();
  }, []);

  // Refresh products from localStorage
  const refreshProducts = () => {
    setIsLoading(true);
    const loadedProducts = getAllProducts().map(convertToTypeProduct);
    setProducts(loadedProducts);
    setIsLoading(false);
  };

  // Save new product
  const saveNewProduct = (productData: Omit<StorageProduct, 'id'>) => {
    const savedProduct = saveProduct(productData);
    const uiProduct = convertToTypeProduct(savedProduct);
    
    setProducts(prev => {
      const updatedProducts = [uiProduct, ...prev];
      return updatedProducts.sort((a, b) => 
        new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime()
      );
    });

    return uiProduct;
  };

  // Update existing product
  const updateExistingProduct = (product: StorageProduct) => {
    const success = updateProduct(product);
    if (success) {
      setProducts(prev => {
        const updatedProducts = prev.map(p => 
          p.id === product.id ? convertToTypeProduct(product) : p
        );
        return updatedProducts.sort((a, b) => 
          new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime()
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
          new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime()
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
        (product.stockQuantity || 0) > 0 &&
        product.isGloballyVisible
      )
      .sort((a, b) => new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime());
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

// Hook for using the product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext; 