"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DiscountBannerProps {
  image?: string;
  link?: string;
  alt?: string;
}

const DiscountBanner: React.FC<DiscountBannerProps> = ({
  image = "/images/Discount-2.png",
  link = "/sales",
  alt = "Special Discount Offers"
}) => {
  return (
    <div className="mt-8 mb-8">
      <Link href={link}>
        <div className="relative overflow-hidden rounded-lg w-full">
          <Image
            src={image}
            alt={alt}
            width={1920}
            height={500}
            sizes="100vw"
            className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>
      </Link>
    </div>
  );
};

export default DiscountBanner; 