"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', or 'desktop'
  
  // Desktop, tablet, and mobile slides
  const slides = [
    {
      desktop: '/hero-3.png',
      tablet: '/images/mobile/Mobile-Heroslider_1.jpg', // Using mobile image for tablet or create tablet-specific images
      mobile: '/images/mobile/Mobile-Heroslider_1.jpg',
      alt: 'NPlusOne Fashion Collection',
    },
    {
      desktop: '/Discount.png',
      tablet: '/images/mobile/Mobile-Heroslider_2.jpg',
      mobile: '/images/mobile/Mobile-Heroslider_2.jpg',
      alt: 'Special Offer - 35% Off',
    },
    {
      desktop: '/hero-2-2.png',
      tablet: '/images/mobile/Mobile-Heroslider_3.png',
      mobile: '/images/mobile/Mobile-Heroslider_3.png',
      alt: 'Stylish Designs',
    },
  ];

  // Detect device type based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
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
  
  // Get appropriate image source based on device type
  const getImageSource = (slide: any) => {
    if (deviceType === 'mobile') return slide.mobile;
    if (deviceType === 'tablet') return slide.tablet;
    return slide.desktop;
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Responsive height - optimized for all device types */}
      <div className="relative w-full h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh] xl:h-[75vh]">
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
              <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 md:h-20 lg:h-28 bg-gradient-to-t from-black to-transparent opacity-70 z-20"></div>
              <Image
                src={getImageSource(slide)}
                alt={slide.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                style={{ 
                  objectFit: 'cover', 
                  objectPosition: deviceType === 'mobile' ? 'center center' : 'center center' 
                }}
                priority={index === 0}
                className="w-full h-full"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = slide.desktop; // Fallback to desktop image
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Left/Right arrows - Show on all screens but smaller on mobile */}
      <div className="absolute left-2 sm:left-3 md:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={goToPrevious}
          className="bg-black bg-opacity-40 text-white p-1.5 sm:p-2 md:p-3 rounded-full hover:bg-opacity-60 transition-all duration-300 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               width={deviceType === 'mobile' ? 14 : deviceType === 'tablet' ? 16 : 20} 
               height={deviceType === 'mobile' ? 14 : deviceType === 'tablet' ? 16 : 20} 
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
          className="bg-black bg-opacity-40 text-white p-1.5 sm:p-2 md:p-3 rounded-full hover:bg-opacity-60 transition-all duration-300 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               width={deviceType === 'mobile' ? 14 : deviceType === 'tablet' ? 16 : 20} 
               height={deviceType === 'mobile' ? 14 : deviceType === 'tablet' ? 16 : 20} 
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
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 md:space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
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