"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuickViewModal from '../QuickViewModal';
import { convertToTypeProduct } from '@/utils/productUtils';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    imageUrl: string;
    price: string;
    salePrice: string;
    discount?: string;
    stockQuantity: number;
    status: string;
    description?: string;
    alt?: string;
    isAdminUploaded?: boolean;
    category?: string;
    subcategory?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  
  // Only render if product is active
  if (product.status !== 'active') return null;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
  };

  // Make sure we have a valid product detail page URL
  const productUrl = `/product/${product.id}`;

  return (
    <>
      <div className="bg-black rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition relative group">
        {/* Product Image */}
        <Link href={productUrl}>
          <div className="relative h-64 w-full">
            <Image
              src={product.imageUrl}
              alt={product.alt || product.title}
              fill
              className="object-cover"
            />
            {product.discount && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                {product.discount}
              </div>
            )}
            {product.stockQuantity === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <span className="text-white font-bold text-xl">OUT OF STOCK</span>
              </div>
            )}
          </div>
        </Link>
        
        {/* QuickView Button - Only visible on hover */}
        <button 
          className="absolute bottom-[calc(100%-64px+1rem)] left-1/2 transform -translate-x-1/2 bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md z-10"
          onClick={handleQuickView}
          aria-label="Quick view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        
        {/* Product Details */}
        <div className="p-4">
          <Link href={productUrl}>
            <h3 className="text-white font-medium text-lg hover:text-silver transition">{product.title}</h3>
          </Link>
          
          <div className="mt-2 flex items-center">
            <span className="text-silver font-bold">{product.salePrice}</span>
            <span className="ml-2 text-gray-500 line-through text-sm">{product.price}</span>
          </div>
          
          {/* Add to Cart Button */}
          <div className="mt-4">
            <button 
              className="w-full bg-silver hover:bg-gray-300 text-black font-medium py-2 rounded transition"
              disabled={product.stockQuantity === 0}
            >
              {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
          
          {/* Wishlist Button */}
          <button 
            className="mt-2 w-full border border-gray-600 hover:border-silver text-white hover:text-silver font-medium py-2 rounded transition flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* QuickView Modal */}
      {showQuickView && (
        <QuickViewModal
          product={convertToTypeProduct(product)}
          onClose={closeQuickView}
        />
      )}
    </>
  );
};

export default ProductCard; 