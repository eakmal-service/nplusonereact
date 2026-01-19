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

import { supabase } from '@/lib/supabaseClient';

const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [navCategories, setNavCategories] = useState<any[]>([]);

  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  // Fetch Categories for Navigation
  useEffect(() => {
    const fetchNavCategories = async () => {
      // Fetch all visible categories
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug, level, parent_id')
        .eq('is_visible', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (data) {
        // Build Hierarchy
        // We only want to show Level 0 (Roots) and their Level 1 children.
        const parents = data.filter(c => c.level === 0);
        const children = data.filter(c => c.level === 1);

        const tree = parents.map(parent => ({
          ...parent,
          children: children.filter(child => child.parent_id === parent.id)
        }));

        setNavCategories(tree);
      }
    };
    fetchNavCategories();
  }, []);

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
            unoptimized
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
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 relative">
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
              {navCategories.map((category) => (
                <div key={category.id} className="relative group">
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-white hover:text-silver py-2 font-medium uppercase inline-block"
                  >
                    {category.name}
                  </Link>

                  {/* Dropdown Menu */}
                  {category.children && category.children.length > 0 && (
                    <div className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                      <div className="bg-black border border-gray-800 rounded-md shadow-xl py-2 flex flex-col">
                        {category.children.map((child: any) => (
                          <Link
                            key={child.id}
                            href={`/category/${child.slug}`}
                            className="text-gray-300 hover:text-white hover:bg-gray-900 px-4 py-2 text-sm uppercase transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {navCategories.length === 0 && (
                <span className="text-gray-500">Loading...</span>
              )}
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
            {navCategories.map((category) => (
              <div key={category.id} className="mb-2">
                <Link
                  href={`/category/${category.slug}`}
                  className="block px-3 py-2 text-base font-medium hover:text-silver uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {/* Mobile Subcategories */}
                {category.children && category.children.length > 0 && (
                  <div className="pl-6 space-y-1">
                    {category.children.map((child: any) => (
                      <Link
                        key={child.id}
                        href={`/category/${child.slug}`}
                        className="block py-1 text-sm text-gray-400 hover:text-white uppercase"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

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