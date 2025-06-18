"use client";
import { useState, useEffect, useCallback } from 'react';

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
    const [error, setError] = useState<Error | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setError(null);
            // Placeholder for the removed getProducts function
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        }
    }, []);

    useEffect(() => {
        if (options.initialData) {
            return;
        }
        fetchProducts();
    }, [fetchProducts, options.initialData]);

    return {
        products: options.initialData || [],
        loading: false,
        error,
        refetch: fetchProducts
    };
}; 