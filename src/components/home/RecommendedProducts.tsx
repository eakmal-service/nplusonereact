"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';
import { Product } from '@/types';
import QuickViewModal from '../QuickViewModal';
import SectionTitle from './SectionTitle';
import ProductCard from '../common/ProductCard';

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
    return products.slice(startIndex, startIndex + itemsPerView).filter(p => !!p);
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
            <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-1 sm:px-2 pointer-events-auto">
              <ProductCard
                product={{
                  ...product,
                  imageUrl: product.image || (product as any).imageUrl,
                  price: product.originalPrice || (product as any).price,
                  salePrice: product.price || (product as any).salePrice || (product as any).price,
                  stockQuantity: product.stockQuantity || 10,
                  status: product.status || 'active',
                  availableSizes: product.sizes || (product as any).availableSizes,
                  colorOptions: (product as any).colorOptions
                }}
              />
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