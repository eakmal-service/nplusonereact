"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LoginModal from './LoginModal';
import CartPopup from './CartPopup';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import SearchBar from './common/SearchBar';
import UserMenu from './navbar/UserMenu';

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);

  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  // Hide header on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      // If window is scrolled more than 50px, set isScrolled to true
      setIsScrolled(window.scrollY > 50);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Cart and wishlist sections in desktop view
  const cartAndWishlistSection = (
    <div className="hidden xl:flex items-center space-x-4">
      <button
        onClick={openLoginModal}
        className="text-white hover:text-silver"
        aria-label="Account"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      <Link
        href="/wishlist"
        className="text-white hover:text-silver relative"
      >
        <span className="sr-only">Wishlist</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {wishlist.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </Link>

      <div
        className="relative"
        onMouseEnter={() => setShowCartPopup(true)}
        onMouseLeave={() => setShowCartPopup(false)}
      >
        <Link href="/cart" className="text-white hover:text-silver relative">
          <span className="sr-only">Cart</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </Link>
        <CartPopup isVisible={showCartPopup} />
      </div>
    </div>
  );

  // Replace the cart and wishlist section in mobile view
  const mobileCartAndWishlistSection = (
    <div className="flex space-x-4 mt-4 border-t border-gray-700 pt-4">
      <button
        onClick={openLoginModal}
        className="text-white hover:text-silver"
        aria-label="Account"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      <Link
        href="/wishlist"
        className="text-white hover:text-silver relative"
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className="sr-only">Wishlist</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {wishlist.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </Link>

      <Link
        href="/cart"
        className="text-white hover:text-silver relative"
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className="sr-only">Cart</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {getCartCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {getCartCount()}
          </span>
        )}
      </Link>
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled || isHovered || mobileMenuOpen ? 'bg-black' : 'bg-transparent'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 relative">
                  <Image
                    src="/images/NPlusOne logo.svg"
                    alt="NPlusOne Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Mobile/Tablet menu button - hide only on xl screens */}
            <div className="xl:hidden">
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

            {/* Desktop Navigation - show only on xl screens */}
            <nav className="hidden xl:flex items-center space-x-6">
              <Link href="/suit-set" className="text-white hover:text-silver py-2 font-medium">
                SUIT SET
              </Link>
              <Link href="/western-dress" className="text-white hover:text-silver py-2 font-medium">
                WESTERN WEAR
              </Link>
              <Link href="/co-ord-sets" className="text-white hover:text-silver py-2 font-medium">
                CO-ORD SET
              </Link>
              <Link href="/kids" className="text-white hover:text-silver py-2 font-medium">
                KID'S WEAR
              </Link>
              <Link href="/indi-western" className="text-white hover:text-silver py-2 font-medium">
                INDO-WESTERN
              </Link>
              <Link href="/mens" className="text-white hover:text-silver py-2 font-medium">
                MEN'S WEAR
              </Link>
            </nav>

            {/* Right side icons - show only on xl screens */}
            {cartAndWishlistSection}
          </div>
        </div>
      </header>

      {/* Mobile/Tablet menu - hide only on xl screens */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#000000] border-t border-gray-700 fixed top-16 md:top-20 left-0 right-0 max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-5rem)] overflow-y-auto z-[100]">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar />
            </div>
            <Link href="/suit-set"
              className="block px-3 py-2 text-base font-medium hover:text-silver"
              onClick={() => setMobileMenuOpen(false)}
            >
              SUIT SET
            </Link>
            <Link href="/western-dress"
              className="block px-3 py-2 text-base font-medium hover:text-silver"
              onClick={() => setMobileMenuOpen(false)}
            >
              WESTERN WEAR
            </Link>
            <Link href="/co-ord-sets"
              className="block px-3 py-2 text-base font-medium hover:text-silver"
              onClick={() => setMobileMenuOpen(false)}
            >
              CO-ORD SET
            </Link>
            <Link href="/kids"
              className="block px-3 py-2 text-base font-medium hover:text-silver"
              onClick={() => setMobileMenuOpen(false)}
            >
              KID'S WEAR
            </Link>
            <Link href="/indi-western"
              className="block px-3 py-2 text-base font-medium hover:text-silver"
              onClick={() => setMobileMenuOpen(false)}
            >
              INDO-WESTERN
            </Link>
            <Link href="/mens"
              className="block px-3 py-2 text-base font-medium hover:text-silver"
              onClick={() => setMobileMenuOpen(false)}
            >
              MEN'S WEAR
            </Link>

            {/* Mobile icons */}
            {mobileCartAndWishlistSection}
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  );
};

export default Header;