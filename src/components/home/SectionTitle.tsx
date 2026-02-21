"use client";

import React from 'react';

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className="w-full py-4 sm:py-6 md:py-8 px-4">
      <div className="relative max-w-6xl mx-auto text-center">
        <h3
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center py-4 sm:py-6 md:py-8 text-[#C0C0C0]"
          role="heading"
        >
          {title}
        </h3>
        <div className="absolute left-0 right-0 bottom-2 h-1 bg-gradient-to-r from-transparent via-silver to-transparent max-w-xs mx-auto"></div>
      </div>
    </div>
  );
};

export default SectionTitle; 