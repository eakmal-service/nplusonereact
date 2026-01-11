import React from 'react';

export default function ShippingPolicy() {
    return (
        <div className="bg-black min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300">
                <h1 className="text-3xl font-bold mb-8 text-silver border-b border-gray-800 pb-4">Shipping Policy</h1>
                <p className="mb-4 text-sm text-gray-500">Last Updated: Jan 2026</p>

                <div className="space-y-8">

                    {/* 1. Shipping Methods & Costs */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">1. General Shipping Information</h2>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li>The orders for the user are shipped through registered domestic courier companies and/or speed post only.</li>
                            <li>Orders are shipped within 4 days from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms.</li>
                            <li>Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority.</li>
                            <li>Delivery of all orders will be made to the address provided by the buyer at the time of purchase.</li>
                            <li>Delivery of our services will be confirmed on your email ID as specified at the time of registration.</li>
                            <li>If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.</li>
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    );
}
