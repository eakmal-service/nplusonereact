"use client";

import React, { useState, useEffect } from 'react';
import CategoryGrid from './home/CategoryGrid';
import DiscountBanner from './home/DiscountBanner';
import RecommendedProducts from './home/RecommendedProducts';
import SectionTitle from './home/SectionTitle';
import WelcomePopup from './WelcomePopup';
import { Product } from '@/types';
const recommendedProducts: any[] = [];
const sampleRecentlyViewed: any[] = [];

const shoppingGreetings = [
  "Ready to explore our latest collection?",
  "Discover stylish deals waiting for you!",
  "Welcome back to NPlusOne shopping!",
  "Your fashion journey continues here!",
  "New arrivals just for your style!",
  "Find your perfect fashion match today!",
  "Exclusive deals waiting in your cart!",
  "Shop the season's hottest trends now!"
];

import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';
import { useCategories } from '@/hooks/useCategories';


interface CategoryCardsProps {
  categories?: any[];
  collections?: any[];
  banner?: any;
  recommended?: any[];
}

const CategoryCards = ({ categories: cmsCategories, collections: cmsCollections, banner: cmsBanner, recommended: cmsRecommended }: CategoryCardsProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [userName, setUserName] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [hasViewedProducts, setHasViewedProducts] = useState(false);

  // Use hook for specific category logic if needed, or props
  // If props are missing (not passed from page server comp), we might want to fetch?
  // But typically this component is used with data passed in or fetches itself.
  // Given existing code favored props || mock, we'll favor props || hook/state.

  const { categories: hookCategories } = useCategories();
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    // Fetch collections if not provided
    if (!cmsCollections) {
      fetch('/api/admin/content?section_id=collections')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCollections(data);
          else setCollections([]); // Empty if no data
        })
        .catch(err => console.error("Failed to fetch collections", err));
    }
  }, [cmsCollections]);


  const categoriesData = cmsCategories || hookCategories || [];
  const collectionsData = cmsCollections || collections || [];
  const bannerData = cmsBanner || {
    image: "/images/Discount-2.png",
    link: "/sales",
    alt: "Special Discount Offers"
  };
  const recommendedData = cmsRecommended || recommendedProducts; // keeping recommendedProducts for now as it was empty anyway in mock

  useEffect(() => {
    // This would check for user data from login system
    const loggedInUserName = localStorage.getItem('user_logged_in_name');
    if (loggedInUserName) {
      setUserName(loggedInUserName);
    }

    // Load recently viewed products from localStorage
    if (typeof window !== 'undefined') {
      const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      if (storedRecentlyViewed.length > 0) {

        // Recalculate badges for stored products to ensure they match current logic
        const updatedRecentlyViewed = storedRecentlyViewed.map((p: Product) => {
          let badge = undefined;

          // 1. Calculate Discount Badge (Priority)
          if (p.originalPrice && (p.salePrice || p.price)) {
            const mrp = parseFloat(p.originalPrice.toString().replace(/[^0-9.]/g, ''));
            const selling = parseFloat((p.salePrice || p.price).toString().replace(/[^0-9.]/g, ''));

            if (!isNaN(mrp) && !isNaN(selling) && mrp > selling) {
              const percentage = Math.round(((mrp - selling) / mrp) * 100);
              if (percentage > 0) {
                badge = `${percentage}% OFF`;
              }
            }
          }

          // 2. Calculate New Badge (If no discount badge)
          if (!badge && p.dateAdded) {
            const createdAt = new Date(p.dateAdded);
            const timeDiff = Math.abs(new Date().getTime() - createdAt.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays <= 30) {
              badge = 'New';
            }
          }

          // 3. Fallback to existing badge
          if (!badge && p.badge) {
            badge = p.badge;
          }

          return {
            ...p,
            badge: badge
          };
        });

        setRecentlyViewed(updatedRecentlyViewed);
        setHasViewedProducts(true);
      }
    }
  }, []);

  const handleLogoClick = () => {
    // Only show popup if user is logged in
    if (userName) {
      // Show a random greeting
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * shoppingGreetings.length);
      } while (newIndex === greetingIndex && shoppingGreetings.length > 1);

      setGreetingIndex(newIndex);
      setShowPopup(true);

      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Explore Title */}
        <SectionTitle title="Explore Category" />



        {/* Category Grid */}
        <CategoryGrid categories={categoriesData} />



        {/* New Arrivals / Recommended Section */}
        {recommendedData.length > 0 && (
          <RecommendedProducts
            products={recommendedData}
            title="New Arrivals"
          />
        )}




        {/* NPlusOne Category Banner */}
        <div className="w-full mb-8 mt-12 relative">
          <Image
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/douy8ujry/image/upload/v1767777418/nplusone-fashion/Banner%20images/NPlusOne.png")} // Fallback if local but safe to wrap
            alt="NPlusOne Collection"
            width={1200}
            height={600}
            className="w-full h-auto object-cover rounded-lg"
            priority={true}
            loading="eager"
            quality={90}
          />
        </div>

        {/* Recently Viewed Products Section */}
        {hasViewedProducts && recentlyViewed.length > 0 && (
          <RecommendedProducts
            products={recentlyViewed}
            title="Recently Viewed"
          />
        )}
      </div>

      {/* Popup Message */}
      <WelcomePopup
        userName={userName}
        greeting={shoppingGreetings[greetingIndex]}
        showPopup={showPopup && !!userName}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default CategoryCards; 