"use client";

import React, { useState, useEffect } from 'react';
import CategoryGrid from './home/CategoryGrid';
import CollectionSlider from './home/CollectionSlider';
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

const CategoryCards = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [userName, setUserName] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [hasViewedProducts, setHasViewedProducts] = useState(false);

  // CMS Content State
  const [categoriesData, setCategoriesData] = useState(categories);
  const [collectionsData, setCollectionsData] = useState(collectionItems);
  const [bannerData, setBannerData] = useState({
    image: "/images/Discount-2.png",
    link: "/sales",
    alt: "Special Discount Offers"
  });
  // For recommended products, we'll stick to mock data for now unless CMS provides full product objects
  // Implementing full product fetch from IDs is out of scope for this quick task unless requested. 
  // We'll use the static recommendedProducts list but allow it to be overriden if CMS sends matching structure.
  const [recommendedData, setRecommendedData] = useState(recommendedProducts);

  useEffect(() => {
    // Fetch CMS Content
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.categories) setCategoriesData(data.categories);
          if (data.collections) setCollectionsData(data.collections);
          if (data.banner) setBannerData(data.banner);
          if (data.recommended && Array.isArray(data.recommended)) setRecommendedData(data.recommended);
        }
      } catch (error) {
        console.error('Failed to fetch CMS content:', error);
      }
    };
    fetchContent();

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

        {/* Discount Banner */}
        <div className="px-2 sm:px-4">
          <DiscountBanner image={bannerData.image} link={bannerData.link} alt={bannerData.alt} />
        </div>

        {/* Explore Collection Title */}
        <SectionTitle title="Explore Collection" />

        {/* Collection Slider */}
        <CollectionSlider collectionItems={collectionsData} />

        {/* Recommended Products Section */}
        <RecommendedProducts products={recommendedData} />
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