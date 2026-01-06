"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const HeroSlider = ({ heroContent }: { heroContent?: any }) => {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  // const [heroContent, setHeroContent] = React.useState<any>(null); // Removed state

  // Fetch logic removed - content passed as prop

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
  // Adding .mp4 extension for better browser compatibility
  // Helper to optimize Cloudinary URLs
  const optimizeUrl = (url: string) => {
    return url; // DISABLED Cloudinary optimization for now
    /*
    if (url.includes('cloudinary.com') && !url.includes('f_auto,q_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    return url;
    */
  };

  const defaultDesktop = optimizeUrl("https://res.cloudinary.com/douy8ujry/video/upload/v1/nplus/hero-slider-desktop/Desktop.mp4");
  const defaultMobile = optimizeUrl("https://res.cloudinary.com/douy8ujry/video/upload/v1/nplus/hero-slider-mobile/mobile-video.mp4");

  // Helper to ensure valid URL or fallback
  const getValidSrc = (src: string | undefined, defaultSrc: string) => {
    const validSrc = (src && src.trim().length > 0) ? src : defaultSrc;
    return optimizeUrl(validSrc);
  };

  const desktopSrc = getValidSrc(heroContent?.videoSrc || heroContent?.desktopSrc, defaultDesktop);
  const mobileSrc = getValidSrc(heroContent?.mobileVideoSrc || heroContent?.mobileSrc, defaultMobile);

  // Determine if content is video or image
  // If we fell back to default, it is a video (defaultDesktop ends in .mp4)
  // If explicit videoSrc is present and valid, it's a video
  // If explicit desktopSrc is present and valid (and no videoSrc), it's an image
  const isVideoSrcFn = (vid: string | undefined, img: string | undefined) => {
    if (vid && vid.trim().length > 0) return true;
    if (img && img.trim().length > 0) return false;
    return true; // Default to video if nothing is provided
  }

  const isDesktopVideo = isVideoSrcFn(heroContent?.videoSrc, heroContent?.desktopSrc);
  const isMobileVideo = isVideoSrcFn(heroContent?.mobileVideoSrc, heroContent?.mobileSrc);

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
              preload="auto"
              src={desktopSrc}
              key={desktopSrc} // Force re-render on src change
            />
          ) : (
            <Image
              src={desktopSrc}
              alt="Hero"
              fill
              className="object-cover"
              priority
            />
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
              preload="auto"
              src={mobileSrc}
              key={mobileSrc} // Force re-render on src change
            />
          ) : (
            <Image
              src={mobileSrc}
              alt="Hero"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;