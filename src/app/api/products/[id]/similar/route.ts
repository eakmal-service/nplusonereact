import { NextResponse } from 'next/server';
import { recommendedProducts } from '@/data/mockData';
import { getAllProducts, Product as AdminProduct } from '@/utils/productUtils';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Add a small delay to simulate a real API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const productId = parseInt(params.id);
    
    // Get search parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 4;
    
    // Try to get admin products from localStorage
    // This won't work server-side but will work during client-side navigation
    let adminProducts: AdminProduct[] = [];
    
    // For server-side requests, we'll skip localStorage and use only mock data
    // In a real implementation, we would fetch admin products from a database
    
    // Get a mix of products for the similar products section
    // Filter out the current product
    const similarProducts = recommendedProducts
      .filter(p => p.id !== productId)
      .slice(0, limit)
      .map(p => ({
        id: p.id,
        title: p.title,
        image: p.image,
        imageUrl: p.imageUrl || p.image,
        price: p.price,
        salePrice: p.salePrice || p.price,
        discount: p.discount,
        alt: p.alt || p.title,
        link: `/product/${p.id}`,
        isAdminUploaded: false,
        isGloballyVisible: true,
        responsive: true,
        browserCompatible: true,
        category: p.category || 'clothing',
        subcategory: p.subcategory || '',
        thumbnails: [{
          url: p.image,
          alt: p.alt || p.title
        }],
        availableSizes: p.availableSizes || ['32', '34', '36', '38', '40', '42']
      }));
    
    return NextResponse.json(similarProducts);
  } catch (error) {
    console.error(`Error fetching similar products for ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch similar products' },
      { status: 500 }
    );
  }
} 