import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions | NPlusOne Fashion",
    description: "Read our terms and conditions of use.",
};

export default function TermsPage() {
    return (
        <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-silver mb-8 text-center uppercase tracking-wide">
                    Terms & Conditions
                </h1>

                <div className="space-y-8 text-gray-300">
                    <p className="text-gray-400">
                        Welcome to NPlusOne Fashion. By accessing or using our website, you agree to be bound by the following terms and conditions.
                    </p>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">1. General</h2>
                        <p>
                            NPlusOne Fashion is a registered entity operating from Surat, Gujarat. We reserve the right to update or modify these terms at any time without prior notice.
                        </p>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">2. Products & Pricing</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We make every effort to display product colors and details accurately. However, actual colors may vary slightly due to screen settings.</li>
                            <li>All prices are listed in Indian Rupees (INR) and are inclusive of GST.</li>
                            <li>We reserve the right to change prices without notice.</li>
                        </ul>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">3. Orders & Payments</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We accept payments via UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD).</li>
                            <li>We reserve the right to cancel any order if the product is out of stock or if we suspect fraudulent activity.</li>
                        </ul>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">4. Intellectual Property</h2>
                        <p>
                            All content on this website, including images, logos, text, and graphics, is the property of NPlusOne Fashion and is protected by copyright laws. You may not use our content without prior written permission.
                        </p>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">5. Governing Law</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Surat, Gujarat.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
