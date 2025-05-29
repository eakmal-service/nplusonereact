"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from './LoginModal';
import CartPopup from './CartPopup';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const ProductHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  const openLoginModal = () => {
    setShowLoginModal(true);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="bg-black py-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl">
              <div className="w-24 h-10 relative">
                <Image 
                  src="/images/NPlusOne logo.svg"
                  alt="NPlusOne Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link href="/tshirt-top" className="text-gray-300 hover:text-white">T-SHIRTS</Link></li>
                <li><Link href="/tshirt-top" className="text-gray-300 hover:text-white">TOP WEAR</Link></li>
                <li><Link href="/night-bottoms" className="text-gray-300 hover:text-white">NIGHT PANT</Link></li>
                <li><Link href="/girls-wear" className="text-gray-300 hover:text-white">CHILD WEAR</Link></li>
                <li><Link href="/co-ord-sets" className="text-gray-300 hover:text-white">CO-ORD SETS</Link></li>
                <li><Link href="/night-bottoms" className="text-gray-300 hover:text-white">LADIES NIGHT DRESS</Link></li>
              </ul>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-white hover:text-gray-300 focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Cart and wishlist sections in desktop view */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={openLoginModal}
                className="text-gray-300 hover:text-white"
                aria-label="Account"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            
              <Link 
                href="/wishlist" 
                className="text-gray-300 hover:text-white relative"
              >
                <span className="sr-only">Wishlist</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            
              <div 
                className="relative"
                onMouseEnter={() => setShowCartPopup(true)}
                onMouseLeave={() => setShowCartPopup(false)}
              >
                <Link href="/cart" className="text-gray-300 hover:text-white relative">
                  <span className="sr-only">Cart</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                <CartPopup isVisible={showCartPopup} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700 fixed top-16 left-0 right-0 z-50">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/tshirt-top" 
              className="block py-2 text-white hover:bg-gray-700 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              T-SHIRTS
            </Link>
            <Link href="/tshirt-top" 
              className="block py-2 text-white hover:bg-gray-700 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              TOP WEAR
            </Link>
            <Link href="/night-bottoms" 
              className="block py-2 text-white hover:bg-gray-700 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              NIGHT PANT
            </Link>
            <Link href="/girls-wear" 
              className="block py-2 text-white hover:bg-gray-700 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              CHILD WEAR
            </Link>
            <Link href="/co-ord-sets" 
              className="block py-2 text-white hover:bg-gray-700 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              CO-ORD SETS
            </Link>
            <Link href="/night-bottoms" 
              className="block py-2 text-white hover:bg-gray-700 rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              LADIES NIGHT DRESS
            </Link>
            
            {/* Mobile icons */}
            <div className="flex space-x-4 mt-4 border-t border-gray-700 pt-4">
              <button 
                onClick={openLoginModal} 
                className="text-white hover:text-gray-300"
                aria-label="Account"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              <Link 
                href="/wishlist" 
                className="text-white hover:text-gray-300 relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Wishlist</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              
              <Link 
                href="/cart" 
                className="text-white hover:text-gray-300 relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Cart</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
      
      {/* Space to offset fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default ProductHeader; 