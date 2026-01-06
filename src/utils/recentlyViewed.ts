import { Product } from '@/types';

const MAX_RECENT_ITEMS = 8;
const STORAGE_KEY = 'recentlyViewed';

export const addToRecentlyViewed = (product: Product) => {
    if (typeof window === 'undefined') return;

    try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        let currentItems: Product[] = Array.isArray(existing) ? existing : [];

        // Remove duplicates (based on ID)
        currentItems = currentItems.filter(p => p.id !== product.id);

        // Add new product to the beginning (most recent)
        currentItems.unshift(product);

        // Limit to MAX_RECENT_ITEMS
        if (currentItems.length > MAX_RECENT_ITEMS) {
            currentItems = currentItems.slice(0, MAX_RECENT_ITEMS);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems));
    } catch (error) {
        console.error("Error updating recently viewed products:", error);
    }
};

export const getRecentlyViewed = (): Product[] => {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
};
