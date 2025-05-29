"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import QuickViewModal from '../QuickViewModal';

interface SimilarProductsProps {
  products: Product[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product detail page
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  // Simple display of similar products in a grid
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative group">
            <Link href={`/product/${product.id}`}>
              <div className="relative overflow-hidden bg-white rounded shadow">
                {product.badge && (
                  <div className={`absolute top-0 left-0 z-10 px-2 py-1 text-xs text-white font-medium ${
                    product.badge === 'Sale' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {product.badge}
                  </div>
                )}
                <div className="relative pb-[125%] overflow-hidden">
                  <img 
                    src={product.image}
                    alt={product.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Quick View Button */}
                  <button 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                    onClick={(e) => openQuickView(e, product)}
                    aria-label="Quick view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium line-clamp-1 group-hover:text-gray-600 transition-colors">{product.title}</h3>
                  <div className="flex items-center mt-1">
                    <span className="font-bold text-sm">{product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xs text-gray-500 line-through ml-2">{product.originalPrice}</span>
                        <span className="text-xs text-red-600 ml-2">{product.discount}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-5"></div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={closeQuickView}
        />
      )}
    </>
  );
};

export default SimilarProducts; 