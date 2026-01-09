import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | NPlusOne Fashion",
    description: "Read how we handle your data.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-silver mb-8 text-center uppercase tracking-wide">
                    Privacy Policy
                </h1>

                <div className="space-y-8 text-gray-300">
                    <p className="text-gray-400">
                        Your privacy is important to us. This policy outlines how NPlusOne Fashion collects, uses, and protects your information.
                    </p>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">1. Information We Collect</h2>
                        <p>
                            When you place an order or sign up, we collect personal details such as:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Name</li>
                            <li>Email Address</li>
                            <li>Phone Number</li>
                            <li>Shipping Address</li>
                        </ul>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To process and deliver your orders.</li>
                            <li>To send order updates and tracking information.</li>
                            <li>To improve our website and customer service.</li>
                            <li>To send promotional emails (only if you opt-in).</li>
                        </ul>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">3. Data Protection</h2>
                        <p>
                            We implement security measures to maintain the safety of your personal information. We do not sell, trade, or transfer your data to outside parties, except for trusted third parties who assist us in operating our website (e.g., courier partners, payment gateways), so long as those parties agree to keep this information confidential.
                        </p>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">4. Cookies</h2>
                        <p>
                            Our website uses cookies to enhance your browsing experience. You can choose to turn off cookies through your browser settings, but some features of the site may not function properly.
                        </p>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions regarding this privacy policy, you may contact us at: <a href="mailto:support@nplusonefashion.com" className="text-silver hover:underline">support@nplusonefashion.com</a>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
