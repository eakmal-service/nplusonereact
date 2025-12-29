"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

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
  discount: number;
  couponCode: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  getDiscountedTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);

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
    setDiscount(0);
    setCouponCode(null);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Remove currency symbols and convert to number
      const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const total = getCartTotal();
      if (total === 0) {
        return { success: false, message: 'Cart is empty' };
      }

      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: total }),
      });

      const data = await response.json();

      if (data.valid) {
        setDiscount(data.discountAmount); // Store absolute amount or percentage?
        // Note: The previous implementation used percentage for `discount` (setDiscount(20) meant 20%).
        // The API returns `discountAmount` (absolute value in ₹) or we need to align types.
        // Let's check `getDiscountedTotal`. It was `total - (total * (discount / 100))`.
        // If we want to support fixed amounts, we should change `discount` state to be the absolute Amount
        // and add a `discountType` or just use absolute amount for subtraction.

        // Let's change `discount` logic to be "Total Discount Amount" (₹) instead of percentage to support both types.
        // We need to update `getDiscountedTotal` logic too.
        setDiscount(data.discountAmount);
        setCouponCode(data.code);
        return { success: true, message: data.message };
      } else {
        setDiscount(0);
        setCouponCode(null);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Coupon error:', error);
      return { success: false, message: 'Error validating coupon' };
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponCode(null);
  };

  const getDiscountedTotal = () => {
    const total = getCartTotal();
    // New logic: discount is now absolute amount
    return Math.max(0, total - discount);
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
        getCartCount,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        getDiscountedTotal
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