"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface SimilarProductCardProps {
  product: Product;
  onQuickView: (e: React.MouseEvent, product: Product) => void;
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({ product, onQuickView }) => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 hover:shadow-lg transition-shadow relative group">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={product.image || (product as any).imageUrl}
            alt={product.title}
            fill
            className="object-cover"
          />
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
              {product.discount}
            </div>
          )}
        </div>
      </Link>
      
      {/* QuickView Button - Only visible on hover */}
      <button 
        className="absolute bottom-[calc(100%-64px+1rem)] left-1/2 transform -translate-x-1/2 bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md z-10"
        onClick={(e) => onQuickView(e, product)}
        aria-label="Quick view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>
      
      <div className="p-4 bg-gray-900">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-gray-200 font-medium text-sm hover:text-white transition line-clamp-2 h-10">{product.title}</h3>
        </Link>
        
        <div className="mt-2 flex items-center">
          <span className="font-bold text-white">{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="ml-2 text-gray-500 line-through text-sm">{product.originalPrice}</span>
              {product.discount && (
                <span className="ml-2 text-red-400 text-sm">{product.discount}</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarProductCard; 