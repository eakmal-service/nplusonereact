import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions | NPlusOne Fashion",
    description: "Terms of use and service agreement for NPlusOne Fashion.",
};

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase tracking-wide">
                    Terms & Conditions
                </h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <p>
                            Welcome to NPLUSONE FASHION. By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by the following terms and conditions.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Checkout Policy Summary</h2>
                        <p className="mb-4">
                            By placing an order with NPLUSONE FASHION, you explicitly agree to the following:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You agree to our <strong>Returns & Refunds Policy</strong>.</li>
                            <li>Eligible items may be returned or exchanged within <strong>7 days</strong> of delivery.</li>
                            <li><strong>MADE TO ORDER</strong> designs are strictly not returnable unless defective.</li>
                            <li>The brand reserves the right to update or modify this policy without prior notice.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Product Accuracy</h2>
                        <p>
                            We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Modifications to Service</h2>
                        <p>
                            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
