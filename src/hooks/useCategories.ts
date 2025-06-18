"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseCategoriesOptions {
    search?: string;
    parentId?: number;
    initialData?: Category[];
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
    const [error, setError] = useState<Error | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setError(null);
            // Placeholder for the removed getCategories function
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        }
    }, []);

    useEffect(() => {
        if (options.initialData) {
            return;
        }
        fetchCategories();
    }, [fetchCategories, options.initialData]);

    return {
        categories: options.initialData || [],
        loading: false,
        error,
        refetch: fetchCategories
    };
}; 