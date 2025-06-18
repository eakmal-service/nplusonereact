"use client";
import { Suspense } from 'react';
import { useProducts } from '@/hooks/useProducts';
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
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const category = searchParams.category ? parseInt(searchParams.category) : undefined;

  const { products, loading: productsLoading, error: productsError } = useProducts({
    page,
    perPage: 12,
    search: searchParams.search,
    category
  });

  const { categories, loading: categoriesLoading } = useCategories();

  if (productsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">
          Error: {productsError.message}
        </div>
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
              selectedCategory={category}
            />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <div className="mb-6">
            <SearchBar defaultValue={searchParams.search} />
          </div>

          {productsLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {products.items.length === 0 ? (
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
                  {products.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {products.pages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={products.pages}
                    baseUrl="/products"
                    searchParams={searchParams}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 