"use client";

import React, { useState, useEffect, useMemo } from 'react';
import ProductFilters, { FilterState } from './ProductFilters';
import ProductSort from './ProductSort';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface EnhancedProductGridProps {
    products: Product[];
    title: string;
}

const EnhancedProductGrid: React.FC<EnhancedProductGridProps> = ({ products: initialProducts, title }) => {
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        priceRange: [0, 100000],
        sizes: [],
        colors: [],
        discount: null,
        fabrics: [],
        fits: [],
        occasions: []
    });
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Initialize price range based on actual products
    useEffect(() => {
        if (initialProducts.length > 0) {
            const prices = initialProducts.map(p => {
                const pStr = p.salePrice || p.price;
                if (typeof pStr === 'number') return pStr;
                return pStr ? (parseInt(pStr.replace(/[^0-9]/g, '')) || 0) : 0;
            });
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setActiveFilters(prev => ({ ...prev, priceRange: [Math.floor(min / 100) * 100, Math.ceil(max / 100) * 100] }));
        }
    }, [initialProducts]);


    // Helper to parse price
    const parsePrice = (priceStr: string | number | undefined) => {
        if (!priceStr) return 0;
        if (typeof priceStr === 'number') return priceStr;
        return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    };

    // Helper to parse discount
    const parseDiscount = (discountStr: string | number | undefined) => {
        if (!discountStr) return 0;
        if (typeof discountStr === 'number') return discountStr;
        return parseInt(discountStr.replace(/[^0-9]/g, '')) || 0;
    };


    const filteredAndSortedProducts = useMemo(() => {
        let result = [...initialProducts];

        // 1. Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => {
                const title = p.title.toLowerCase();
                const desc = p.description ? p.description.toLowerCase() : '';
                return title.includes(query) || desc.includes(query);
            });
        }

        // 2. Filters
        // Price
        result = result.filter(p => {
            const price = parsePrice(p.salePrice || p.price);
            return price >= activeFilters.priceRange[0] && price <= activeFilters.priceRange[1];
        });

        // Sizes
        if (activeFilters.sizes.length > 0) {
            result = result.filter(p => {
                const pSizes = new Set([...(p.sizes || []), ...(p.availableSizes || [])]);
                return activeFilters.sizes.some(s => pSizes.has(s));
            });
        }

        // Colors
        if (activeFilters.colors.length > 0) {
            result = result.filter(p => {
                if (!p.colorOptions) return false;
                return p.colorOptions.some(c => activeFilters.colors.includes(c.name));
            });
        }

        // Fabrics
        if (activeFilters.fabrics.length > 0) {
            result = result.filter(p => {
                if (!p.fabric) return false;
                return activeFilters.fabrics.includes(p.fabric);
            });
        }

        // Fits
        if (activeFilters.fits.length > 0) {
            result = result.filter(p => {
                if (!p.fit) return false;
                return activeFilters.fits.includes(p.fit);
            });
        }

        // Occasions
        if (activeFilters.occasions.length > 0) {
            result = result.filter(p => {
                if (!p.occasion) return false;
                return activeFilters.occasions.includes(p.occasion);
            });
        }



        // Discount
        if (activeFilters.discount !== null) {
            result = result.filter(p => {
                const disc = parseDiscount(p.discount);
                return disc >= activeFilters.discount!;
            });
        }

        // 3. Sort
        switch (sortBy) {
            case 'price_low_high':
                result.sort((a, b) => parsePrice(a.salePrice || a.price) - parsePrice(b.salePrice || b.price));
                break;
            case 'price_high_low':
                result.sort((a, b) => parsePrice(b.salePrice || b.price) - parsePrice(a.salePrice || a.price));
                break;
            case 'discount':
                result.sort((a, b) => parseDiscount(b.discount) - parseDiscount(a.discount));
                break;
            case 'newest':
            default:
                // Assuming id or dateAdded can be used. For now, referencing id as proxy for 'newest' if added sequentially
                result.sort((a, b) => b.id - a.id);
                break;
        }

        return result;
    }, [initialProducts, activeFilters, sortBy, searchQuery]);

    return (
        <div className="flex flex-col md:flex-row gap-8 relative">

            {/* Mobile Search (Always Visible) */}
            <div className="mb-4 md:hidden">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-full px-4 py-2 text-white focus:outline-none focus:border-silver"
                />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4 flex justify-between items-center bg-black border border-gray-800 p-3 rounded">
                <button
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="text-silver font-medium flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filters
                </button>
                <div className="w-1/2">
                    <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
                </div>
            </div>

            {/* Sidebar (Desktop & Mobile) */}
            <div className={`md:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}>
                <ProductFilters
                    products={initialProducts}
                    activeFilters={activeFilters}
                    onFilterChange={setActiveFilters}
                />
            </div>

            {/* Main Content */}
            <div className="md:w-3/4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-silver mb-4 md:mb-0">{title} <span className="text-gray-500 text-lg font-normal">({filteredAndSortedProducts.length} items)</span></h1>

                    <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                        {/* Desktop Search */}
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-black border border-gray-700 rounded-full px-4 py-1 text-sm text-white focus:outline-none focus:border-silver w-64"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Desktop Sort */}
                        <div className="hidden md:block">
                            <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
                        </div>
                    </div>
                </div>

                {filteredAndSortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    id: product.id,
                                    title: product.title,
                                    imageUrl: product.imageUrl || product.image,
                                    price: product.price,
                                    salePrice: product.salePrice || product.price,
                                    discount: product.discount,
                                    stockQuantity: product.stockQuantity || 10,
                                    status: product.status || 'active',
                                    description: product.description,
                                    alt: product.alt || product.title,
                                    availableSizes: product.sizes,
                                    colorOptions: product.colorOptions,
                                    rating: (product as any).rating
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-900 rounded-lg">
                        <p className="text-xl text-gray-400 mb-2">No products match your filters.</p>
                        <button
                            onClick={() => {
                                setActiveFilters({ priceRange: [0, 100000], sizes: [], colors: [], discount: null, fabrics: [], fits: [], occasions: [] });
                                setSearchQuery('');
                            }}
                            className="text-silver underline hover:text-white"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedProductGrid;
