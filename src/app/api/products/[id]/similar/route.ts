import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;

    // Get search parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 4;

    // Fetch product to know its category
    const { data: currentProduct } = await supabase
      .from('products')
      .select('category')
      .eq('id', productId)
      .single();

    const category = currentProduct?.category;

    // Fetch similar products (same category, excluding current)
    let query = supabase
      .from('products')
      .select('*')
      .neq('id', productId)
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: similarProducts, error } = await query;

    if (error) {
      console.error('Error fetching similar products:', error);
      return NextResponse.json([]);
    }

    // Map to frontend format
    const mappedProducts = similarProducts.map(p => ({
      id: p.id,
      title: p.title,
      image: p.image_url,
      imageUrl: p.image_url,
      price: p.price,
      salePrice: p.sale_price,
      discount: p.discount,
      alt: p.title,
      link: `/product/${p.id}`,
      isAdminUploaded: true,
      isGloballyVisible: true,
      responsive: true,
      browserCompatible: true,
      category: p.category,
      subcategory: p.subcategory,
      thumbnails: (p.images || []).map((url: string) => ({ url, alt: p.title })),
      availableSizes: p.sizes || ['S', 'M', 'L', 'XL', 'XXL']
    }));

    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error(`Error fetching similar products for ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch similar products' },
      { status: 500 }
    );
  }
}