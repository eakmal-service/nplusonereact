"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { convertToTypeProduct } from '@/utils/productUtils';

interface CartItem {
  product: Product;
  quantity: number;
  size: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size: string | null) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart data from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product: Product, quantity: number, size: string | null) => {
    setCart(prevCart => {
      // Check if product already exists in cart with same size
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.size === size
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { product, quantity, size }];
      }
    });
  };
  
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Remove currency symbols and convert to number
      const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };
  
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}; 