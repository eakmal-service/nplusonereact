import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        // 1. Try to fetch from website_content first (CMS approach)
        const { data: cmsContent, error: cmsError } = await supabase
            .from('website_content')
            .select('content')
            .eq('section_id', 'categories') // Assuming 'categories' is the section ID
            .single();

        if (cmsContent?.content && Array.isArray(cmsContent.content) && cmsContent.content.length > 0) {
            return NextResponse.json(cmsContent.content);
        }

        // 2. Fallback: If CMS content is missing/empty, use static content (verified images)
        // rather than generating plain text placeholders.
        const { categories: staticCategories } = await import('@/data/staticContent');
        if (staticCategories && staticCategories.length > 0) {
            return NextResponse.json(staticCategories);
        }

        // 3. Final Fallback: Distinct categories from products (no images)
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('category')
            .eq('status', 'active');

        if (products) {
            // Unique categories
            const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
                .filter(Boolean)
                .map((cat, index) => ({
                    id: index + 1,
                    name: cat,
                    title: cat?.toUpperCase(),
                    image: '', // Placeholder or default
                    link: `/${cat?.toLowerCase().replace(/\s+/g, '-')}`,
                    alt: cat
                }));

            return NextResponse.json(uniqueCategories);
        }

        return NextResponse.json([]);

    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
