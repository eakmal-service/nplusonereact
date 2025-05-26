"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use single image paths that will automatically be responsive
  const slides = [
    {
      url: '/hero-1.png',
      alt: 'NPlusOne Fashion Collection',
    },
    {
      url: '/images/Slider_2.jpg',
      alt: 'Premium Collection',
    },
    {
      url: '/images/slider_3.png',
      alt: 'Stylish Designs',
    },
  ];

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
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Hero images */}
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
              {/* Top gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent opacity-70 z-20"></div>
              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent opacity-70 z-20"></div>
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={index === 0}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Left/Right arrows */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={goToPrevious}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={goToNext}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Dots indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-[#CDCDCD]' : 'bg-[#CDCDCD] bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 