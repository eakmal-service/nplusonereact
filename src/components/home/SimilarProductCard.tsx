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
          price: (product as any).selling_price || product.price, // Map selling_price -> price (active price)
          salePrice: (product as any).sale_price || product.salePrice,
          originalPrice: (product as any).mrp || product.originalPrice,
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