
import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/types';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Function to fetch product data using Server Client
async function getProduct(id: string): Promise<Product | null> {
  const supabase = createClient();

  // 1. Fetch from Supabase
  const { data: product, error } = await (supabase
    .from('products') as any)
    .select('*')
    .eq('id', id)
    .single();

  if (product) {
    // Helper to convert DB path to URL
    const getImageUrl = (path: string | null) => {
      if (!path) return '';
      let url = path;
      // If absolute URL, return as is (but optimized below)
      if (!path.startsWith('http')) {
        // If already starts with /, return as is
        if (path.startsWith('/')) {
          url = path;
        } else {
          // Otherwise, assume relative path in public folder and prepend /
          url = `/${path}`;
        }
      }
      return optimizeCloudinaryUrl(url);
    };

    // Map Supabase data to Product interface
    return {
      id: product.id,
      title: product.title,
      brandName: product.brand_name,
      styleCode: product.style_code,
      category: product.category,
      subcategory: product.subcategory,
      price: product.mrp, // Map MRP to price (matches Strikethrough logic)
      salePrice: product.selling_price || product.mrp, // Map Selling Price to salePrice (matches Main Price)
      discount: product.mrp && product.selling_price ? `${Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)}% OFF` : undefined,
      image: getImageUrl(product.image_url),
      imageUrl: getImageUrl(product.image_url),
      imageUrls: (product.image_urls || product.images || []).map((img: string) => getImageUrl(img)),
      link: `/product/${product.id}`,
      alt: product.alt_text || product.title,
      stockQuantity: product.stock_quantity,
      viewCount: product.view_count || 0,
      cartCount: 0,
      purchaseCount: product.purchase_count || 0,
      dateAdded: product.created_at,
      status: product.status,
      description: product.description,
      sizes: product.sizes || [],

      // Detailed attributes mapping
      fit: product.fit_type,
      occasion: product.occasion, // 'occasion' column might be missing, check implementation_plan or types
      fabric: product.fabric || product.material, // fallback to material if fabric is empty
      colorOptions: product.color_options ? product.color_options : (product.main_color ? [{ name: product.main_color, code: '#000000' }] : []),
      isAdminUploaded: true,

      // Legacy Mappings
      topStyle: product.top_style,
      neckline: product.neck_design,
      topPattern: product.top_pattern,
      sleeveDetail: product.sleeve_length,
      fabricDupattaStole: product.fabric_dupatta_stole,
      liningFabric: product.lining_fabric,
      washCare: product.wash_care,
      bottomFabric: product.bottom_type, // Mapping bottom_type to bottomFabric for UI compatibility
      bottomType: product.bottom_type, // Also mapping to bottomType for correctness
      setContains: product.set_contains,
      workType: product.work_type,
      productWeight: product.product_weight != null ? String(product.product_weight) : '' // Handle number or string
      // Let's stick to what schema has: schema has bottom_type and bottom_fabric.
      // Wait, schema has bottom_type. Old implementation had bottomFabric. 
      // Let's use bottom_fabric if it exists in schema (it was added in superschema)
    };
  }

  return null;
}

async function getSimilarProducts(id: string, category: string): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', id)
    .limit(4);

  if (data) {
    return data.map((p: any) => {
      // Calculate Badge
      let badge = undefined;
      const mrp = p.mrp;
      const selling = p.selling_price || p.mrp;

      // 1. Discount Badge
      if (mrp && selling && mrp > selling) {
        const percentage = Math.round(((mrp - selling) / mrp) * 100);
        if (percentage > 0) {
          badge = `${percentage}% OFF`;
        }
      }

      // 2. New Badge
      if (!badge && p.created_at) {
        const createdAt = new Date(p.created_at);
        const timeDiff = Math.abs(new Date().getTime() - createdAt.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays <= 30) {
          badge = 'New';
        }
      }

      const getImageUrl = (path: string | null) => {
        if (!path) return '';
        if (path.startsWith('http')) return optimizeCloudinaryUrl(path);
        const nameWithoutExt = path.replace(/^\//, '').replace(/\.[^/.]+$/, "");
        return optimizeCloudinaryUrl(`https://res.cloudinary.com/douy8ujry/image/upload/nplus/${nameWithoutExt}`);
      };

      return {
        id: p.id,
        title: p.title,
        category: p.category,
        originalPrice: p.mrp,
        price: p.mrp,
        salePrice: p.selling_price, // Ensure salePrice is mapped for compatibility
        discount: badge && badge.includes('%') ? badge : undefined,
        badge: badge,
        image: getImageUrl(p.image_url),
        imageUrl: getImageUrl(p.image_url),
        imageUrls: (p.image_urls || []).map((img: string) => getImageUrl(img)),
        link: `/product/${p.id}`,
        alt: p.alt_text || p.title,
        stockQuantity: p.stock_quantity,
        status: p.status,
        sizes: p.sizes || [],
        dateAdded: p.created_at
      };
    });
  }
  return [];
}

// Generate Metadata for SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.title} | NPlusOne`,
    description: product.description?.substring(0, 160) || `Buy ${product.title} at best price.`,
    openGraph: {
      title: product.title,
      description: product.description?.substring(0, 160),
      url: `https://nplusonefashion.com/product/${product.id}`,
      siteName: 'NPlusOne Fashion',
      images: [
        {
          url: optimizeCloudinaryUrl(product.image || product.imageUrl || ''),
          width: 800,
          height: 600,
          alt: product.alt || product.title,
        },
        ...previousImages,
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description?.substring(0, 160),
      images: [product.image || product.imageUrl || ''],
    },
  };
}

export default async function Page({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(params.id, product.category || '');

  return (
    <ProductDetailClient product={product} similarProducts={similarProducts} />
  );
}