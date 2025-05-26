"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const MyFavorite: React.FC = () => {
  // Image data with links to categories
  const favoriteImages = [
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

  return (
    <div className="w-full py-8">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Silver box with Favorites text and Shop Now button */}
        <div className="bg-[#CDCDCD] rounded-lg p-6 flex flex-col justify-center items-center w-full md:w-1/4 min-h-[300px]">
          <h2 className="text-custom-black text-3xl md:text-4xl font-bold mb-6">My Favorites</h2>
          <Link href="/wishlist">
            <button className="bg-custom-black text-white px-6 py-3 rounded hover:bg-silver transition duration-300">
              SHOP NOW
            </button>
          </Link>
        </div>
        
        {/* Images grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-3/4">
          {favoriteImages.map((image, index) => (
            <Link key={index} href={image.link} className="block">
              <div className="relative rounded-lg border-2 border-[#CDCDCD] h-auto">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto max-w-100% transition-transform duration-300 hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFavorite; 