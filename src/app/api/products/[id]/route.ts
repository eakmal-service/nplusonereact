import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for API routes if needed, or anon if public
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;

    // Fetch from Supabase
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    // If Supabase fetch failed or product not found, check additionalProducts
    if (error || !product) {
      const { additionalProducts } = await import('@/data/additionalProducts');
      const localProduct = additionalProducts.find(p => p.id.toString() === productId);

      if (localProduct) {
        return NextResponse.json(localProduct);
      }

      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Map DB fields to frontend expected fields
    const enrichedProduct = {
      id: product.id,
      title: product.title,
      image: product.image_url,
      imageUrl: product.image_url,
      price: product.price,
      salePrice: product.sale_price,
      discount: product.discount || '',
      category: product.category,
      subcategory: product.subcategory,
      stockQuantity: product.stock_quantity,
      status: product.status,
      link: `/product/${product.id}`,
      alt: product.title,
      description: product.description,

      // UI-specific fields
      isAdminUploaded: true,
      isGloballyVisible: true,
      responsive: true,
      browserCompatible: true,

      // Product details
      topStyle: 'Flared', // Default or fetch if exists
      topPattern: 'Embroidered',
      bottomFabric: product.material || 'Cotton',
      fabricDupattaStole: product.material || 'Cotton',
      neckline: 'Round Neck',
      sleeveDetail: '3/4 Sleeves',
      liningFabric: 'Cotton',
      fabric: product.material || 'Cotton',
      washCare: 'Hand wash or machine wash in cold water. Do not bleach. Dry in shade. Medium iron. Do not dry clean.',
      sizeChartHtml: product.size_chart_html, // Assuming this might be added later

      // Size and images
      availableSizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
      images: (product.images || []).map((url: string) => ({ url, alt: product.title })),
      thumbnails: (product.images || []).map((url: string) => ({ url, alt: product.title })),
      imageUrls: product.images || [product.image_url]
    };

    return NextResponse.json(enrichedProduct);
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}