
import React from 'react';
import { createClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import CategoryProductList from './CategoryProductList';


// Helper to generate static params (Optional, but good for SEO/Performance if needed)
// export async function generateStaticParams() {
//    const supabase = createClient();
//    const { data: categories } = await supabase.from('categories').select('slug');
//    return (categories || []).map((cat) => ({
//        slug: cat.slug,
//    }));
// }

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const supabase = createClient();
    const { data: categoryData } = await supabase
        .from('categories')
        .select('name, description')
        .eq('slug', params.slug)
        .single();

    // Cast to any to handle missing types safely
    const category = categoryData as any;

    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} | NPlusOne Fashion`,
        description: category.description || `Shop the latest ${category.name} collection.`,
    };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const supabase = createClient();

    // Fetch Category Name and ID by Slug
    const { data: categoryData, error } = await supabase
        .from('categories')
        .select('id, name, slug, image_url, level')
        .eq('slug', params.slug)
        .single();

    if (error || !categoryData) {
        return notFound();
    }

    const category = categoryData as any;

    // Fetch children categories to include in product filtering
    // This ensures "Women's Wear" shows "Suit Set", "Western Wear" etc. products
    const { data: childrenData } = await supabase
        .from('categories')
        .select('name')
        .eq('parent_id', category.id);

    // Construct a list of all relevant category names for filtering
    // Start with the current category (e.g. "Women's Wear")
    const categoryNames = [category.name];

    // Add children (e.g. "Suit Set", "Western Wear")
    if (childrenData) {
        childrenData.forEach((c: any) => {
            if (c.name) categoryNames.push(c.name);
        });
    }

    // Note: If there are Level 2 categories (grandchildren), we might need deeper recursion.
    // However, given the current structure, Level 1 children should cover the products if products are tagged with Level 1.
    // If products are tagged with Level 2 (e.g. "All Suit Sets"), we technically need those too.
    // Let's assume 1 level deep is sufficient for now based on user's "all products" request which likely implies immediate subcategories.
    // Or we can simple use the 'products' table inspection which showed they are mostly Level 1 tags like "Suit Set".

    return (
        <div className="container mx-auto px-4 py-8">
            <CategoryProductList
                categoryName={category.name}
                searchCategories={categoryNames}
            />
        </div>
    );
}
