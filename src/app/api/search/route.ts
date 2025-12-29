import { NextResponse } from 'next/server';
import { recommendedProducts } from '@/data/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (!query) {
      return NextResponse.json([]);
    }

    // Search through products
    const results = recommendedProducts.filter(product =>
      product.title.toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}