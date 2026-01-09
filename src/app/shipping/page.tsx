import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping Policy | NPlusOne Fashion",
    description: "Learn about our shipping timelines and costs.",
};

export default function ShippingPolicyPage() {
    return (
        <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-silver mb-8 text-center uppercase tracking-wide">
                    Shipping Policy
                </h1>

                <div className="space-y-8 text-gray-300">

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">1. Shipping Locations</h2>
                        <p>
                            We currently ship to all major cities and towns across India. We use trusted courier partners to ensure safe delivery.
                        </p>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">2. Shipping Charges</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Prepaid Orders:</strong> Free shipping on all prepaid orders.</li>
                            <li><strong>Cash on Delivery (COD):</strong> A flat fee of ₹50 may apply on COD orders, depending on the order value.</li>
                        </ul>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">3. Delivery Timeline</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Dispatch:</strong> Orders are usually dispatched within 24-48 hours of placement.</li>
                            <li><strong>Delivery:</strong> Standard delivery time is 2-5 working days, depending on your location.</li>
                            <li><strong>Remote Areas:</strong> Delivery to remote locations may take slightly longer (5-7 days).</li>
                        </ul>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">4. Tracking Your Order</h2>
                        <p>
                            Once your order is shipped, you will receive a tracking link via SMS/Email. You can use this link to track the live status of your package.
                        </p>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">5. Delays</h2>
                        <p>
                            While we strive to deliver on time, unforeseen circumstances (weather, strikes, courier delays) may cause delays. We appreciate your patience in such cases.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
