"use client";

import React from 'react';
import Link from 'next/link';
import CategoryProductsGrid from '../../components/common/CategoryProductsGrid';
import { useProducts } from '../../contexts/ProductContext';

import ProductGridSkeleton from '../../components/common/ProductGridSkeleton';

export default function CoOrdSetsPage() {
  const { getActiveProductsByCategory, isLoading } = useProducts();
  const products = getActiveProductsByCategory('co-ord-sets');

  return (
    <div className="min-h-screen bg-custom-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-silver">CO-ORD SETS</h1>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length > 0 ? (
          <CategoryProductsGrid products={products} />
        ) : (
          <div className="text-center py-16">
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