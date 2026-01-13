"use client";

import React from 'react';
import Link from 'next/link';
import EnhancedProductGrid from '../../components/common/EnhancedProductGrid';
import { useProducts } from '../../contexts/ProductContext';

import ProductGridSkeleton from '../../components/common/ProductGridSkeleton';

export default function CoOrdSetsPage() {
  const { getActiveProductsByCategory, isLoading } = useProducts();
  const products = getActiveProductsByCategory('CO-ORD SET');

  return (
    <div className="min-h-screen bg-custom-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-silver">CO-ORD SETS</h1>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <EnhancedProductGrid products={products} title="CO-ORD SETS" />
        )}
      </div>
    </div>
  );
} 