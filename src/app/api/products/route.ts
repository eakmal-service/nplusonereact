import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limit = searchParams.get('limit');

        let query = supabase
            .from('products')
            .select('*')
            .eq('status', 'active'); // Only fetch active products by default

        if (category) {
            query = query.eq('category', category);
        }

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        // Default sort by creation date desc
        query = query.order('created_at', { ascending: false });

        const { data: products, error } = await query;

        if (error) {
            throw error;
        }

        // Map DB fields to frontend expected fields (matching [id]/route.ts logic)
        const enrichedProducts = (products || []).map(product => ({
            id: product.id,
            title: product.title,
            brandName: product.brand_name,
            styleCode: product.style_code,
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
            alt: product.alt_text || product.title,
            description: product.description,

            // UI-specific fields
            isAdminUploaded: true,
            isGloballyVisible: true,
            responsive: true,
            browserCompatible: true,

            // Product details
            fabric: product.fabric || product.material,
            workType: product.work_type,
            neckline: product.neck_design || product.neckline || 'Round Neck',
            sleeveDetail: product.sleeve_length || product.sleeve_detail || '3/4 Sleeves',
            fit: product.fit_type || product.fit || 'Straight',
            bottomType: product.bottom_type,
            setContains: product.set_contains,
            productWeight: product.product_weight,
            washCare: product.wash_care,
            searchKeywords: Array.isArray(product.search_keywords) ? product.search_keywords.join(', ') : product.search_keywords,

            hsnCode: product.hsn_code,
            gstPercentage: product.gst_percentage,
            sizeSkus: product.sku_map,

            topStyle: product.top_style || 'Flared',
            topPattern: product.top_pattern || 'Embroidered',
            bottomFabric: product.bottom_fabric || 'Rayon',
            fabricDupattaStole: product.fabric_dupatta_stole || 'Chanderi',
            liningFabric: product.lining_fabric || 'Cotton',
            sizeChartHtml: product.size_chart_html,

            // Size and images
            availableSizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
            sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
            colorOptions: product.color_options || [],

            images: (product.image_urls || product.images || []).map((url: string) => ({ url, alt: product.title })),
            thumbnails: (product.image_urls || product.images || []).map((url: string) => ({ url, alt: product.title })),
            imageUrls: product.image_urls || product.images || [product.image_url]
        }));

        return NextResponse.json(enrichedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
