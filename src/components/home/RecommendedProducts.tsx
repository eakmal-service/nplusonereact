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
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Wishlist context
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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
          onClick={prevRecommended}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white bg-opacity-70 p-2 md:p-3 rounded-full shadow-md hover:bg-opacity-100"
          aria-label="Previous recommended products"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex justify-center sm:justify-start items-center gap-2 md:gap-4 lg:gap-6 w-full pointer-events-none">
          {getCurrentRecommended().map((product) => (
            <div key={product.id} className="relative group w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-1 sm:px-2 pointer-events-auto">
              <div className="relative">
                <Link href={`/product/${product.id}`} className="block relative">
                  {product.badge && (
                    <div className={`absolute top-0 left-0 z-10 px-2 sm:px-4 py-1 text-xs text-white font-medium ${product.badge === 'New' ? 'bg-blue-600' : 'bg-red-600'}`}>
                      {product.badge}
                    </div>
                  )}
                  <div className="relative overflow-hidden aspect-[3/4] w-full bg-gray-100">
                    <Image
                      src={optimizeCloudinaryUrl(product.image) || '/placeholder.png'}
                      alt={product.alt || product.title}
                      fill
                      priority={true}
                      loading="eager"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-10"></div>
                  </div>
                </Link>

                <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
                  {/* Wishlist Button */}
                  <button
                    className={`p-2 rounded-full shadow-md transition-colors duration-300 ${isInWishlist(product.id)
                      ? 'bg-red-50 text-red-500 hover:bg-red-100'
                      : 'bg-white text-gray-800 hover:bg-red-50 hover:text-red-500'
                      }`}
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => handleWishlistToggle(e, product)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  {/* Quick View Button */}
                  <button
                    className="bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
                    onClick={(e) => openQuickView(e, product)}
                    aria-label="Quick view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>

                <div className="mt-3">
                  <Link href={`/product/${product.id}`} className="block">
                    <h4 className="text-sm font-medium text-[#CDCDCD] line-clamp-1 hover:text-white mb-1">{product.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#CDCDCD]">₹{product.price}</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-xs text-gray-500 line-through">₹{product.originalPrice.replace('₹', '')}</span>
                          <span className="text-xs text-red-600 font-medium">{product.discount}</span>
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
          onClick={nextRecommended}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white bg-opacity-70 p-2 md:p-3 rounded-full shadow-md hover:bg-opacity-100"
          aria-label="Next recommended products"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Slider pagination */}
        <div className="flex justify-center mt-4 z-30 relative">
          {Array.from({ length: totalRecommendedPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setRecommendedIndex(idx)}
              className={`mx-1 w-2 h-2 md:w-3 md:h-3 rounded-full ${idx === recommendedIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              aria-label={`Go to recommended page ${idx + 1}`}
            />
          ))}
        </div>
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