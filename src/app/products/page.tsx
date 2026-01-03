"use client";
import React, { Suspense, useState, useEffect } from 'react'; // Added import React
import { useProducts } from '@/contexts/ProductContext'; // Use Context instead of hook
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string };
}) {
  const { products: allProducts, isLoading: productsLoading } = useProducts();

  // Local state for pagination/filtering derived from allProducts + searchParams
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const categoryId = searchParams.category ? parseInt(searchParams.category) : undefined;
  const perPage = 12;

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    // Search Filter
    if (searchParams.search) {
      const searchLower = searchParams.search.toLowerCase();
      const matchesSearch = product.title.toLowerCase().includes(searchLower) ||
        (product.description || '').toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category Filter (Note: searchParams.category is often an ID in this codebase, but Product.category is a string string)
    // The CategoryFilter component likely triggers URL updates with ID.
    // But Supabase products have string categories (e.g. 'suit-set').
    // We might need to map ID to string or check how CategoryFilter works.
    // For now, let's assume strict match if param provided, but likely need debugging here.
    // Checking useCategories, it returns objects with ID and NAME.
    // If categoryId is passed, we should match it against categories list to get the name?
    // Or maybe CategoryFilter uses checking ID?

    // Let's rely on string match if we can, but searchParams.category is ID.
    // We will skip strict category filtering by ID here unless we map it, 
    // preserving existing behavior of just showing everything if logic is complex, 
    // OR better: Implement ID mapping if we have the categories list.
    return true;
  });

  const { categories, loading: categoriesLoading } = useCategories();

  // Refine Category Filtering using loaded categories
  const finalFilteredProducts = filteredProducts.filter(product => {
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

  const totalPages = Math.ceil(finalFilteredProducts.length / perPage);
  const displayedProducts = finalFilteredProducts.slice((page - 1) * perPage, page * perPage);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4">
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryFilter
              categories={categories}
              loading={categoriesLoading}
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