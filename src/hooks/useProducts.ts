"use client";
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';

interface UseProductsOptions {
    page?: number;
    perPage?: number;
    search?: string;
    category?: number;
    initialData?: {
        items: Product[];
        total: number;
        pages: number;
    };
}

export const useProducts = (options: UseProductsOptions = {}) => {
    const [products, setProducts] = useState<{
        items: Product[];
        total: number;
        pages: number;
    }>({ items: [], total: 0, pages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // In a real app, this would be an API call
            // For now, we'll use the mock data
            const { recommendedProducts } = await import('@/data/mockData');

            // Basic filtering simulation
            let filteredItems = [...recommendedProducts];

            if (options.search) {
                const searchLower = options.search.toLowerCase();
                filteredItems = filteredItems.filter(p =>
                    p.title.toLowerCase().includes(searchLower) ||
                    p.description?.toLowerCase().includes(searchLower)
                );
            }

            // Pagination simulation
            const page = options.page || 1;
            const perPage = options.perPage || 12;
            const start = (page - 1) * perPage;
            const end = start + perPage;
            const paginatedItems = filteredItems.slice(start, end);
            const totalPages = Math.ceil(filteredItems.length / perPage);

            setProducts({
                items: paginatedItems,
                total: filteredItems.length,
                pages: totalPages
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        } finally {
            setLoading(false);
        }
    }, [options.page, options.perPage, options.search, options.category]);

    useEffect(() => {
        if (options.initialData) {
            setProducts(options.initialData);
            setLoading(false);
            return;
        }
        fetchProducts();
    }, [fetchProducts, options.initialData]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts
    };
}; 