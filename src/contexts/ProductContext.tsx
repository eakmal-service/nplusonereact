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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products from Supabase
  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } else if (data) {
        // Helper to convert DB path to Cloudinary URL
        const getImageUrl = (path: string | null) => {
          if (!path) return '';
          if (path.startsWith('http')) return path; // Already absolute (e.g. from Admin upload)

          // Convert legacy relative path: "products/D3P_1/1.webp" -> Cloudinary URL
          // Cloudinary Public ID structure from script: "nplus/products/D3P_1/1"
          const nameWithoutExt = path.replace(/^\//, '').replace(/\.[^/.]+$/, "");
          // Added f_auto,q_auto for optimization
          return `https://res.cloudinary.com/douy8ujry/image/upload/f_auto,q_auto/nplus/${nameWithoutExt}`;
        };

        // Map Supabase data to our Product interface
        const mappedProducts: Product[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          brandName: p.brand_name,
          styleCode: p.style_code,
          category: p.category,
          subcategory: p.subcategory,
          price: p.price,
          salePrice: p.sale_price,
          discount: p.discount ? `${p.discount}` : undefined,
          image: getImageUrl(p.image_url),
          imageUrl: getImageUrl(p.image_url),
          imageUrls: (p.image_urls || p.images || []).map((img: string) => getImageUrl(img)),
          link: `/product/${p.id}`,
          alt: p.alt_text || p.title,
          stockQuantity: p.stock_quantity,
          viewCount: p.view_count || 0,
          cartCount: 0,
          purchaseCount: p.purchase_count || 0,
          dateAdded: p.created_at,
          status: p.status,
          description: p.description,
          sizes: p.sizes || [],
          colorName: p.main_color || p.color_name,
          // Mapping Detailed Specs
          fabric: p.fabric || p.material,
          workType: p.work_type,
          neckline: p.neck_design || p.neckline,
          sleeveDetail: p.sleeve_length || p.sleeve_detail,
          fit: p.fit_type || p.fit,
          bottomType: p.bottom_type,
          setContains: p.set_contains,
          productWeight: p.product_weight,
          washCare: p.wash_care,
          searchKeywords: Array.isArray(p.search_keywords) ? p.search_keywords.join(', ') : p.search_keywords,

          sizeSkus: p.sku_map,
          hsnCode: p.hsn_code,
          gstPercentage: p.gst_percentage,

          colorOptions: p.color_options || (p.main_color ? [{ name: p.main_color, code: '#000000' }] : []),
          isAdminUploaded: true,

          // Legacy/Fallback mapping
          topStyle: p.top_style,
          topPattern: p.top_pattern,
          fabricDupattaStole: p.fabric_dupatta_stole,
          liningFabric: p.lining_fabric,
          bottomFabric: p.bottom_fabric,
        }));

        setProducts(mappedProducts);
      }
    } catch (err) {
      console.error('Unexpected error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch products on mount to ensure data availability
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
    // Normalize input category: "suit set" -> "suit-set"
    const normalizedCategory = category.toLowerCase().trim().replace(/\s+/g, '-');

    // Debug filtering
    const allMatches = products.filter(p => {
      const prodCat = (p.category || '').toLowerCase().trim().replace(/\s+/g, '-');
      return prodCat === normalizedCategory;
    });

    console.log(`[ProductContext] Filtering for category: "${category}" (norm: "${normalizedCategory}")`);
    console.log(`[ProductContext] Total products in context: ${products.length}`);
    console.log(`[ProductContext] Found ${allMatches.length} matches by name BEFORE status checks.`);

    return products.filter(product => {
      const prodCat = (product.category || '').toLowerCase().trim().replace(/\s+/g, '-');
      // Relaxed matching - check if it INCLUDES the category to handle "Women's Suit Set" matching "Suit Set" if needed
      // But for now, strict equality on normalized string is best.

      const isMatch = prodCat === normalizedCategory;
      const isActive = product.status === 'active';
      const hasStock = (product.stockQuantity || 0) > 0;

      if (isMatch && (!isActive || !hasStock)) {
        console.log(`[ProductContext] Skipped "${product.title}" - Status: ${product.status}, Stock: ${product.stockQuantity}`);
      }

      return isMatch && isActive && hasStock;
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