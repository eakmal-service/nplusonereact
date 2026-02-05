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

          {/* API Playground Link */}
          <div className="hidden md:flex items-center ml-auto mr-6">
            <a
              href="/admin/api-playground"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
                <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 12c0-1.66 4-3 9-3s9 1.34 9 3" />
              </svg>
              <span className="font-mono text-sm">API Playground</span>
            </a>
          </div>

          {/* Right Section: Notification & Profile */}
          <div className="flex items-center space-x-6">

            {/* Notification */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 group-hover:border-gray-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-gray-300">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}