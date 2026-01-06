"use client";

import React, { useState, useEffect } from 'react';
import CategoryGrid from './home/CategoryGrid';
import DiscountBanner from './home/DiscountBanner';
import RecommendedProducts from './home/RecommendedProducts';
import SectionTitle from './home/SectionTitle';
import WelcomePopup from './WelcomePopup';
import { Product } from '@/types';
import {
  categories,
  collectionItems,
  recommendedProducts,
  sampleRecentlyViewed,
  shoppingGreetings
} from '@/data/mockData';

import Image from 'next/image';


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

  // Use props if available, otherwise fallback to mock data
  const categoriesData = cmsCategories || categories;
  const collectionsData = cmsCollections || collectionItems;
  const bannerData = cmsBanner || {
    image: "/images/Discount-2.png",
    link: "/sales",
    alt: "Special Discount Offers"
  };
  const recommendedData = cmsRecommended || recommendedProducts;

  useEffect(() => {
    // Fetch logic removed - passed as props

    // This would check for user data from login system
    const loggedInUserName = localStorage.getItem('user_logged_in_name');
    if (loggedInUserName) {
      setUserName(loggedInUserName);
    }

    // Load recently viewed products from localStorage
    if (typeof window !== 'undefined') {
      const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      if (storedRecentlyViewed.length > 0) {
        setRecentlyViewed(storedRecentlyViewed);
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




        {/* NPlusOne Category Banner */}
        <div className="w-full mb-8 mt-12 relative">
          <Image
            src="/images/categories/NPlusOne.png"
            alt="NPlusOne Collection"
            width={1200}
            height={600}
            className="w-full h-auto object-cover rounded-lg"
            priority
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