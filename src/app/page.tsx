
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
  const { data: contentData } = await (supabase
    .from('website_content') as any)
    .select('section_id, content')
    .in('section_id', ['home_hero', 'categories', 'collections', 'home_banner', 'favorites'])

  // Parse content into a map
  const contentMap: Record<string, any> = {};
  (contentData as any[])?.forEach((item: any) => {
    contentMap[item.section_id] = item.content;
  });

  // 2. Fetch New Arrivals (Latest 8 active products)
  const { data: productsData } = await (supabase
    .from('products') as any)
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(8);

  // 3. Fetch Dynamic Categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .eq('is_visible', true)
    .eq('level', 0) // Only fetch top-level categories (Women, Men, Kids)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  const dynamicCategories = (categoriesData || []).map((cat: any) => ({
    id: cat.id,
    title: cat.name,
    image: cat.image_url || '/placeholder.png', // Add placeholder logic if needed
    link: `/category/${cat.slug}`,
    alt: cat.name
  }));

  // Transform products to match Frontend 'Product' type
  // Note: We use a helper similar to ProductContext but adapted for Server
  const getImageUrl = (path: string | null) => {
    if (!path) return '';
    // If absolute URL, return as is
    if (path.startsWith('http')) return path;
    // If already starts with /, return as is
    if (path.startsWith('/')) return path;
    // Otherwise, assume relative path in public folder and prepend /
    return `/${path}`;
  };

  const newArrivals: Product[] = (productsData || []).map((p: any) => {
    // Badge Login
    let badge = undefined;
    const createdAt = new Date(p.created_at);
    const timeDiff = Math.abs(new Date().getTime() - createdAt.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Logic: Show discount % if available (Sale), otherwise 'New' if < 30 days
    // User requested specific badge "64% OFF" in red.
    const discountText = p.mrp && p.selling_price ? `${Math.round(((p.mrp - p.selling_price) / p.mrp) * 100)}% OFF` : undefined;

    if (discountText) {
      badge = discountText;
    } else if (diffDays <= 30) {
      badge = 'New';
    }

    return {
      id: p.id,
      title: p.title,
      brandName: p.brand_name,
      styleCode: p.style_code,
      category: p.category,
      subcategory: p.subcategory,
      price: p.selling_price || p.price,
      salePrice: p.sale_price,
      originalPrice: p.mrp,
      discount: p.mrp && p.selling_price ? `${Math.round(((p.mrp - p.selling_price) / p.mrp) * 100)}% OFF` : undefined,
      image: getImageUrl(p.image_url),
      imageUrl: getImageUrl(p.image_url),
      imageUrls: (p.image_urls || []).map((img: string) => getImageUrl(img)),
      // Map to 'images' for QuickView compatibility
      images: (p.image_urls || []).map((img: string) => ({
        url: getImageUrl(img),
        alt: p.alt_text || p.title
      })),
      link: `/product/${p.id}`,
      alt: p.alt_text || p.title,
      stockQuantity: p.stock_quantity,
      status: p.status,
      description: p.description,
      sizes: p.sizes || [],
      colorName: p.main_color,
      badge: badge,
    };
  });

  return (
    <>
      {/* Pass Hero Content */}
      {/* Pass Hero Content */}
      <HeroSlider heroContent={Array.isArray(contentMap['home_hero']) ? contentMap['home_hero'][0] : contentMap['home_hero']} />

      {/* Pass Favorites */}
      <MyFavorite favorites={contentMap['favorites']} />

      {/* Pass CMS Data & New Arrivals to CategoryCards (which contains Recommended Section) */}
      <CategoryCards
        categories={dynamicCategories.length > 0 ? dynamicCategories : contentMap['categories']}
        collections={contentMap['collections']}
        banner={contentMap['home_banner']}
        recommended={newArrivals}
      />
    </>
  )
}