"use client";

import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types';

interface UseCategoriesOptions {
    search?: string;
    parentId?: number;
    initialData?: Category[];
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();

            // Filter logic if needed (e.g., search)
            let filteredCategories = Array.isArray(data) ? data : [];

            if (options.search) {
                const searchLower = options.search.toLowerCase();
                filteredCategories = filteredCategories.filter((c: Category) =>
                    c.title?.toLowerCase().includes(searchLower)
                );
            }

            setCategories(filteredCategories);
        } catch (err) {
            console.error('Error loading categories:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        } finally {
            setLoading(false);
        }
    }, [options.search]);

    useEffect(() => {
        if (options.initialData) {
            setCategories(options.initialData);
            setLoading(false);
            return;
        }
        fetchCategories();
    }, [fetchCategories, options.initialData]);

    return {
        categories: options.initialData || categories,
        loading,
        error,
        refetch: fetchCategories
    };
}; 