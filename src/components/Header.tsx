"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from './LoginModal';
import CartPopup from './CartPopup';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

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

  const handleDropdownEnter = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

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
    <div className="hidden md:flex items-center space-x-4">
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
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled || isHovered || mobileMenuOpen ? 'bg-black' : 'bg-transparent'
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

          {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
            <div 
              className="relative group"
              onMouseEnter={() => handleDropdownEnter('tshirt')}
              onMouseLeave={handleDropdownLeave}
            >
                <Link href="/tshirt-top" className="text-white hover:text-silver py-2">
                TSHIRT
              </Link>
              {activeDropdown === 'tshirt' && (
                  <div className="absolute left-0 mt-2 w-[500px] bg-black shadow-lg rounded-md py-5 px-6 grid grid-cols-3 gap-4 z-10">
                  <div className="col-span-1">
                      <h3 className="font-medium text-silver mb-3">CATEGORIES</h3>
                    <ul className="space-y-2">
                        <li><Link href="/tshirt-top/round-neck" className="block text-silver hover:text-white">Round Neck</Link></li>
                        <li><Link href="/tshirt-top/v-neck" className="block text-silver hover:text-white">V-Neck</Link></li>
                        <li><Link href="/tshirt-top/printed" className="block text-silver hover:text-white">Printed</Link></li>
                        <li><Link href="/tshirt-top/oversized" className="block text-silver hover:text-white">Oversized</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=T-Shirt+1" 
                        alt="T-shirt Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Casual Collection
                      </div>
                    </div>
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=T-Shirt+2" 
                        alt="T-shirt Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Premium Collection
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* TOP WEAR */}
            <div 
              className="relative group"
              onMouseEnter={() => handleDropdownEnter('top-wear')}
              onMouseLeave={handleDropdownLeave}
            >
                <Link href="/tshirt-top" className="text-white hover:text-silver py-2">
                TOP WEAR
              </Link>
              {activeDropdown === 'top-wear' && (
                  <div className="absolute left-0 mt-2 w-[500px] bg-black shadow-lg rounded-md py-5 px-6 grid grid-cols-3 gap-4 z-10">
                  <div className="col-span-1">
                      <h3 className="font-medium text-silver mb-3">CATEGORIES</h3>
                    <ul className="space-y-2">
                        <li><Link href="/tshirt-top/crop-tops" className="block text-silver hover:text-white">Crop Tops</Link></li>
                        <li><Link href="/tshirt-top/blouses" className="block text-silver hover:text-white">Blouses</Link></li>
                        <li><Link href="/tshirt-top/shirts" className="block text-silver hover:text-white">Shirts</Link></li>
                        <li><Link href="/tshirt-top/tunics" className="block text-silver hover:text-white">Tunics</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Top+Wear+1" 
                        alt="Top Wear Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Casual Collection
                      </div>
                    </div>
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Top+Wear+2" 
                        alt="Top Wear Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Formal Collection
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* NIGHT PANT */}
            <div 
              className="relative group"
              onMouseEnter={() => handleDropdownEnter('night-pant')}
              onMouseLeave={handleDropdownLeave}
            >
                <Link href="/night-bottoms" className="text-white hover:text-silver py-2">
                NIGHT PANT
              </Link>
              {activeDropdown === 'night-pant' && (
                  <div className="absolute left-0 mt-2 w-[500px] bg-black shadow-lg rounded-md py-5 px-6 grid grid-cols-3 gap-4 z-10">
                  <div className="col-span-1">
                      <h3 className="font-medium text-silver mb-3">CATEGORIES</h3>
                    <ul className="space-y-2">
                        <li><Link href="/night-bottoms/pajamas" className="block text-silver hover:text-white">Pajamas</Link></li>
                        <li><Link href="/night-bottoms/lounge-pants" className="block text-silver hover:text-white">Lounge Pants</Link></li>
                        <li><Link href="/night-bottoms/shorts" className="block text-silver hover:text-white">Shorts</Link></li>
                        <li><Link href="/night-bottoms/capris" className="block text-silver hover:text-white">Capris</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Night+Pant+1" 
                        alt="Night Pant Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Cotton Collection
                      </div>
                    </div>
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Night+Pant+2" 
                        alt="Night Pant Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                          Satin Collection
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* CHILD WEAR */}
            <div 
              className="relative group"
              onMouseEnter={() => handleDropdownEnter('child-wear')}
              onMouseLeave={handleDropdownLeave}
            >
                <Link href="/girls-wear" className="text-white hover:text-silver py-2">
                CHILD WEAR
              </Link>
              {activeDropdown === 'child-wear' && (
                  <div className="absolute left-0 mt-2 w-[500px] bg-black shadow-lg rounded-md py-5 px-6 grid grid-cols-3 gap-4 z-10">
                  <div className="col-span-1">
                      <h3 className="font-medium text-silver mb-3">CATEGORIES</h3>
                    <ul className="space-y-2">
                        <li><Link href="/girls-wear/tops" className="block text-silver hover:text-white">Tops</Link></li>
                        <li><Link href="/girls-wear/bottoms" className="block text-silver hover:text-white">Bottoms</Link></li>
                        <li><Link href="/girls-wear/dresses" className="block text-silver hover:text-white">Dresses</Link></li>
                        <li><Link href="/girls-wear/sets" className="block text-silver hover:text-white">Sets</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Child+Wear+1" 
                        alt="Child Wear Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                          Casual Collection
                      </div>
                    </div>
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Child+Wear+2" 
                        alt="Child Wear Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                          Party Collection
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* CO-ORD SETS */}
            <div 
              className="relative group"
              onMouseEnter={() => handleDropdownEnter('co-ord-sets')}
              onMouseLeave={handleDropdownLeave}
            >
                <Link href="/co-ord-sets" className="text-white hover:text-silver py-2">
                CO-ORD SETS
              </Link>
              {activeDropdown === 'co-ord-sets' && (
                  <div className="absolute left-0 mt-2 w-[500px] bg-black shadow-lg rounded-md py-5 px-6 grid grid-cols-3 gap-4 z-10">
                  <div className="col-span-1">
                      <h3 className="font-medium text-silver mb-3">CATEGORIES</h3>
                    <ul className="space-y-2">
                        <li><Link href="/co-ord-sets/casual" className="block text-silver hover:text-white">Casual Sets</Link></li>
                        <li><Link href="/co-ord-sets/formal" className="block text-silver hover:text-white">Formal Sets</Link></li>
                        <li><Link href="/co-ord-sets/party" className="block text-silver hover:text-white">Party Sets</Link></li>
                        <li><Link href="/co-ord-sets/lounge" className="block text-silver hover:text-white">Lounge Sets</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Co-ord+Sets+1" 
                        alt="Co-ord Sets Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Trending Sets
                      </div>
                    </div>
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Co-ord+Sets+2" 
                        alt="Co-ord Sets Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Premium Sets
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* LADIES NIGHT DRESS */}
            <div 
              className="relative group"
                onMouseEnter={() => handleDropdownEnter('night-dress')}
              onMouseLeave={handleDropdownLeave}
            >
                <Link href="/night-bottoms" className="text-white hover:text-silver py-2">
                LADIES NIGHT DRESS
              </Link>
                {activeDropdown === 'night-dress' && (
                  <div className="absolute left-0 mt-2 w-[500px] bg-black shadow-lg rounded-md py-5 px-6 grid grid-cols-3 gap-4 z-10">
                  <div className="col-span-1">
                      <h3 className="font-medium text-silver mb-3">CATEGORIES</h3>
                    <ul className="space-y-2">
                        <li><Link href="/night-bottoms/nightgowns" className="block text-silver hover:text-white">Nightgowns</Link></li>
                        <li><Link href="/night-bottoms/sleepshirts" className="block text-silver hover:text-white">Sleep Shirts</Link></li>
                        <li><Link href="/night-bottoms/sets" className="block text-silver hover:text-white">Night Sets</Link></li>
                        <li><Link href="/night-bottoms/robes" className="block text-silver hover:text-white">Robes</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Night+Dress+1" 
                        alt="Night Dress Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Satin Collection
                      </div>
                    </div>
                    <div className="relative h-32 rounded overflow-hidden">
                      <Image 
                        src="https://placehold.co/600x400/gray/white?text=Night+Dress+2" 
                        alt="Night Dress Category"
                        fill
                        className="object-cover"
                      />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-silver text-xs py-1 px-2">
                        Cotton Collection
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side icons - always visible */}
          {cartAndWishlistSection}
        </div>
      </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#000000] border-t border-gray-700">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/tshirt-top" 
              className="block py-2 text-white hover:bg-silver rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              TSHIRT
            </Link>
            <Link href="/tshirt-top" 
              className="block py-2 text-white hover:bg-silver rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              TOP WEAR
            </Link>
            <Link href="/night-bottoms" 
              className="block py-2 text-white hover:bg-silver rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              NIGHT PANT
            </Link>
            <Link href="/girls-wear" 
              className="block py-2 text-white hover:bg-silver rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              CHILD WEAR
            </Link>
            <Link href="/co-ord-sets" 
              className="block py-2 text-white hover:bg-silver rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              CO-ORD SETS
            </Link>
            <Link href="/night-bottoms" 
              className="block py-2 text-white hover:bg-silver rounded px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              LADIES NIGHT DRESS
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