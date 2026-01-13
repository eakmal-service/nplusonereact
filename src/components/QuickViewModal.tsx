"use client";

import React, { useState } from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';

// ... existing imports

// Create thumbnail array from product images
// Prioritize product.images which we explicitly mapped for QuickView
const thumbnails: Thumbnail[] = product.images && product.images.length > 0
  ? product.images.map(img => ({
    url: optimizeCloudinaryUrl(img.url),
    alt: img.alt || product.title
  }))
  : product.thumbnails && product.thumbnails.length > 0
    ? product.thumbnails.map(thumb => ({
      url: optimizeCloudinaryUrl(thumb.url),
      alt: thumb.alt || product.title
    }))
    : (product as any).imageUrls && (product as any).imageUrls.length > 0
      ? (product as any).imageUrls.map((url: string) => ({
        url: optimizeCloudinaryUrl(url),
        alt: product.alt || product.title
      }))
      : [{
        url: optimizeCloudinaryUrl(product.image || (product as any).imageUrl || '/placeholder.png'),
        alt: product.title
      }];

// Get color options if provided by the product, or use defaults
const colorOptions: ProductColor[] = product.colorOptions || [];

// Set default selected color if not already selected
React.useEffect(() => {
  if (!selectedColor && colorOptions.length > 0) {
    setSelectedColor(colorOptions[0].name);
  }
}, [colorOptions, selectedColor]);

return (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-black text-white rounded-lg max-w-4xl w-full overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row p-4 md:p-6 gap-6">
        {/* Left side - Product images */}
        <div className="md:w-1/2">
          <div className="flex">
            {/* Thumbnails - Vertical carousel - Only show if there are multiple images */}
            {thumbnails.length > 1 && (
              <div className="w-1/5 mr-4 max-h-[400px] overflow-y-auto flex flex-col items-center">
                {thumbnails.map((thumb: Thumbnail, index: number) => (
                  <div
                    key={index}
                    className={`mb-4 border-2 w-full ${selectedImage === index ? 'border-silver' : 'border-gray-700'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={thumb.url || '/placeholder.png'}
                      alt={`${thumb.alt || product.title} thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-auto cursor-pointer object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className={`${thumbnails.length > 1 ? 'w-4/5' : 'w-full'} relative overflow-hidden`}>
              {product.discount && (
                <div className="absolute top-0 left-0 z-10 px-4 py-1 text-xs text-white font-medium bg-red-600">
                  {product.discount}
                </div>
              )}
              <div className="relative overflow-hidden cursor-zoom-in" style={{ height: '400px' }}>
                <Image
                  src={thumbnails[selectedImage].url || '/placeholder.png'}
                  alt={thumbnails[selectedImage].alt || product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={selectedImage === 0}
                  className="object-contain transition-transform duration-300 hover:scale-150"
                />
              </div>

              {/* Image counter - Only show if there are multiple images */}
              {thumbnails.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {selectedImage + 1} / {thumbnails.length}
                </div>
              )}

              {/* Product action buttons */}
              <div className="absolute top-2 right-2 flex flex-col space-y-2">
                <button
                  onClick={toggleWishlist}
                  className={`${isInWishlist(product.id) ? 'bg-red-600' : 'bg-white'} p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isInWishlist(product.id) ? 'text-white' : 'text-gray-800'}`} fill={isInWishlist(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="md:w-1/2">
          <h1 className="text-xl md:text-2xl font-semibold uppercase mb-3 text-white">{product.title}</h1>

          {/* Price section */}
          <div className="mb-4">
            <div className="flex items-center">
              <p className="text-sm text-gray-400">MRP</p>
              <span className="text-xl font-bold ml-2 text-white">{product.salePrice || product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through ml-3">{product.originalPrice}</span>
              )}
              {product.price && product.salePrice && product.price !== product.salePrice && (
                <span className="text-gray-500 line-through ml-3">{product.price}</span>
              )}
              {product.discount && (
                <span className="text-red-500 ml-3 bg-red-900 px-2 py-1 text-sm">{product.discount}</span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Color selection */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 text-white">SELECT COLOR</h3>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color, index) => (
                <button
                  key={index}
                  className={`w-9 h-9 flex items-center justify-center border rounded-full ${selectedColor === color.name
                    ? 'border-silver'
                    : 'border-gray-600 hover:border-silver'
                    }`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => setSelectedColor(color.name)}
                  title={color.name}
                >
                  {selectedColor === color.name && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={color.code === '#FFFFFF' ? '#000000' : '#FFFFFF'}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 text-white">SELECT SIZE</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size: string) => (
                <button
                  key={size}
                  className={`w-9 h-9 flex items-center justify-center border rounded-full ${selectedSize === size
                    ? 'border-silver bg-silver text-black'
                    : 'border-gray-600 text-white hover:border-silver'
                    }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* View full details link */}
          <div className="mb-6">
            <Link href={`/product/${product.id}`} className="text-silver underline hover:text-white">
              View Full Product Details
            </Link>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-silver hover:bg-gray-300 text-black py-3 px-6 font-medium transition-all"
            >
              ADD TO BAG
            </button>
            <Link
              href={`/product/${product.id}`}
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 font-medium transition-all text-center"
            >
              VIEW DETAILS
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default QuickViewModal; 