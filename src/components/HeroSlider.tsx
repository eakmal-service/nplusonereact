"use client";
// Force recompile

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

  // Default slides
  const defaultSlides = [
    {
      desktopSrc: '/hero-slider-desktop/Slide-1.webp',
      mobileSrc: '/hero-slider-mobile/Slide-1.webp',
      alt: 'NPlusOne Fashion Collection',
    },
    {
      desktopSrc: '/hero-slider-desktop/Slide-2.webp',
      mobileSrc: '/hero-slider-mobile/Slide-2.webp',
      alt: 'Special Offer - 35% Off',
    },
    {
      desktopSrc: '/hero-slider-desktop/Slide-3.webp',
      mobileSrc: '/hero-slider-mobile/Slide-3.webp',
      alt: 'Stylish Designs',
    },
    {
      desktopSrc: '/hero-slider-desktop/Slide-4.webp',
      mobileSrc: '/hero-slider-mobile/Slide-4.webp',
      alt: 'Fashion Collection',
    },
    {
      desktopSrc: '/hero-slider-desktop/Slide-5.webp',
      mobileSrc: '/hero-slider-mobile/Slide-5.webp',
      alt: 'Slide 5',
    },
    {
      desktopSrc: '/hero-slider-desktop/Slide-6.webp',
      mobileSrc: '/hero-slider-mobile/Slide-6.webp',
      alt: 'Slide 6',
    }
  ];

  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/admin/content?section_id=hero');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Merge mobile sources from defaultSlides if missing in fetched data
            const mergedData = data.map((slide: any, index: number) => {
              if (!slide.mobileSrc && defaultSlides[index]?.mobileSrc) {
                return { ...slide, mobileSrc: defaultSlides[index].mobileSrc };
              }
              return slide;
            });
            setSlides(mergedData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
      }
    };
    fetchSlides();
  }, []);

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
    const slide = slides[index];
    if (deviceType === 'mobile' && slide.mobileSrc) {
      return slide.mobileSrc;
    }
    // Fallback to desktopSrc for other devices or if mobileSrc is missing
    return slide.desktopSrc;
  };

  // Get the appropriate image styles based on device type
  const getImageStyle = () => {
    return {
      objectFit: 'contain' as const,
      objectPosition: 'center center'
    };
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
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
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
            <path d="M15 18l-6-6 6-6" />
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
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Dots indicators - responsive sizing and positioning */}
      <div className={`absolute ${uiSizes.bottomPosition} left-1/2 transform -translate-x-1/2 flex ${uiSizes.dotSpacing} z-20`}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${uiSizes.dotSize} rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 