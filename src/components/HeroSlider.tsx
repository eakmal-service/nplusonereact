"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  // Slides with desktop, tablet and mobile images
  const slides = [
    {
      desktopSrc: '/hero-3.png',
      tabletSrc: '/Tablet view/1.png',
      mobileSrc: '/Mobile view/1.png',
      alt: 'NPlusOne Fashion Collection',
      mobilePosition: '50% 50%'
    },
    {
      desktopSrc: '/Discount.png',
      tabletSrc: '/Tablet view/2.png',
      mobileSrc: '/Mobile view/2.png',
      alt: 'Special Offer - 35% Off',
      mobilePosition: '50% 50%'
    },
    {
      desktopSrc: '/hero-2-2.png',
      tabletSrc: '/Tablet view/3.png',
      mobileSrc: '/Mobile view/3.png',
      alt: 'Stylish Designs',
      mobilePosition: '50% 50%'
    },
    {
      // Adding the fourth image for mobile/tablet
      desktopSrc: '/hero-3.png', // Reusing existing desktop image as fallback
      tabletSrc: '/Tablet view/4.png',
      mobileSrc: '/Mobile view/4.png',
      alt: 'Fashion Collection',
      mobilePosition: '50% 50%'
    }
  ];

  // Track screen size for responsive behavior and set device type
  useEffect(() => {
    const updateDeviceType = (width: number) => {
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      updateDeviceType(width);
    };
    
    // Check on initial load
    handleResize();
    
    // Add event listener for window resize with debounce for better performance
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    
    // Cleanup
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
    };
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
  
  // Helper to determine UI sizes based on screen width
  const getUISizes = () => {
    const width = screenSize.width;
    if (width < 640) {
      return {
        arrowSize: 14,
        arrowPadding: 'p-1.5',
        dotSize: 'w-1.5 h-1.5',
        dotSpacing: 'space-x-1.5',
        bottomPosition: 'bottom-6'
      };
    } else if (width < 1024) {
      return {
        arrowSize: 16,
        arrowPadding: 'p-2',
        dotSize: 'w-2 h-2',
        dotSpacing: 'space-x-2',
        bottomPosition: 'bottom-8'
      };
    } else {
      return {
        arrowSize: 20,
        arrowPadding: 'p-3',
        dotSize: 'w-3 h-3',
        dotSpacing: 'space-x-3',
        bottomPosition: 'bottom-10'
      };
    }
  };

  const uiSizes = getUISizes();

  // Get the appropriate image source based on device type
  const getImageSource = (index: number) => {
    switch (deviceType) {
      case 'mobile':
        return slides[index].mobileSrc;
      case 'tablet':
        return slides[index].tabletSrc;
      default:
        return slides[index].desktopSrc;
    }
  };

  // Get the appropriate image styles based on device type
  const getImageStyle = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          objectFit: 'cover' as const,
          objectPosition: slides[currentIndex]?.mobilePosition || 'center center'
        };
      case 'tablet':
      case 'desktop':
      default:
        return {
          objectFit: 'cover' as const,
          objectPosition: 'center center'
        };
    }
  };

  // Create a debug display to check what's happening (can be removed in production)
  const currentImageSrc = getImageSource(currentIndex);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Logo wrapper with higher z-index */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="h-16 md:h-20 bg-gradient-to-b from-black to-transparent opacity-60"></div>
      </div>
      
      {/* Full screen height for all devices */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
              {/* Top gradient overlay - responsive heights */}
              <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 md:h-20 lg:h-28 bg-gradient-to-b from-black to-transparent opacity-70 z-20"></div>
              {/* Bottom gradient overlay - responsive heights */}
              <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 lg:h-32 bg-gradient-to-t from-black to-transparent opacity-70 z-20"></div>
              <Image
                src={getImageSource(index)}
                alt={slide.alt}
                fill
                sizes="100vw"
                style={getImageStyle()}
                priority={index === 0}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Left/Right arrows - Show on all screens but smaller on mobile */}
      <div className="absolute left-2 sm:left-3 md:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={goToPrevious}
          className={`bg-black bg-opacity-50 text-white ${uiSizes.arrowPadding} rounded-full hover:bg-opacity-70 transition-all duration-300 backdrop-blur-sm`}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               width={uiSizes.arrowSize}
               height={uiSizes.arrowSize}
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>
      <div className="absolute right-2 sm:right-3 md:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={goToNext}
          className={`bg-black bg-opacity-50 text-white ${uiSizes.arrowPadding} rounded-full hover:bg-opacity-70 transition-all duration-300 backdrop-blur-sm`}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               width={uiSizes.arrowSize}
               height={uiSizes.arrowSize}
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Dots indicators - responsive sizing and positioning */}
      <div className={`absolute ${uiSizes.bottomPosition} left-1/2 transform -translate-x-1/2 flex ${uiSizes.dotSpacing} z-20`}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${uiSizes.dotSize} rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 