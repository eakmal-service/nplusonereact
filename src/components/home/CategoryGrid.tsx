"use client";

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import Image from 'next/image';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 px-2 sm:px-4">
      {categories.map((category, index) => (
        <Link key={index} href={category.link} className="block w-full">
          <div className="relative border-4 border-[#CDCDCD] rounded-lg overflow-hidden w-full aspect-[294/370]">
            <Image
              src={category.image}
              alt={category.alt}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
              priority={index < 3}
              className="object-fill transition-transform duration-300 hover:scale-105"
              quality={90}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2">
              <h3 className="text-white text-base sm:text-lg md:text-xl font-bold text-center">{category.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid; 