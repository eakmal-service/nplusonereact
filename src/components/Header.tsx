"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import LoginModal from './LoginModal';
import CartPopup from './CartPopup';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import SearchBar from './common/SearchBar';
import UserMenu from './navbar/UserMenu';

const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // Add this effect
  useEffect(() => {
    if (searchParams?.get('login') === 'true') {
      setShowLoginModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
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
      <UserMenu onLoginClick={openLoginModal} />

      <Link
        href="/wishlist"
        className="text-white hover:text-silver relative"
      >
        <span className="sr-only">Wishlist</span>
        <div className="relative h-6 w-6">
          <Image
            src={pathname === '/wishlist' ? '/icons/wishlist-filled.png' : '/icons/wishlist-outline.png'}
            alt="Wishlist"
            fill
            className="object-contain invert"
          />
        </div>
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
          <div className="relative h-6 w-6">
            <Image
              src={pathname === '/cart' ? '/icons/cart-filled.png' : '/icons/cart-outline.png'}
              alt="Cart"
              fill
              className="object-contain invert"
            />
          </div>
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
      <div className="flex items-center">
        <UserMenu onLoginClick={openLoginModal} />
      </div>

      <Link
        href="/wishlist"
        className="text-white hover:text-silver relative"
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className="sr-only">Wishlist</span>
        <div className="relative h-6 w-6">
          <Image
            src={pathname === '/wishlist' ? '/icons/wishlist-filled.png' : '/icons/wishlist-outline.png'}
            alt="Wishlist"
            fill
            className="object-contain invert"
          />
        </div>
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
        <div className="relative h-6 w-6">
          <Image
            src={pathname === '/cart' ? '/icons/cart-filled.png' : '/icons/cart-outline.png'}
            alt="Cart"
            fill
            className="object-contain invert"
          />
        </div>
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
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled || isHovered || mobileMenuOpen ||
          ['/contact', '/about', '/refund-policy', '/shipping', '/terms', '/privacy'].includes(pathname || '')
          ? 'bg-black'
          : 'bg-transparent'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="relative w-28 h-8 md:w-40 md:h-12">
                  <Image
                    src="https://res.cloudinary.com/douy8ujry/image/upload/v1767777416/nplusone-fashion/Logo/logo.svg"
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
                className="text-white hover:text-gray-300 focus:outline-none p-2"
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

      {/* Mobile/Tablet menu - Side Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[40] xl:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-black border-r border-gray-800 z-[60] transform transition-transform duration-300 overflow-y-auto shadow-2xl xl:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative w-24 h-6">
                    <Image
                      src="https://res.cloudinary.com/douy8ujry/image/upload/v1767777416/nplusone-fashion/Logo/logo.svg"
                      alt="NPlusOne Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 py-4 px-4 space-y-2">
                <SearchBar />
                <div className="h-4"></div>
                <Link href="/suit-set"
                  className="block px-3 py-3 text-sm font-medium hover:bg-gray-900 rounded-md transition-colors text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SUIT SET
                </Link>
                <Link href="/western-dress"
                  className="block px-3 py-3 text-sm font-medium hover:bg-gray-900 rounded-md transition-colors text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  WESTERN WEAR
                </Link>
                <Link href="/co-ord-sets"
                  className="block px-3 py-3 text-sm font-medium hover:bg-gray-900 rounded-md transition-colors text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CO-ORD SET
                </Link>
                <Link href="/kids"
                  className="block px-3 py-3 text-sm font-medium hover:bg-gray-900 rounded-md transition-colors text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  KID'S WEAR
                </Link>
                <Link href="/indi-western"
                  className="block px-3 py-3 text-sm font-medium hover:bg-gray-900 rounded-md transition-colors text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  INDO-WESTERN
                </Link>
                <Link href="/mens"
                  className="block px-3 py-3 text-sm font-medium hover:bg-gray-900 rounded-md transition-colors text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  MEN'S WEAR
                </Link>

                <div className="border-t border-gray-800 my-4 pt-4">
                  {/* Account / Cart Links in Drawer */}
                  {mobileCartAndWishlistSection}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  );
};

export default Header;