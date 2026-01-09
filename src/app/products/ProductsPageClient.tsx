"use client";

import React, { Suspense } from 'react';
import { Product } from '@/types';
import EnhancedProductGrid from '@/components/common/EnhancedProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProductsPageClientProps {
    initialProducts: Product[];
    categories: any[];
    searchParams: { page?: string; search?: string; category?: string };
}

export default function ProductsPageClient({
    initialProducts,
}: ProductsPageClientProps) {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-4">
                <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-silver"></div>
                    </div>
                }>
                    <EnhancedProductGrid products={initialProducts} title="All Products" />
                </Suspense>
            </div>
        </div>
    );
}

