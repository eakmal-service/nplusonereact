import { NextResponse } from 'next/server';
import { recommendedProducts } from '@/data/mockData';
import { Product } from '@/types';

export async function GET(request: Request) {
  try {
    // Add a small delay to simulate a real API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get search parameters (for category filtering)
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Filter products by category if provided
    let products = recommendedProducts;
    if (category) {
      // Since Product doesn't have a category field, we'll check if title contains the category term
      products = products.filter((p: Product) => 
        p.title.toLowerCase().includes(category.toLowerCase()) ||
        p.description?.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 