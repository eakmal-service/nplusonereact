"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';

interface ProductFiltersProps {
    products: Product[];
    activeFilters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
    discount: number | null;
    fabrics: string[];
    fits: string[];
    occasions: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ products, activeFilters, onFilterChange }) => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000); // Default max
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [availableColors, setAvailableColors] = useState<string[]>([]);
    const [availableFabrics, setAvailableFabrics] = useState<string[]>([]);
    const [availableFits, setAvailableFits] = useState<string[]>([]);
    const [availableOccasions, setAvailableOccasions] = useState<string[]>([]);

    // Calculate available filters from products
    useEffect(() => {
        if (products.length > 0) {
            // Prices
            const prices = products.map(p => {
                const pStr = p.salePrice || p.price;
                if (typeof pStr === 'number') return pStr;
                return pStr ? (parseInt(pStr.replace(/[^0-9]/g, '')) || 0) : 0;
            });
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setMinPrice(Math.floor(min / 100) * 100);
            setMaxPrice(Math.ceil(max / 100) * 100);

            // Sizes
            const sizes = new Set<string>();
            products.forEach(p => {
                p.sizes?.forEach(s => sizes.add(s));
                p.availableSizes?.forEach(s => sizes.add(s));
            });
            setAvailableSizes(Array.from(sizes).sort());

            // Colors - this is tricky as color names might vary. Using simple extraction if available.
            const colors = new Set<string>();
            products.forEach(p => {
                if (p.colorOptions) {
                    p.colorOptions.forEach(c => colors.add(c.name));
                }
            });
            setAvailableColors(Array.from(colors).sort());

            // Fabrics
            const fabrics = new Set<string>();
            products.forEach(p => {
                if (p.fabric) fabrics.add(p.fabric);
            });
            setAvailableFabrics(Array.from(fabrics).sort());

            // Fits
            const fits = new Set<string>();
            products.forEach(p => {
                if (p.fit) fits.add(p.fit);
            });
            setAvailableFits(Array.from(fits).sort());

            // Occasions
            const occasions = new Set<string>();
            products.forEach(p => {
                if (p.occasion) occasions.add(p.occasion);
            });
            setAvailableOccasions(Array.from(occasions).sort());
        }
    }, [products]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const val = parseInt(e.target.value) || 0;
        const newRange = [...activeFilters.priceRange] as [number, number];
        if (type === 'min') newRange[0] = val;
        else newRange[1] = val;
        onFilterChange({ ...activeFilters, priceRange: newRange });
    };

    const handleSizeToggle = (size: string) => {
        const newSizes = activeFilters.sizes.includes(size)
            ? activeFilters.sizes.filter(s => s !== size)
            : [...activeFilters.sizes, size];
        onFilterChange({ ...activeFilters, sizes: newSizes });
    };

    const handleColorToggle = (color: string) => {
        const newColors = activeFilters.colors.includes(color)
            ? activeFilters.colors.filter(c => c !== color)
            : [...activeFilters.colors, color];
        onFilterChange({ ...activeFilters, colors: newColors });
    };

    const handleDiscountChange = (discount: number | null) => {
        onFilterChange({ ...activeFilters, discount });
    };

    const handleFabricToggle = (fabric: string) => {
        const newFabrics = activeFilters.fabrics.includes(fabric)
            ? activeFilters.fabrics.filter(f => f !== fabric)
            : [...activeFilters.fabrics, fabric];
        onFilterChange({ ...activeFilters, fabrics: newFabrics });
    };

    const handleFitToggle = (fit: string) => {
        const newFits = activeFilters.fits.includes(fit)
            ? activeFilters.fits.filter(f => f !== fit)
            : [...activeFilters.fits, fit];
        onFilterChange({ ...activeFilters, fits: newFits });
    };

    const handleOccasionToggle = (occasion: string) => {
        const newOccasions = activeFilters.occasions.includes(occasion)
            ? activeFilters.occasions.filter(o => o !== occasion)
            : [...activeFilters.occasions, occasion];
        onFilterChange({ ...activeFilters, occasions: newOccasions });
    };

    return (
        <div className="bg-black p-4 rounded-lg shadow-sm border border-gray-800">
            <h3 className="font-bold text-lg mb-4 text-silver border-b border-gray-800 pb-2">Filters</h3>

            {/* Price Filter */}
            <div className="mb-6">
                <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Price</h4>
                <div className="flex items-center space-x-2 mb-2">
                    <input
                        type="number"
                        value={activeFilters.priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className="w-20 border border-gray-700 rounded px-2 py-1 text-sm bg-gray-900 text-white focus:outline-none focus:border-silver"
                        min={0}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        value={activeFilters.priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className="w-20 border border-gray-700 rounded px-2 py-1 text-sm bg-gray-900 text-white focus:outline-none focus:border-silver"
                        min={0}
                    />
                </div>
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={activeFilters.priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 'max')}
                    className="w-full accent-silver bg-gray-700 h-1 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Size</h4>
                <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                        <button
                            key={size}
                            onClick={() => handleSizeToggle(size)}
                            className={`px-3 py-1 text-xs border rounded transition-colors ${activeFilters.sizes.includes(size)
                                ? 'bg-silver text-black border-silver font-medium'
                                : 'bg-transparent text-gray-400 border-gray-700 hover:border-silver hover:text-silver'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            {availableColors.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Color</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {availableColors.map(color => (
                            <label key={color} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${activeFilters.colors.includes(color) ? 'bg-silver border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                                    {activeFilters.colors.includes(color) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                {/* Hidden real checkbox for logic, using visual one above */}
                                <input
                                    type="checkbox"
                                    checked={activeFilters.colors.includes(color)}
                                    onChange={() => handleColorToggle(color)}
                                    className="hidden"
                                />
                                <span>{color}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Fabric Filter */}
            {availableFabrics.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Fabric</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {availableFabrics.map(fabric => (
                            <label key={fabric} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${activeFilters.fabrics.includes(fabric) ? 'bg-silver border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                                    {activeFilters.fabrics.includes(fabric) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={activeFilters.fabrics.includes(fabric)}
                                    onChange={() => handleFabricToggle(fabric)}
                                    className="hidden"
                                />
                                <span>{fabric}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Fit Filter */}
            {availableFits.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Fit</h4>
                    <div className="space-y-1">
                        {availableFits.map(fit => (
                            <label key={fit} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${activeFilters.fits.includes(fit) ? 'bg-silver border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                                    {activeFilters.fits.includes(fit) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={activeFilters.fits.includes(fit)}
                                    onChange={() => handleFitToggle(fit)}
                                    className="hidden"
                                />
                                <span>{fit}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Occasion Filter */}
            {availableOccasions.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Occasion</h4>
                    <div className="space-y-1">
                        {availableOccasions.map(occasion => (
                            <label key={occasion} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${activeFilters.occasions.includes(occasion) ? 'bg-silver border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                                    {activeFilters.occasions.includes(occasion) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={activeFilters.occasions.includes(occasion)}
                                    onChange={() => handleOccasionToggle(occasion)}
                                    className="hidden"
                                />
                                <span>{occasion}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Discount Filter */}
            <div className="mb-6">
                <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Discount</h4>
                <div className="space-y-1">
                    {[10, 20, 30, 40, 50].map(disc => (
                        <label key={disc} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeFilters.discount === disc ? 'border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                                {activeFilters.discount === disc && <div className="w-2 h-2 bg-silver rounded-full" />}
                            </div>
                            <input
                                type="radio"
                                name="discount"
                                checked={activeFilters.discount === disc}
                                onChange={() => handleDiscountChange(disc)}
                                className="hidden"
                            />
                            <span>{disc}% and above</span>
                        </label>
                    ))}
                    <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeFilters.discount === null ? 'border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                            {activeFilters.discount === null && <div className="w-2 h-2 bg-silver rounded-full" />}
                        </div>
                        <input
                            type="radio"
                            name="discount"
                            checked={activeFilters.discount === null}
                            onChange={() => handleDiscountChange(null)}
                            className="hidden"
                        />
                        <span>All</span>
                    </label>
                </div>
            </div>

            {/* Fabric Filter */}
            {availableFabrics.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Fabric</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {availableFabrics.map(fabric => (
                            <label key={fabric} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${activeFilters.fabrics.includes(fabric) ? 'bg-silver border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                                    {activeFilters.fabrics.includes(fabric) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={activeFilters.fabrics.includes(fabric)}
                                    onChange={() => handleFabricToggle(fabric)}
                                    className="hidden"
                                />
                                <span>{fabric}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Fit Filter */}
            {availableFits.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Fit</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {availableFits.map(fit => (
                            <label key={fit} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${activeFilters.fits.includes(fit) ? 'bg-silver border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                                    {activeFilters.fits.includes(fit) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={activeFilters.fits.includes(fit)}
                                    onChange={() => handleFitToggle(fit)}
                                    className="hidden"
                                />
                                <span>{fit}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Occasion Filter */}
            {availableOccasions.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-gray-400">Occasion</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {availableOccasions.map(occasion => (
                            <label key={occasion} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-silver group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${activeFilters.occasions.includes(occasion) ? 'bg-silver border-silver' : 'border-gray-600 group-hover:border-silver'}`}>
                                    {activeFilters.occasions.includes(occasion) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={activeFilters.occasions.includes(occasion)}
                                    onChange={() => handleOccasionToggle(occasion)}
                                    className="hidden"
                                />
                                <span>{occasion}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={() => onFilterChange({ priceRange: [minPrice, maxPrice], sizes: [], colors: [], discount: null, fabrics: [], fits: [], occasions: [] })}
                className="text-xs text-gray-500 hover:text-white underline w-full text-center transition-colors"
            >
                Clear All Filters
            </button>

        </div>
    );
};

export default ProductFilters;
