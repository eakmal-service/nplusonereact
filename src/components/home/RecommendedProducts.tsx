"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';
import { Product } from '@/types';
import QuickViewModal from '../QuickViewModal';
import SectionTitle from './SectionTitle';

interface RecommendedProductsProps {
  products: Product[];
  title?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products = [], title = "Recommended for you" }) => {
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Adjust items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Safety check for empty products array
  if (!products || products.length === 0) {
    return null;
  }

  // Calculate total pages
  const totalRecommendedPages = Math.ceil(products.length / itemsPerView);

  // Navigate recommended products
  const nextRecommended = () => {
    setRecommendedIndex((prevIndex) =>
      prevIndex === totalRecommendedPages - 1 ? 0 : prevIndex + 1
    );
  };

  const prevRecommended = () => {
    setRecommendedIndex((prevIndex) =>
      prevIndex === 0 ? totalRecommendedPages - 1 : prevIndex - 1
    );
  };

  // Get current recommended products
  const getCurrentRecommended = () => {
    const startIndex = recommendedIndex * itemsPerView;
    return products.slice(startIndex, startIndex + itemsPerView);
  };

  const openQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product detail page
    e.stopPropagation(); // Stop event bubbling
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="mt-8 md:mt-16 mb-8">
      <SectionTitle title={title} />

      {/* Mobile-First Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="px-4 md:px-10 mt-4 md:mt-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="group">
              <div className="relative border border-gray-800 rounded-md overflow-hidden bg-gray-900 group-hover:border-gray-600 transition">
                <Link href={`/product/${product.id}`} className="block relative">
                  {/* Aspect Ratio 3/4 */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
                    <Image
                      src={optimizeCloudinaryUrl(product.image) || '/placeholder.png'}
                      alt={product.alt || product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <div className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 text-[10px] md:text-xs text-white font-bold rounded ${product.badge === 'Sale' ? 'bg-red-600' : 'bg-blue-600'}`}>
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                </Link>

                {/* Quick View (Desktop Only) */}
                <button
                  className="hidden md:block absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={(e) => openQuickView(e, product)}
                  aria-label="Quick view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-2 text-center md:text-left">
                <Link href={`/product/${product.id}`}>
                  {/* Title: Tiny on mobile, normal on desktop */}
                  <h3 className="text-white text-xs md:text-base font-medium line-clamp-1 hover:text-gray-300 transition">
                    {product.title}
                  </h3>
                  {/* Prices */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    <span className="text-white font-bold text-sm md:text-lg">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 text-xs md:text-sm line-through">{product.originalPrice}</span>
                    )}
                    {product.discount && (
                      <span className="text-red-500 text-xs md:text-sm font-medium">{product.discount}</span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && isQuickViewOpen && (
        <QuickViewModal
          product={selectedProduct}
          onClose={closeQuickView}
        />
      )}
    </div>
  );
};


export default RecommendedProducts; 