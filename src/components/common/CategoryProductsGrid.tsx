"use client";

import React from 'react';
import ProductCard from './ProductCard';

// Accept any product type since we're mapping it to ProductCard's expected format
interface CategoryProductsGridProps {
  products: any[];
}

const CategoryProductsGrid: React.FC<CategoryProductsGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={{
            id: product.id,
            title: product.title,
            imageUrl: product.imageUrl || product.image,
            price: product.price,
            salePrice: product.salePrice || product.price,
            discount: product.discount,
            stockQuantity: product.stockQuantity || 10,
            status: product.status || 'active',
            description: product.description,
            alt: product.alt || product.title
          }} 
        />
      ))}
    </div>
  );
};

export default CategoryProductsGrid; 