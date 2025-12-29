"use client";

import React from 'react';
import CategoryProductsGrid from '@/components/common/CategoryProductsGrid';
import { useProducts } from '@/contexts/ProductContext';
import Link from 'next/link';

export default function ProductShowcasePage() {
    const { products, isLoading } = useProducts();

    // Filter active products just in case
    const activeProducts = products.filter(p => p.status === 'active');

    return (
        <div className="min-h-screen bg-black text-silver pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-silver">Product Showcase</h1>
                    {/* Breadcrumb or secondary silver text if needed */}
                    <span className="text-silver opacity-80">Collection 2025</span>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-silver"></div>
                    </div>
                ) : activeProducts.length > 0 ? (
                    <CategoryProductsGrid products={activeProducts} />
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl mb-4 text-silver">No products found.</p>
                        <Link href="/" className="inline-block bg-silver hover:bg-gray-400 text-black font-medium px-6 py-2 rounded transition">
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
