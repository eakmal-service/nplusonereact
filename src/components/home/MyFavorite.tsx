"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const MyFavorite: React.FC = () => {
  // Image data with links to categories
  // Default favorites
  const defaultFavorites = [
    {
      src: '/images/favorites/1.png',
      alt: 'Favorite Item 1',
      link: '/tshirt-top'
    },
    {
      src: '/images/favorites/2.png',
      alt: 'Favorite Item 2',
      link: '/co-ord-sets'
    },
    {
      src: '/images/favorites/3.png',
      alt: 'Favorite Item 3',
      link: '/night-bottoms'
    },
    {
      src: '/images/favorites/4.png',
      alt: 'Favorite Item 4',
      link: '/girls-wear'
    }
  ];

  const [favoriteImages, setFavoriteImages] = React.useState(defaultFavorites);

  React.useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/admin/content?section_id=favorites');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFavoriteImages(data);
          }
        }
      } catch (err) {
        console.error("Failed to load favorites", err);
      }
    };
    fetchFavorites();
  }, []);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="w-full py-4 overflow-hidden relative group">

          {/* Mobile Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
            aria-label="Scroll Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
            aria-label="Scroll Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Responsive container: Grid on desktop, Horizontal slider on mobile */}
          <div
            ref={scrollContainerRef}
            className="
            flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:pb-0 scrollbar-hide
            md:grid md:grid-cols-5 md:gap-4 md:overflow-visible
          ">
            {/* Silver box with Favorites text and Shop Now button */}
            <div className="
              flex-none snap-center w-[200px] md:w-auto h-[330px]
              bg-[#CDCDCD] rounded-lg p-6 flex flex-col justify-center items-center
            ">
              <h2 className="text-custom-black text-3xl font-bold mb-6 text-center">My Favorites</h2>
              <Link href="/wishlist">
                <button className="bg-custom-black text-white px-6 py-2 rounded hover:bg-zinc-800 transition duration-300 text-sm tracking-wider">
                  SHOP NOW
                </button>
              </Link>
            </div>

            {/* Images grid items */}
            {favoriteImages.map((image, index) => (
              <Link key={index} href={image.link} className="block flex-none snap-center">
                <div className="
                  relative rounded-lg overflow-hidden group
                  w-[200px] h-[330px] md:w-full md:h-[330px]
                ">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFavorite; 