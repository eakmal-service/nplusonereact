'use client'

import React from 'react'

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-custom-black text-white flex items-center justify-center flex-col p-4">
        <h2 className="text-2xl mb-4">Something went wrong!</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  )
} 