"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Load wishlist data from localStorage when component mounts
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist data:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);
  
  // Save wishlist data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  const addToWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
      // Check if product already exists in wishlist
      if (prevWishlist.some(item => item.id === product.id)) {
        return prevWishlist;
      }
      return [...prevWishlist, product];
    });
  };
  
  const removeFromWishlist = (productId: number) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };
  
  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };
  
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };
  
  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        clearWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  
  return context;
}; 