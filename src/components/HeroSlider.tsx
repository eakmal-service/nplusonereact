"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Desktop and mobile slides
  const slides = [
    {
      desktop: '/hero-3.png',
      mobile: '/images/mobile/Mobile-Heroslider_1.jpg',
      alt: 'NPlusOne Fashion Collection',
    },
    {
      desktop: '/Discount.png',
      mobile: '/images/mobile/Mobile-Heroslider_2.jpg',
      alt: 'Special Offer - 35% Off',
    },
    {
      desktop: '/hero-2-2.png',
      mobile: '/images/mobile/Mobile-Heroslider_3.png',
      alt: 'Stylish Designs',
    },
  ];

  // Detect if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Manual navigation
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  // Function to notify parent that slider is visible
  useEffect(() => {
    // Dispatch an event to notify that HeroSlider is in view
    const dispatchVisibleEvent = () => {
      const event = new CustomEvent('heroslider-visible');
      window.dispatchEvent(event);
    };
    
    // Immediately dispatch when component mounts
    dispatchVisibleEvent();
    
    // Also set up an interval to keep dispatching the event
    const intervalId = setInterval(dispatchVisibleEvent, 1000);
    
    return () => {
      // When component unmounts, notify that HeroSlider is no longer in view
      clearInterval(intervalId);
      const event = new CustomEvent('heroslider-hidden');
      window.dispatchEvent(event);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Responsive height */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] xl:h-[85vh]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
              {/* Top gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-16 md:h-24 lg:h-32 bg-gradient-to-b from-black to-transparent opacity-70 z-20"></div>
              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 lg:h-32 bg-gradient-to-t from-black to-transparent opacity-70 z-20"></div>
              <Image
                src={isMobile ? slide.mobile : slide.desktop}
                alt={slide.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={index === 0}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Left/Right arrows - Hide on small screens */}
      <div className="hidden sm:block absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={goToPrevious}
          className="bg-black bg-opacity-50 text-white p-1 md:p-2 rounded-full hover:bg-opacity-75"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>
      <div className="hidden sm:block absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={goToNext}
          className="bg-black bg-opacity-50 text-white p-1 md:p-2 rounded-full hover:bg-opacity-75"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Dots indicators */}
      <div className="absolute bottom-4 md:bottom-6 lg:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
              index === currentIndex ? 'bg-[#CDCDCD]' : 'bg-[#CDCDCD] bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 