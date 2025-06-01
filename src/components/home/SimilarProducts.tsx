"use client";

import React, { useState } from 'react';
import { Product } from '@/types';
import QuickViewModal from '../QuickViewModal';
import SimilarProductCard from './SimilarProductCard';

interface SimilarProductsProps {
  products: Product[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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
    <>
      <div className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6 text-center uppercase text-white">SIMILAR PRODUCTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <SimilarProductCard 
                key={product.id} 
                product={product} 
                onQuickView={openQuickView} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && selectedProduct && (
        <QuickViewModal 
          product={selectedProduct}
          onClose={closeQuickView}
        />
      )}
    </>
  );
};

export default SimilarProducts; 