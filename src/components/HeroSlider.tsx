"use client";

import React, { useEffect, useRef } from 'react';

const HeroSlider = () => {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Function to notify parent that slider is visible (keeping existing logic)
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

  // Ensure videos play when component mounts/updates
  useEffect(() => {
    if (desktopVideoRef.current) {
      desktopVideoRef.current.play().catch(e => console.log("Desktop video autoplay blocked", e));
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.play().catch(e => console.log("Mobile video autoplay blocked", e));
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Navbar Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="h-16 md:h-20 bg-gradient-to-b from-black to-transparent opacity-60"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full h-full">
        {/* Dark Overlay for better text visibility if needed */}
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>

        {/* 
            Desktop Video 
            Hidden on mobile (block md:hidden) 
            We use separate video tags to allow the browser to prioritize loading 
            based on display:none optimizations or media queries if we used source tags,
            but separate elements with CSS display toggling is the user's requested approach
            to ensure "directly load mobile image" (video in this case).
        */}
        <div className="relative w-full h-full hidden md:block">
          <video
            ref={desktopVideoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src="/hero-slider-desktop/Desktop.mp4"
          />
        </div>

        {/* 
            Mobile Video 
            Visible only on mobile (block md:hidden)
            Using object-cover to ensure it fills the screen without empty spaces
        */}
        <div className="relative w-full h-full block md:hidden">
          <video
            ref={mobileVideoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src="/hero-slider-mobile/mobile-video.mp4"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;