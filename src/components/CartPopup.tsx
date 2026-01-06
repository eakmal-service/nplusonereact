"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface CartPopupProps {
  isVisible: boolean;
}

// Helper to parse price (handles both string and number)
const parsePrice = (price: string | number | undefined): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price.replace(/[^0-9.]/g, ''));
  return 0;
};

const CartPopup: React.FC<CartPopupProps> = ({ isVisible }) => {
  const { cart, getCartTotal } = useCart();

  if (!isVisible) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 shadow-xl rounded-md p-4 z-50">
      <h3 className="text-white font-bold text-lg mb-4">Shopping Cart</h3>

      {cart.length === 0 ? (
        <p className="text-gray-400 mb-4">Your cart is empty.</p>
      ) : (
        <>
          <div className="max-h-60 overflow-y-auto mb-4">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex items-center py-2 border-b border-gray-800">
                <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-800 rounded overflow-hidden relative">
                  <Image
                    src={item.product.image || '/placeholder.png'}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="text-white text-sm font-medium">{item.product.title}</h4>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Size: {item.size || 'N/A'}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-white text-sm">₹{parsePrice(item.product.price)}</span>
                    <span className="text-white text-xs">
                      Subtotal: ₹{(parsePrice(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4 border-t border-gray-800 pt-3">
            <span className="text-white">Subtotal:</span>
            <span className="text-white font-bold">₹{getCartTotal().toFixed(2)}</span>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/cart" className="bg-white text-black py-2 px-4 rounded text-center text-sm font-medium hover:bg-gray-200 transition">
              View Cart
            </Link>
            <Link href="/checkout" className="bg-red-600 text-white py-2 px-4 rounded text-center text-sm font-medium hover:bg-red-700 transition">
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPopup; 