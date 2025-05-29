"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    router.push('/checkout');
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Header space */}
      <div className="h-16"></div>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-white">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h2 className="text-xl text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link 
              href="/" 
              className="inline-block bg-red-600 text-white py-3 px-6 rounded hover:bg-red-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="hidden md:grid grid-cols-12 text-gray-400 text-sm border-b border-gray-800 pb-4">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                
                {cart.map((item) => {
                  const itemPrice = parseFloat(item.product.price.replace(/[^0-9.]/g, ''));
                  const itemTotal = itemPrice * item.quantity;
                  
                  return (
                    <div 
                      key={`${item.product.id}-${item.size}`}
                      className="grid grid-cols-1 md:grid-cols-12 items-center py-6 border-b border-gray-800"
                    >
                      <div className="col-span-6 flex items-center mb-4 md:mb-0">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-800 rounded overflow-hidden mr-4">
                          <img 
                            src={item.product.image} 
                            alt={item.product.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="text-white font-medium hover:text-gray-300">{item.product.title}</h3>
                          </Link>
                          {item.size && (
                            <p className="text-gray-400 text-sm mt-1">Size: {item.size}</p>
                          )}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 text-sm mt-2 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center text-white mb-4 md:mb-0">
                        {item.product.price}
                      </div>
                      
                      <div className="col-span-2 flex justify-center mb-4 md:mb-0">
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-600 flex items-center justify-center text-white"
                          >
                            -
                          </button>
                          <div className="w-12 h-8 border-t border-b border-gray-600 flex items-center justify-center text-white">
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-600 flex items-center justify-center text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center text-white font-medium">
                        ₹{itemTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
                
                <div className="flex justify-between mt-6 pt-6 border-t border-gray-800">
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-400"
                  >
                    Clear Cart
                  </button>
                  <Link 
                    href="/" 
                    className="text-white hover:text-gray-300"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl text-white font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white">Free</span>
                  </div>
                  <div className="border-t border-gray-800 pt-4 flex justify-between">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-white font-bold">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded transition"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-6 text-xs text-gray-400 text-center">
                  <p>Taxes and shipping calculated at checkout</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 