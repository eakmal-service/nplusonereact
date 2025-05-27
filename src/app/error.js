'use client'

import React from 'react'

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-custom-black text-white flex items-center justify-center flex-col p-4">
      <h2 className="text-2xl mb-4">Something went wrong!</h2>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
} 