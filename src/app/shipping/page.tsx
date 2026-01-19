import React from 'react';

export default function ShippingPolicy() {
    return (
        <div className="bg-black min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300">
                <h1 className="text-3xl font-bold mb-8 text-silver border-b border-gray-800 pb-4">Shipping Policy</h1>
                <p className="mb-4 text-sm text-gray-500">Last Updated: Jan 2026</p>

                <div className="space-y-8">
                    {/* Processing Time */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">Processing Time</h2>
                        <p className="text-gray-400">
                            All orders are delivered within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in the shipment of your order, we will contact you via email or phone.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
