"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuickViewModal from '../QuickViewModal';
import ProductPrice from './ProductPrice';
import { convertToTypeProduct } from '@/utils/productUtils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
// import { toast } from 'react-hot-toast'; // Removed to fix build error

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    imageUrl: string;
    price: string;
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
    imageUrls?: string[];
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

  // Calculate discount dynamically if not present
  const discountDisplay = product.discount
    ? (product.discount.includes('%') ? product.discount : `${product.discount}% OFF`)
    : (product.price && product.salePrice && product.price !== product.salePrice)
      ? `${Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF`
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



  // Make sure we have a valid product detail page URL
  const productUrl = `/product/${product.id}`;

  // Helper to render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="flex items-center ml-1 text-xs">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-600">★</span>
        ))}
      </span>
    );
  };

  return (
    <>
      <div className="group relative block bg-transparent">
        {/* Image Container - Full Bleed */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md">
          <Link href={productUrl} className="block w-full h-full">
            <Image
              src={product.imageUrl}
              alt={product.alt || product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Discount Badge - Top Left */}
          {discountDisplay && (
            <div className="absolute top-0 left-0 bg-[#DC2626] text-white text-xs font-bold px-3 py-1 z-10">
              {discountDisplay.includes('OFF') ? discountDisplay : `${discountDisplay} OFF`}
            </div>
          )}

          {/* Icons - Top Right (Column) */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
              aria-label={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isInWishlistState ? 'text-red-500 fill-current' : 'text-black'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {/* Quick View Button (Eye) */}
            <button
              onClick={handleQuickView}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
              aria-label="Quick View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>

          {/* Out of stock overlay */}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center pointer-events-none">
              <span className="text-white font-bold text-xl">OUT OF STOCK</span>
            </div>
          )}
        </div>

        {/* Info Section - Below Image */}
        <div className="mt-3 text-left">
          <Link href={productUrl}>
            <h3 className="text-white text-sm font-normal leading-tight truncate hover:text-gray-300 transition w-full">
              {product.title}
            </h3>
          </Link>

          {/* Price & Rating Line */}
          <div className="mt-1 flex items-center justify-between">
            <ProductPrice
              salePrice={product.salePrice}
              price={product.price}
              discount={product.discount}
              size="sm"
              showDiscount={false}
            />
            {/* Rating */}
            {(product.rating || 0) > 0 && (
              <div className="flex items-center text-gray-400 text-xs">
                <span>({product.rating})</span>
                {renderStars(product.rating || 0)}
              </div>
            )}
          </div>
        </div>

        {/* QuickView Modal */}
        {showQuickView && (
          <QuickViewModal
            product={convertToTypeProduct(product)}
            onClose={closeQuickView}
          />
        )}
      </div>
    </>
  );
};

export default ProductCard; 