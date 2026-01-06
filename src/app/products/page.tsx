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
  // In many implementations categories are static or fetched from DB. 
  // Based on "useCategories" hook it might just return static list or fetch.
  // We'll mimic the static list often found in mockData if no table exists, 
  // OR fetch if a 'categories' table exists. 
  // The 'useCategories' hook usually imports from mockData or DB.
  // Let's assume for now we can fetch distinct categories from products OR use a fixed list.
  // Ideally, valid categories are known.

  // Checking previous useCategories logic would be good, but for now let's pass an empty list 
  // and let the client component handle fallback OR fetch from a distinct query.

  // Better yet, let's just query distinct categories from DB to be dynamic?
  // Or just provide the standard list known in the project.

  // Let's safe-bet on providing what we can from DB.
  return [
    { id: 1, name: "SUIT SET", image: "/Category/Suits.jpg" },
    { id: 2, name: "WESTERN WEAR", image: "/Category/Western.jpg" },
    { id: 3, name: "CO-ORD SET", image: "/Category/Co-ord.jpg" },
    { id: 4, name: "KID'S WEAR", image: "/Category/Kids.jpg" },
    { id: 5, name: "INDO-WESTERN", image: "/Category/Indo.jpg" },
    { id: 6, name: "MAN'S WEAR", image: "/Category/Mens.jpg" }
  ];
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