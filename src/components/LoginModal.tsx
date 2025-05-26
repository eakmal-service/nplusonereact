"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the login/signup process
    console.log('Login with:', { email, rememberMe });
    // For now, just close the modal
    // onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white text-gray-800 max-w-md w-full rounded-lg shadow-xl animate-fade-in">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 relative">
              <Image
                src="/images/logo.svg"
                alt="NPlusOne Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-1">SIGN IN/ SIGN UP</h2>
          <p className="text-center text-gray-500 text-sm mb-8">via OTP</p>

          <form onSubmit={handleContinue}>
            {/* Email/Phone Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter mobile number or email"
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                We will use this to notify you for any updates & offers
              </p>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 border border-gray-300 rounded mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-gray-700 text-sm">
                Remember me
              </label>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 uppercase font-medium rounded hover:bg-gray-900 transition-colors"
            >
              CONTINUE
            </button>
          </form>

          {/* Password Link */}
          <div className="mt-6 text-center">
            <button className="text-black text-sm hover:underline">
              Sign in/ Sign up via Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 