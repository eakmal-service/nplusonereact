import React from 'react';
import Link from 'next/link';
import { CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function CardsPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-silver">Saved Cards</h1>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 flex flex-col items-center text-center">
                    <div className="bg-gray-800 p-4 rounded-full mb-6">
                        <CreditCardIcon className="w-12 h-12 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No saved cards</h2>
                    <p className="text-gray-400 mb-6 max-w-md">
                        You don't have any saved payment methods.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 px-4 py-2 rounded-full border border-green-900/50">
                        <ShieldCheckIcon className="w-4 h-4" />
                        Your payment information is always secure
                    </div>
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
