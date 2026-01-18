"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuickViewModal from '../QuickViewModal';
import { convertToTypeProduct } from '@/utils/productUtils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
// import { toast } from 'react-hot-toast'; // Removed to fix build error

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    imageUrl: string;
    imageUrl: string;
    price: string;
    mrp?: string | number;
    salePrice: string;
    discount?: string;
    stockQuantity: number;
    status: string;
    description?: string;
    alt?: string;
    isAdminUploaded?: boolean;
    category?: string;
    subcategory?: string;
    availableSizes?: string[];
    rating?: number;
    colorOptions?: Array<{ name: string, code: string }>;
  };
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Only render if product is active
  if (product.status !== 'active') return null;

  const isInWishlistState = isInWishlist(product.id);

  // Calculate prices
  const originalPrice = product.mrp ? parseFloat(product.mrp.toString()) : (product.price ? parseFloat(product.price) : 0);
  const currentPrice = product.salePrice ? parseFloat(product.salePrice) : (product.price ? parseFloat(product.price) : 0);

  // Calculate discount dynamically if not present
  const discountDisplay = product.discount
    ? (product.discount.includes('%') ? product.discount : `${product.discount}% OFF`)
    : (originalPrice > currentPrice)
      ? `${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF`
      : null;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stockQuantity === 0) return;

    // Default to first size or 'One Size' if not specified
    // Ideally open QuickView if sizes are needed, but for direct add:
    const defaultSize = product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes[0]
      : 'One Size';

    // Convert to full Product type for Context
    const fullProduct = convertToTypeProduct(product);
    addToCart(fullProduct, 1, defaultSize);

    // Optional: visual feedback
    // toast.success('Added to cart'); 
    alert("Added to Cart!"); // Simple fallback
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const fullProduct = convertToTypeProduct(product);
    if (isInWishlistState) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(fullProduct);
    }
  };

  // Helper to render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-sm">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-sm">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-600 text-sm">★</span>
        ))}
      </div>
    );
  };

  // Make sure we have a valid product detail page URL
  const productUrl = `/product/${product.id}`;

  return (
    <>
      <div className="bg-black rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition relative group">
        {/* Product Image */}
        <Link href={productUrl}>
          <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.alt || product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top hover:scale-105 transition-transform duration-500"
            />
            {discountDisplay && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {// Remove double OFF if variable includes it 
                  discountDisplay.includes('OFF') ? discountDisplay : `${discountDisplay} OFF`
                }
              </div>
            )}
            {product.stockQuantity === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <span className="text-white font-bold text-xl">OUT OF STOCK</span>
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-4">
          <Link href={productUrl}>
            <h3 className="text-silver font-medium text-lg hover:text-gray-300 transition truncate">{product.title}</h3>
          </Link>

          <div className="mt-2 flex items-center">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xl">₹{currentPrice}</span>
              {originalPrice > currentPrice && (
                <span className="text-gray-500 line-through text-sm">₹{originalPrice}</span>
              )}
            </div>

            {/* Rating - Left aligned next to price */}
            {(product.rating || 0) > 0 && (
              <div className="flex items-center gap-1 ml-2">
                {renderStars(product.rating || 0)}
              </div>
            )}

            <button
              onClick={handleQuickView}
              className="text-gray-400 hover:text-white transition p-1 ml-auto"
              aria-label="Quick View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-silver hover:bg-gray-300 text-black font-medium py-2 rounded transition"
              disabled={product.stockQuantity === 0}
            >
              {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`mt-2 w-full border ${isInWishlistState ? 'border-red-500 text-red-500' : 'border-gray-600 text-silver'} hover:border-silver hover:text-white font-medium py-2 rounded transition flex items-center justify-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${isInWishlistState ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isInWishlistState ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>

      {/* QuickView Modal */}
      {showQuickView && (
        <QuickViewModal
          product={convertToTypeProduct(product)}
          onClose={closeQuickView}
        />
      )}
    </>
  );
};

export default ProductCard; 