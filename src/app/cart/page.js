import React from 'react'

export default function CartPage() {
  return (
    <div className="min-h-screen bg-custom-black text-white flex items-center justify-center">
      <div className="max-w-4xl w-full px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <p className="mb-8">Your cart is empty.</p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Back to Home
        </a>
      </div>
    </div>
  )
} 