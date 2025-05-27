import React from 'react'

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-custom-black text-white flex items-center justify-center">
      <div className="max-w-4xl w-full px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        <p className="mb-8">Please log in to view your account.</p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Back to Home
        </a>
      </div>
    </div>
  )
} 