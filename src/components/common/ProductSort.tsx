"use client";

import React from 'react';

interface ProductSortProps {
    sortBy: string;
    onSortChange: (sort: string) => void;
}

const ProductSort: React.FC<ProductSortProps> = ({ sortBy, onSortChange }) => {
    return (
        <div className="flex items-center space-x-2">
            <span className="text-silver text-sm font-medium">Sort By:</span>
            <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-black text-white border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-silver"
            >
                <option value="newest">What's New</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="discount">Better Discount</option>
            </select>
        </div>
    );
};

export default ProductSort;
