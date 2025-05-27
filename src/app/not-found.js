import React from 'react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-custom-black text-white p-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <h1 className="text-2xl mb-6">Page Not Found</h1>
        <p className="mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md inline-block">
          Return Home
        </a>
      </div>
    </div>
  )
} 