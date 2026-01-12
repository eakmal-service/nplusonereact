import React from 'react';
import { createClient } from '@supabase/supabase-js';
import ProductsPageClient from './ProductsPageClient';
import { Product } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request if needed, or omit for caching

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
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
    topStyle: p.top_style,
    neckline: p.neckline,
    topPattern: p.top_pattern,
    sleeveDetail: p.sleeve_detail,
    fabricDupattaStole: p.fabric_dupatta_stole,
    liningFabric: p.lining_fabric,
    washCare: p.wash_care,
    bottomFabric: p.bottom_fabric,
  }));
}

async function getCategories() {
  // Try to fetch from website_content first (CMS approach)
  const { data: cmsContent } = await supabase
    .from('website_content')
    .select('content')
    .eq('section_id', 'categories')
    .single();

  if (cmsContent?.content && Array.isArray(cmsContent.content) && cmsContent.content.length > 0) {
    return cmsContent.content;
  }

  // Fallback: Fetch distinct categories from products
  const { data: products } = await supabase
    .from('products')
    .select('category')
    .eq('status', 'active');

  if (products) {
    const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category)))
      .filter(Boolean)
      .map((cat: any, index: number) => ({
        id: index + 1,
        name: cat,
        title: cat?.toUpperCase(),
        image: '', // Placeholder
        link: `/${cat?.toLowerCase().replace(/\s+/g, '-')}`,
        alt: cat
      }));
    return uniqueCategories;
  }

  return [];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string };
}) {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <ProductsPageClient
      initialProducts={products}
      categories={categories}
      searchParams={searchParams}
    />
  );
}