"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DiscountBanner: React.FC = () => {
  return (
    <div className="mt-8 mb-8">
      <Link href="/sales">
        <div className="relative overflow-hidden rounded-lg w-full">
          <Image 
            src="/images/Discount-2.png"
            alt="Special Discount Offers"
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