"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';

// Define context type
interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  saveNewProduct: (product: any) => Promise<boolean>;
  updateExistingProduct: (product: Product) => Promise<boolean>;
  updateStatus: (id: number, status: 'active' | 'inactive' | 'draft') => Promise<boolean>;
  updateStock: (id: number, newStock: number) => Promise<boolean>;
  removeProduct: (id: number) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  getProductsByCategory: (category: string) => Product[];
  getActiveProductsByCategory: (category: string) => Product[];
}

// Create context with default values
const ProductContext = createContext<ProductContextType>({
  products: [],
  isLoading: true,
  saveNewProduct: async () => false,
  updateExistingProduct: async () => false,
  updateStatus: async () => false,
  updateStock: async () => false,
  removeProduct: async () => false,
  refreshProducts: async () => { },
  getProductsByCategory: () => [],
  getActiveProductsByCategory: () => [],
});

// Provider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from Supabase
  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Import local additional products
      const { additionalProducts } = await import('@/data/additionalProducts');

      if (error) {
        console.error('Error fetching products:', error);
        // Even if DB fails, show local products
        // We'll need to map them to the same structure or ensure they adhere to Product type
        // additionalProducts is already Product[], so we can just use it if DB fails
        setProducts(additionalProducts);
      } else if (data) {
        // Map Supabase data to our Product interface
        const mappedProducts: Product[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          subcategory: p.subcategory,
          price: p.price,
          salePrice: p.sale_price,
          discount: p.discount ? `${p.discount}` : undefined,
          image: p.image_url,
          imageUrl: p.image_url,
          imageUrls: p.images || [],
          link: `/product/${p.id}`,
          alt: p.title,
          stockQuantity: p.stock_quantity,
          viewCount: p.view_count || 0,
          cartCount: 0,
          purchaseCount: 0,
          dateAdded: p.created_at,
          status: p.status,
          description: p.description,
          sizes: p.sizes || [],
          colorName: p.color_name,
          fit: p.fit,
          occasion: p.occasion,
          fabric: p.material || p.fabric,
          colorOptions: p.color_name ? [{ name: p.color_name, code: '#000000' }] : [],
          isAdminUploaded: true,
          // Detailed attributes mapping
          topStyle: p.top_style,
          neckline: p.neckline,
          topPattern: p.top_pattern,
          sleeveDetail: p.sleeve_detail,
          fabricDupattaStole: p.fabric_dupatta_stole,
          liningFabric: p.lining_fabric,
          washCare: p.wash_care,
          bottomFabric: p.bottom_fabric,
        }));

        // Merge with additional products
        // We put additional products first or last? Let's put them first to be seen easily.
        setProducts([...additionalProducts, ...mappedProducts]);
      }
    } catch (err) {
      console.error('Unexpected error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();

    // Real-time subscription
    const subscription = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Real-time product update:', payload);
        refreshProducts(); // Refresh on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Save new product (INSERT)
  const saveNewProduct = async (productData: any) => {
    try {
      // Map to snake_case for Supabase
      const dbProduct = {
        title: productData.title,
        description: productData.description,
        price: productData.price || productData.mrp,
        sale_price: productData.salePrice,
        discount: productData.discount,
        category: productData.category,
        subcategory: productData.subcategory,
        stock_quantity: 100,
        status: productData.status || 'active',
        image_url: productData.imageUrl,
        images: productData.imageUrls || [],
        sizes: productData.sizes || [],
        material: productData.material,
        color_name: productData.colorName,
        sku: productData.sku,
        barcode: productData.barcode,
        video_url: productData.videoUrl,
        meta_title: productData.metaTitle,
        meta_description: productData.metaDescription,
        tags: productData.tags,
        size_stock: productData.sizeStock,
        // Detailed attributes
        top_style: productData.topStyle,
        neckline: productData.neckline,
        top_pattern: productData.topPattern,
        sleeve_detail: productData.sleeveDetail,
        fit: productData.fit,
        occasion: productData.occasion,
        fabric_dupatta_stole: productData.fabricDupattaStole,
        lining_fabric: productData.liningFabric,
        wash_care: productData.washCare,
        bottom_fabric: productData.bottomFabric,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select();

      if (error) {
        console.error('Error saving product:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error saving:', err);
      return false;
    }
  };

  // Update existing product
  const updateExistingProduct = async (product: any) => {
    try {
      const dbProduct = {
        title: product.title,
        description: product.description,
        price: product.price || product.mrp,
        sale_price: product.salePrice,
        discount: product.discount,
        category: product.category,
        subcategory: product.subcategory,
        stock_quantity: product.stockQuantity,
        status: product.status,
        image_url: product.imageUrl,
        images: product.imageUrls || [],
        sizes: product.sizes || [],
        material: product.material,
        color_name: product.colorName,
        sku: product.sku,
        barcode: product.barcode,
        video_url: product.videoUrl,
        meta_title: product.metaTitle,
        meta_description: product.metaDescription,
        tags: product.tags,
        size_stock: product.sizeStock,
        top_style: product.topStyle,
        neckline: product.neckline,
        top_pattern: product.topPattern,
        sleeve_detail: product.sleeveDetail,
        fit: product.fit,
        occasion: product.occasion,
        fabric_dupatta_stole: product.fabricDupattaStole,
        lining_fabric: product.liningFabric,
        wash_care: product.washCare,
        bottom_fabric: product.bottomFabric,
      };

      const { error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', product.id);

      if (error) {
        console.error('Error updating product:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error updating:', err);
      return false;
    }
  };

  // Update product status
  const updateStatus = async (id: number, status: 'active' | 'inactive' | 'draft') => {
    const { error } = await supabase
      .from('products')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      return false;
    }
    return true;
  };

  // Update product stock
  const updateStock = async (id: number, newStock: number) => {
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: newStock })
      .eq('id', id);

    if (error) return false;
    return true;
  };

  // Remove product
  const removeProduct = async (id: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    return true;
  };

  // Get products by category
  const getProductsByCategory = (category: string) => {
    const normalizedCategory = category.toLowerCase().replace(' ', '-');
    return products.filter(product => {
      const prodCat = (product.category || '').toLowerCase().replace(' ', '-');
      return prodCat === normalizedCategory;
    });
  };

  // Get active products by category
  const getActiveProductsByCategory = (category: string) => {
    const normalizedCategory = category.toLowerCase().replace(' ', '-');
    return products.filter(product => {
      const prodCat = (product.category || '').toLowerCase().replace(' ', '-');
      return prodCat === normalizedCategory &&
        product.status === 'active' &&
        (product.stockQuantity || 0) > 0;
    });
  };

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

export const useProducts = () => useContext(ProductContext);
export default ProductContext;