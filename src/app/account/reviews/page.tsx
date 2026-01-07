import React from 'react';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/outline';

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-silver">My Reviews</h1>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 flex flex-col items-center text-center">
                    <div className="bg-gray-800 p-4 rounded-full mb-6">
                        <StarIcon className="w-12 h-12 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No reviews yet</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        You haven't submitted any reviews yet. Share your thoughts on your recent purchases to help other shoppers!
                    </p>
                    <Link
                        href="/account/orders"
                        className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-colors"
                    >
                        Review Purchases
                    </Link>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/account" className="text-gray-500 hover:text-white transition-colors text-sm">
                        &larr; Back to Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
