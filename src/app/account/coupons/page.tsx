import React from 'react';
import Link from 'next/link';
import { TicketIcon } from '@heroicons/react/24/outline';

export default function CouponsPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-silver">My Coupons</h1>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 flex flex-col items-center text-center">
                    <div className="bg-gray-800 p-4 rounded-full mb-6">
                        <TicketIcon className="w-12 h-12 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No active coupons</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        You don't have any active coupons at the moment. Keep an eye on our newsletter for special offers!
                    </p>
                    <Link
                        href="/"
                        className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-colors"
                    >
                        Continue Shopping
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
