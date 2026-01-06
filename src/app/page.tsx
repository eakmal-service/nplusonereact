
import React from 'react'
import { createClient } from '@/lib/supabaseServer'
import HeroSlider from '../components/HeroSlider'
import CategoryCards from '../components/CategoryCards'
import MyFavorite from '../components/home/MyFavorite'
import { Product } from '@/types'

// Revalidate every 60 seconds for freshness without page reload on every request
export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient()

  // 1. Fetch CMS Content (Hero, Categories, Collections, Banners)
  // We fetch 'website_content' where section_id IN (...)
  const { data: contentData } = await supabase
    .from('website_content')
    .select('section_id, content')
    .in('section_id', ['home_hero', 'categories', 'collections', 'home_banner', 'favorites'])

  // Parse content into a map
  const contentMap: Record<string, any> = {};
  contentData?.forEach(item => {
    contentMap[item.section_id] = item.content;
  });

  // 2. Fetch New Arrivals (Latest 8 active products)
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(8);

  // Transform products to match Frontend 'Product' type
  // Note: We use a helper similar to ProductContext but adapted for Server
  const getImageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const nameWithoutExt = path.replace(/^\//, '').replace(/\.[^/.]+$/, "");
    return `https://res.cloudinary.com/douy8ujry/image/upload/nplus/${nameWithoutExt}`;
  };

  const newArrivals: Product[] = (productsData || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    brandName: p.brand_name,
    styleCode: p.style_code,
    category: p.category,
    subcategory: p.subcategory,
    price: p.selling_price || p.price, // Prefer selling_price from new schema
    salePrice: p.sale_price,
    discount: p.mrp && p.selling_price ? `${Math.round(((p.mrp - p.selling_price) / p.mrp) * 100)}% OFF` : undefined,
    image: getImageUrl(p.image_url),
    imageUrl: getImageUrl(p.image_url),
    imageUrls: (p.image_urls || []).map((img: string) => getImageUrl(img)),
    link: `/product/${p.id}`,
    alt: p.alt_text || p.title,
    stockQuantity: p.stock_quantity,
    status: p.status,
    description: p.description,
    sizes: p.sizes || [],
    colorName: p.main_color,
    // Add other fields as necessary depending on what RecommendedProducts needs
  }));

  return (
    <>
      {/* Pass Hero Content */}
      {/* Pass Hero Content */}
      <HeroSlider heroContent={Array.isArray(contentMap['home_hero']) ? contentMap['home_hero'][0] : contentMap['home_hero']} />

      {/* Pass Favorites */}
      <MyFavorite favorites={contentMap['favorites']} />

      {/* Pass CMS Data & New Arrivals to CategoryCards (which contains Recommended Section) */}
      <CategoryCards
        categories={contentMap['categories']}
        collections={contentMap['collections']}
        banner={contentMap['home_banner']}
        recommended={newArrivals}
      />
    </>
  )
}