"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductPrice from './ProductPrice';
import QuickViewModal from '../QuickViewModal'; // Assuming relative path is same as ProductCard
import { convertToTypeProduct } from '@/utils/productUtils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface KidsProductCardProps {
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

const KidsProductCard: React.FC<KidsProductCardProps> = ({ product, priority = false }) => {
    const [showQuickView, setShowQuickView] = useState(false);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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

    const productUrl = `/product/${product.id}`;

    return (
        <>
            <div className="group relative block bg-transparent">
                {/* Image Container - Full Bleed */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md"> {/* Slightly rounded or sharp? Screenshot looks sharp/minimal rounded */}
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
                            {discountDisplay.replace(' OFF', '')} OFF
                        </div>
                    )}

                    {/* Icons - Top Right (Column) */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {/* Wishlist Button */}
                        <button
                            onClick={handleWishlist}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isInWishlistState ? 'text-red-500 fill-current' : 'text-black'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        {/* Quick View Button (Eye) */}
                        <button
                            onClick={handleQuickView}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
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

                    {/* Price Line */}
                    {/* Price Line */}
                    <div className="mt-1">
                        <ProductPrice
                            salePrice={product.salePrice}
                            price={product.price}
                            discount={product.discount || discountDisplay || undefined}
                            size="sm"
                            showDiscount={false}
                        />
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

export default KidsProductCard;
