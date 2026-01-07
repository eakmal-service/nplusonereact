import React from 'react';
import Link from 'next/link';
import { MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function AddressesPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-silver">Saved Addresses</h1>
                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        <PlusIcon className="w-4 h-4" />
                        Add New
                    </button>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 flex flex-col items-center text-center">
                    <div className="bg-gray-800 p-4 rounded-full mb-6">
                        <MapPinIcon className="w-12 h-12 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No saved addresses</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        You haven't saved any shipping addresses yet. Add one now to speed up checkout.
                    </p>
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
