import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping Policy | NPlusOne Fashion",
    description: "Learn about our shipping timelines and delivery process.",
};

export default function ShippingPolicyPage() {
    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase tracking-wide">
                    Shipping Policy
                </h1>

                <div className="space-y-6 text-gray-700 leading-relaxed border-l-4 border-black pl-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dispatch Timeline</h2>
                        <p>
                            Orders are dispatched within <strong>2–4 working days</strong> of placement. We ensure rigorous quality checks before packing your order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Delivery Timelines</h2>
                        <p>
                            Delivery timelines may vary based on your location and our courier partner's operations. Standard delivery across India typically takes 5-7 working days after dispatch.
                        </p>
                    </section>

                    <section>
                        <p className="italic text-sm text-gray-500 mt-6">
                            At NPLUSONE FASHION, we work with reliable logistics partners to ensure your fashion reaches you safely.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
