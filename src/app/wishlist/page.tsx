"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (productId: number) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product, 1, null);
      alert('Product added to cart successfully!');
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Header space */}
      <div className="h-16"></div>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-white">My Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h2 className="text-xl text-white mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Items added to your wishlist will be saved here.</p>
            <Link 
              href="/" 
              className="inline-block bg-red-600 text-white py-3 px-6 rounded hover:bg-red-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="relative">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-w-3 aspect-h-4 relative">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 p-2 rounded-full"
                      aria-label="Remove from wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-white font-medium mb-2 hover:text-gray-300">{product.title}</h3>
                    </Link>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-white font-bold">{product.price}</span>
                        {product.originalPrice && (
                          <>
                            <span className="text-gray-400 line-through ml-2 text-sm">{product.originalPrice}</span>
                            <span className="text-red-500 ml-2 text-sm">{product.discount}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/" 
                className="inline-block bg-gray-800 text-white py-3 px-6 rounded hover:bg-gray-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage; 