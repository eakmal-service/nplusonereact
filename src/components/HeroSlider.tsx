"use client";

import React, { useEffect, useRef } from 'react';

const HeroSlider = () => {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [heroContent, setHeroContent] = React.useState<any>(null);

  // Fetch Hero Content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data && data.hero && data.hero.length > 0) {
            setHeroContent(data.hero[0]); // Use first slide
          }
        }
      } catch (error) {
        console.error("Failed to fetch hero content", error);
      }
    };
    fetchContent();
  }, []);

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
  }, [heroContent]); // Re-run when content loads

  // Default fallback if no content loaded yet or error
  const desktopSrc = heroContent?.videoSrc || heroContent?.desktopSrc || "/hero-slider-desktop/Desktop.mp4";
  const mobileSrc = heroContent?.mobileVideoSrc || heroContent?.mobileSrc || "/hero-slider-mobile/mobile-video.mp4";
  const isDesktopVideo = heroContent ? !!heroContent.videoSrc : true; // Default to video
  const isMobileVideo = heroContent ? !!heroContent.mobileVideoSrc : true; // Default to video

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

        {/* Desktop View */}
        <div className="relative w-full h-full hidden md:block">
          {isDesktopVideo ? (
            <video
              ref={desktopVideoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              src={desktopSrc}
              key={desktopSrc} // Force re-render on src change
            />
          ) : (
            <img src={desktopSrc} className="absolute top-0 left-0 w-full h-full object-cover" alt="Hero" />
          )}
        </div>

        {/* Mobile View */}
        <div className="relative w-full h-full block md:hidden">
          {isMobileVideo ? (
            <video
              ref={mobileVideoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              src={mobileSrc}
              key={mobileSrc} // Force re-render on src change
            />
          ) : (
            <img src={mobileSrc} className="absolute top-0 left-0 w-full h-full object-cover" alt="Hero" />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;