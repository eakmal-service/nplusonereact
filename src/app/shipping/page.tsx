import React from 'react';

export default function ShippingPolicy() {
    return (
        <div className="bg-black min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300">
                <h1 className="text-3xl font-bold mb-8 text-silver border-b border-gray-800 pb-4">Shipping & Delivery Policy</h1>
                <p className="mb-4 text-sm text-gray-500">Last Updated: Jan 2026</p>

                <div className="space-y-8">

                    {/* 1. Shipping Methods & Costs */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">1. Shipping Methods & Costs</h2>
                        <p className="mb-2">
                            We offer standard shipping across India through our trusted logistics partners.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li><strong className="text-gray-300">Shipping Charges:</strong> Shipping costs are calculated during checkout based on the total weight of the package, dimensions, and the destination pin code.</li>
                            <li><strong className="text-gray-300">Free Shipping:</strong> We may offer free shipping on orders above a certain value (e.g., ₹999), which will be clearly indicated at the time of checkout.</li>
                            <li><strong className="text-gray-300">COD Charges:</strong> Cash on Delivery (COD) orders may attract a nominal handling fee, which will be displayed before you confirm the order.</li>
                        </ul>
                    </section>

                    {/* 2. Estimated Delivery Times */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">2. Delivery Timelines</h2>
                        <p className="mb-2">
                            We strive to deliver your order as quickly as possible.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li><strong className="text-gray-300">Dispatch Time:</strong> Orders are processed and dispatched within <strong className="text-gray-300">1-2 business days</strong> of order confirmation.</li>
                            <li><strong className="text-gray-300">Delivery Time:</strong> Once dispatched, standard delivery typically takes <strong className="text-gray-300">3 to 7 business days</strong> depending on your location.</li>
                            <li><strong className="text-gray-300">Metro Cities:</strong> 2-4 Days.</li>
                            <li><strong className="text-gray-300">Rest of India:</strong> 4-7 Days.</li>
                        </ul>
                    </section>

                    {/* 3. Factors Affecting Delivery (PhonePe Requirement) */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">3. Factors Affecting Delivery</h2>
                        <p className="mb-2">
                            While we ensure timely delivery, please note that delivery times are estimates and may be affected by factors beyond our control, including but not limited to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li>Public Holidays and Sundays.</li>
                            <li>Extreme weather conditions.</li>
                            <li>Strikes, political disruptions, or government restrictions.</li>
                            <li>Remote or hard-to-reach locations.</li>
                            <li>Courier partner delays.</li>
                        </ul>
                    </section>

                    {/* 4. Order Tracking (PhonePe Requirement) */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">4. Order Tracking</h2>
                        <p className="mb-2">
                            Once your order is shipped, you will receive a <strong className="text-gray-300">Tracking Link</strong> via Email and SMS.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li>You can track your order status in real-time on our courier partner’s website using the AWB number provided.</li>
                            <li>You can also visit the "My Orders" section on our website to view the latest status.</li>
                        </ul>
                    </section>

                    {/* 5. International Shipping */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">5. International Shipping</h2>
                        <p>
                            Currently, NPlusOne Fashion does not ship internationally. We only serve customers within India.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
