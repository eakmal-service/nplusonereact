"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';
import { Product } from '@/types';
import QuickViewModal from '../QuickViewModal';
import SectionTitle from './SectionTitle';

import { useWishlist } from '@/contexts/WishlistContext';

interface RecommendedProductsProps {
  products: Product[];
  title?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products = [], title = "Recommended for you" }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 280 : 600;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 280 : 600;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Wishlist context
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="mt-10 md:mt-16 mb-8">
      <SectionTitle title={title} />

      <div className="overflow-hidden relative px-6 sm:px-8 md:px-10 mt-0">
        {/* Prev button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 lg:left-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 p-2 md:p-3 rounded-full shadow-lg hover:bg-white text-gray-800 hidden md:block" // Hidden on mobile, native swipe preferred
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 md:gap-6 w-full pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[60vw] sm:w-[40vw] md:w-[30vw] lg:w-[22vw] xl:w-[18vw] snap-center">
              <div className="relative group bg-white rounded-lg overflow-hidden border border-gray-100/50 hover:border-gray-200 transition-colors">
                <div className="relative">
                  <Link href={`/product/${product.id}`} className="block relative">
                    {product.badge && (
                      <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] md:text-xs text-white font-medium rounded-sm ${product.badge === 'New' ? 'bg-blue-600' : 'bg-red-600'}`}>
                        {product.badge}
                      </div>
                    )}
                    <div className="relative overflow-hidden aspect-[3/4] w-full bg-gray-100">
                      <Image
                        src={optimizeCloudinaryUrl(product.image) || '/placeholder.png'}
                        alt={product.alt || product.title}
                        fill
                        sizes="(max-width: 640px) 60vw, (max-width: 768px) 40vw, 25vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>
                  </Link>

                  {/* Actions overlay - Mobile friendly: always visible or different interaction? keeping hover for desktop, native look for mobile */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className={`p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${isInWishlist(product.id)
                        ? 'bg-red-50 text-red-500'
                        : 'bg-white text-gray-700 hover:text-red-500'
                        }`}
                      onClick={(e) => handleWishlistToggle(e, product)}
                      title="Add to Wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                    <button
                      className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
                      onClick={(e) => openQuickView(e, product)}
                      title="Quick View"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <Link href={`/product/${product.id}`} className="block">
                    {/* Safe Brand Name Check */}
                    <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide mb-1">
                      {product.brandName || 'NPlusOne'}
                    </p>
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-black transition-colors mb-1.5" title={product.title}>
                      {product.title}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm md:text-base font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                        <>
                          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                          <span className="text-xs text-red-600 font-medium whitespace-nowrap">
                            {product.discount || `${Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% OFF`}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 lg:right-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 p-2 md:p-3 rounded-full shadow-lg hover:bg-white text-gray-800 hidden md:block"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}

          onClose={closeQuickView}
        />
      )}
    </div>
  );
};

export default RecommendedProducts; 