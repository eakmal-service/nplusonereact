"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProductsPageClientProps {
    initialProducts: Product[];
    categories: any[];
    searchParams: { page?: string; search?: string; category?: string };
}

export default function ProductsPageClient({
    initialProducts,
    categories,
    searchParams,
}: ProductsPageClientProps) {
    // We can use local state or just derive from searchParams/props. 
    // Since searchParams drive the URL, we should rely on them, 
    // but if we want instant client-side filtering without reload, we need state.
    // However, `initialProducts` passed from server are usually ALL products or paginated set.
    // If paginated, client-side filtering is limited.
    // Let's assume initialProducts contains ALL active products for now effectively, 
    // OR we implement server-side filtering via URL params which causes re-render of Server Component,
    // passing new specific data. 

    // Refactoring Plan: The Server Component should handle filtering based on searchParams.
    // So `initialProducts` is ALREADY filtered.
    // But wait, the original code had client-side filtering on allProducts.
    // If we move to Server Component, we should ideally fetch filtered results.
    // For this step, let's keep the exact logic: Pass all products (or fetched products) and filter here?
    // No, optimization means server should do heavy lifting.
    // However, to replicate exact behavior without rewriting backend queries completely:
    // We'll accept `products` as the dataset to display.

    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const perPage = 12;

    // If the server did the filtering, we just paginate. 
    // If the server just sent detailed list, we might need client logic.
    // The original used `useProducts` which fetched EVERYTHING.
    // Let's assume `initialProducts` IS the full list for now to maintain parity,
    // OR better: The Server Component acts as the filter.

    // Let's rely on props being the "Source of Truth" for what to show.
    // But wait! The UI has a SearchBar and CategoryFilter.
    // These usually update URL params.
    // If they update URL, the Server Component re-runs, and passes new `initialProducts`.

    // BUT the original code did client-side filtering:
    // const filteredProducts = allProducts.filter(...)

    // To keep it simple and performant:
    // We will perform client-side filtering on the passed `initialProducts` 
    // IF we decide to pass all products.
    // Given standard e-com, usually we filter on DB.
    // Let's try to filter locally on the passed data to mimic previous behavior exactly,
    // knowing that `initialProducts` is replacing `useProducts().products`.

    const categoryId = searchParams.category ? parseInt(searchParams.category) : undefined;

    console.log(' DEBUG: ProductsPageClient Params:', searchParams);
    console.log(' DEBUG: initialProducts count:', initialProducts.length);
    console.log(' DEBUG: Categories:', categories);
    if (initialProducts.length > 0) {
        console.log(' DEBUG: Sample Product Category:', initialProducts[0].category);
        console.log(' DEBUG: All Product Categories:', Array.from(new Set(initialProducts.map(p => p.category))));
    }

    const filteredProducts = initialProducts.filter(product => {
        // Search Filter
        if (searchParams.search) {
            const searchLower = searchParams.search.toLowerCase();
            const matchesSearch = product.title.toLowerCase().includes(searchLower) ||
                (product.description || '').toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        // Category Filter
        if (categoryId && categories.length > 0) {
            const cat = categories.find(c => c.id === categoryId);
            if (cat) {
                // Match by normalized name (e.g. 'SUIT SET' -> 'suit-set')
                const productCat = (product.category || '').toLowerCase().replace(/ /g, '-');
                const filterCat = (cat.name || '').toLowerCase().replace(/ /g, '-');
                return productCat === filterCat;
            }
        }
        return true;
    });

    const totalPages = Math.ceil(filteredProducts.length / perPage);
    const displayedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar with filters */}
                <div className="w-full md:w-1/4">
                    <Suspense fallback={<LoadingSpinner />}>
                        <CategoryFilter
                            categories={categories}
                            loading={false}
                            selectedCategory={categoryId}
                        />
                    </Suspense>
                </div>

                {/* Main content */}
                <div className="w-full md:w-3/4">
                    <div className="mb-6">
                        <SearchBar defaultValue={searchParams.search} />
                    </div>

                    {displayedProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-semibold text-gray-600">
                                No products found
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                baseUrl="/products"
                                searchParams={searchParams}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
