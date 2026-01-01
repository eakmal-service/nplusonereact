import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (!query) {
      return NextResponse.json([]);
    }

    // Search through products using ILIKE
    const { data: results, error } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json([], { status: 500 });
    }

    // Map to simple result format
    const mappedResults = results.map(p => ({
      id: p.id,
      title: p.title,
      image: p.image_url,
      imageUrl: p.image_url,
      price: p.price,
      salePrice: p.sale_price,
      link: `/product/${p.id}`,
      alt: p.title
    }));

    return NextResponse.json(mappedResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}