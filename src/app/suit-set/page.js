"use client";

import React from 'react';
import Link from 'next/link';
import EnhancedProductGrid from '../../components/common/EnhancedProductGrid';
import { useProducts } from '../../contexts/ProductContext';

export default function SuitSetPage() {
    const { getActiveProductsByCategory, isLoading } = useProducts();
    const products = getActiveProductsByCategory('suit-set');

    return (
        <div className="min-h-screen bg-custom-black text-white pt-24 pb-16">
            <div className="container mx-auto px-4">

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-silver"></div>
                    </div>
                ) : products.length > 0 ? (
                    <EnhancedProductGrid products={products} title="Suit Set" />
                ) : (
                    <div className="text-center py-16">
                        <h1 className="text-3xl font-bold mb-6 text-silver">Suit Set</h1>
                        <p className="text-xl mb-4">No products found in this category.</p>
                        <Link href="/" className="inline-block bg-silver hover:bg-gray-300 text-black font-medium px-6 py-2 rounded transition">
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
