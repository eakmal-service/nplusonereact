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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 mb-8 text-center">
      {/* Mobile: 3 columns, Desktop: 6 columns */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-6">
        {categories.map((category, index) => (
          <Link key={index} href={category.link} className="flex flex-col items-center group">
            <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-silver transition-colors duration-300">
              <Image
                src={category.image}
                alt={category.alt}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                priority={index < 6}
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                quality={85}
              />
            </div>
            <span className="mt-2 text-[10px] md:text-sm font-medium text-gray-300 uppercase tracking-wide group-hover:text-white transition-colors line-clamp-1">
              {category.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid; 