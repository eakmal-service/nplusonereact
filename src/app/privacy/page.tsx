import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="bg-black min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300">
                <h1 className="text-3xl font-bold mb-8 text-silver border-b border-gray-800 pb-4">Privacy Policy</h1>
                <p className="mb-4 text-sm text-gray-500">Last Updated: Jan 2026</p>

                <div className="space-y-8">
                    <p>
                        At <strong className="text-gray-300">NPlusOne Fashion</strong> ("we," "us"), we value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, store, and share your data.
                    </p>

                    {/* 1. Information We Collect */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">1. Information We Collect</h2>
                        <p className="mb-2">We collect the following types of information to provide you with a seamless shopping experience:</p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li><strong className="text-gray-300">Personal Information:</strong> Name, Email Address, Phone Number, Shipping & Billing Address.</li>
                            <li><strong className="text-gray-300">Transactional Data:</strong> Order details, payment method (we do NOT store full card details).</li>
                            <li><strong className="text-gray-300">Technical Data:</strong> IP address, browser type, device information, and access times.</li>
                        </ul>
                    </section>

                    {/* 2. How We Use Your Data */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">2. How We Use Your Data</h2>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li>To process and fulfill your orders.</li>
                            <li>To communicate with you regarding updates, offers, and support.</li>
                            <li>To improve our website functionality and user experience.</li>
                            <li>To prevent fraud and ensure security.</li>
                        </ul>
                    </section>

                    {/* 3. Data Protection & Storage (PhonePe Requirement) */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">3. Data Protection & Storage</h2>
                        <p>
                            We implement industry-standard security measures (SSL Encryption) to protect your personal data from unauthorized access, alteration, or disclosure. Your data is stored on secure servers with restricted access.
                        </p>
                    </section>

                    {/* 4. Sharing with Third Parties (PhonePe Requirement) */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">4. Sharing of Information</h2>
                        <p className="mb-2">We do not sell your personal data. However, we share necessary information with trusted third parties to facilitate our services:</p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li><strong className="text-gray-300">Payment Gateways:</strong> (e.g., PhonePe, Razorpay) for secure payment processing.</li>
                            <li><strong className="text-gray-300">Logistics Partners:</strong> (e.g., iThinkLogistics, Shiprocket) to deliver your orders.</li>
                            <li><strong className="text-gray-300">Service Providers:</strong> For SMS/Email notifications and cloud hosting (e.g., Supabase).</li>
                        </ul>
                    </section>

                    {/* 5. Cookie Policy (PhonePe Requirement - Explicit Section) */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">5. Cookie Policy</h2>
                        <p className="mb-2">
                            Our website uses "cookies" to enhance your experience. Cookies are small files stored on your device.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li><strong className="text-gray-300">Essential Cookies:</strong> Required for the website to function (e.g., keeping items in your cart while you shop).</li>
                            <li><strong className="text-gray-300">Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                            <li><strong className="text-gray-300">Functionality Cookies:</strong> Remember your preferences (e.g., login details).</li>
                        </ul>
                        <p className="mt-2 text-sm text-gray-500">
                            You can choose to disable cookies through your browser settings, but this may affect your ability to use certain features of our site.
                        </p>
                    </section>

                    {/* 6. Contact Us */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide text-silver">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at: <br />
                            <strong className="text-gray-300">Email:</strong> support@nplusonefashion.com <br />
                            <strong className="text-gray-300">Address:</strong> NPlusOne Fashion Pvt Ltd, 123, Ring Road, Surat, Gujarat - 395002
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
