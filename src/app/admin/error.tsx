'use client' // Error components must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Admin Dashboard Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
            <div className="bg-gray-900 p-6 rounded-lg border border-red-900 max-w-2xl w-full mb-6">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Error Details:</h3>
                <p className="font-mono text-sm text-gray-300 break-all bg-black p-4 rounded border border-gray-800">
                    {error.message || "Unknown error occurred"}
                </p>
                {error.stack && (
                    <details className="mt-4">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">View Stack Trace</summary>
                        <pre className="mt-2 p-4 bg-black rounded text-xs text-gray-400 overflow-auto max-h-60 border border-gray-800">
                            {error.stack}
                        </pre>
                    </details>
                )}
                {error.digest && (
                    <p className="mt-4 text-xs text-gray-500">Digest: {error.digest}</p>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}
