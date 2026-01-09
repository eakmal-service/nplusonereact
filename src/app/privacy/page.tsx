import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | NPlusOne Fashion",
    description: "How we collect and protect your data at NPlusOne Fashion.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase tracking-wide">
                    Privacy Policy
                </h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <p className="text-sm text-gray-500">Last Updated: January 2025</p>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                        <p>
                            NPLUSONE FASHION is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and billing address.</li>
                            <li><strong>Payment Information:</strong> Payment details are processed securely by our payment partners (Razorpay/UPI). We do not store your credit/debit card details on our servers.</li>
                            <li><strong>Order History:</strong> Details of the products you purchase and your interactions with our customer support.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Process and fulfill your orders.</li>
                            <li>Communicate with you regarding order updates, shipping, and returns.</li>
                            <li>Improve our website functionality and customer service.</li>
                            <li>Send promotional emails (only if you have opted in).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Sharing of Information</h2>
                        <p>
                            We do not sell or trade your personal information. We may share data with trusted third parties solely for the purpose of operations, such as:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Logistics Partners:</strong> To deliver your products (e.g., Delhivery, Shiprocket).</li>
                            <li><strong>Payment Gateways:</strong> To process secure transactions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
                        <p>
                            Our website uses cookies to enhance your browsing experience, remember your cart items, and analyze site traffic. You can choose to disable cookies through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at our registered support email.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
