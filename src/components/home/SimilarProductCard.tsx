"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../common/ProductCard';
import { Product } from '@/types';

interface SimilarProductCardProps {
  product: Product;
  onQuickView: (e: React.MouseEvent, product: Product) => void;
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({ product, onQuickView }) => {
  return (

    <div className="w-full">
      <ProductCard
        product={{
          ...product,
          imageUrl: product.image || (product as any).imageUrl,
          price: product.originalPrice || (product as any).price || '0', // Fallback to avoid error
          salePrice: product.price || (product as any).salePrice || (product as any).price || '0',
          stockQuantity: product.stockQuantity || 10,
          status: product.status || 'active',
          availableSizes: product.sizes || (product as any).availableSizes,
          colorOptions: (product as any).colorOptions
        }}
      />
    </div>
  );

};

export default SimilarProductCard; 