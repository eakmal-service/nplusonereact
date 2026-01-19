"use client";

import React from 'react';
import Link from 'next/link';
import EnhancedProductGrid from '@/components/common/EnhancedProductGrid';
import { useProducts } from '@/contexts/ProductContext';
import ProductGridSkeleton from '@/components/common/ProductGridSkeleton';

interface CategoryProductListProps {
    categoryName: string;
    searchCategories?: string[]; // Optional list of categories to search for (including children)
}

export default function CategoryProductList({ categoryName, searchCategories }: CategoryProductListProps) {
    const { getActiveProductsByCategory, getActiveProductsByCategories, isLoading } = useProducts();

    // Choose search method: specific list (for Parents) or single name (fallback)
    const products = searchCategories && searchCategories.length > 0
        ? getActiveProductsByCategories(searchCategories)
        : getActiveProductsByCategory(categoryName);

    return (
        <div className="min-h-screen bg-custom-black text-white pt-24 pb-16">
            <div className="container mx-auto px-4">

                {isLoading ? (
                    <ProductGridSkeleton count={8} />
                ) : products.length > 0 ? (
                    <EnhancedProductGrid products={products} title={categoryName} />
                ) : (
                    <div className="text-center py-16">
                        <h1 className="text-3xl font-bold mb-6 text-silver">{categoryName}</h1>
                        <p className="text-xl mb-4 text-gray-400">No products found in this category.</p>
                        <Link href="/" className="inline-block bg-silver hover:bg-gray-300 text-black font-medium px-6 py-2 rounded transition">
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
