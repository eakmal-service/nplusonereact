'use client';

import Image from 'next/image';

export default function AdminHeader() {
  return (
    <header className="bg-black shadow-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        {/* 
            Header Height:
            - Increased to match the home screen's layout logic or at least accommodate the large logo without cutting it off.
            - Home screen has h-16/h-20 but allows logo overlap. 
            - Here, in a solid header, we should probably make the header taller OR float the logo.
            - Let's make the header taller to fully contain the large logo: h-32/h-40 to match logo size.
         */}
        <div className="flex items-center justify-between h-32 md:h-48 relative">

          {/* Logo & Welcome Message */}
          <div className="flex items-center space-x-6 h-full">
            {/* 
                Logo Container: 
                - w-32 h-32 to md:w-48 md:h-48
             */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0">
              <Image
                src="/images/NPlusOne logo.svg"
                alt="NPlusOne Logo"
                fill
                className="object-contain" // object-contain to keep aspect ratio
                priority
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-12 w-[1px] bg-gray-700"></div>

            {/* Welcome Text */}
            <h1 className="hidden sm:block text-2xl md:text-4xl font-bold text-gray-200 tracking-wide">
              Welcome Admin
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}