"use client";

import React from 'react';
import Link from 'next/link';

const OrderConfirmationPage = () => {
    return (
        <div className="bg-black min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-10 max-w-lg text-center shadow-2xl">
                <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-400 mb-8">
                    Thank you for your purchase. We have received your order and are preparing it for shipment.
                </p>

                <Link
                    href="/"
                    className="inline-block bg-silver hover:bg-gray-300 text-black font-bold py-3 px-8 rounded transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
