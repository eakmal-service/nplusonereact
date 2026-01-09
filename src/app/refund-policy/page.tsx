import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy | NPlusOne Fashion",
    description: "Read our policies regarding returns, refunds, and cancellations.",
};

export default function RefundPolicyPage() {
    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-stone">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase tracking-wide">
                    Return, Refund & Order Policy
                </h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <p className="font-medium text-lg">
                            At NPLUSONE FASHION, we aim to offer a smooth and transparent shopping experience to our customers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Returns & Exchanges</h2>
                        <p>
                            Returns or exchanges can be requested within <strong>7 days of delivery</strong>. Products must be unused,
                            unwashed, unworn, and returned with original tags and packaging intact. Size exchanges are
                            allowed, subject to availability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Eligible Cases</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Size or fitting issues</li>
                            <li>Damaged or defective products</li>
                            <li>Incorrect item received</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Non-Returnable Items</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Made-to-order or customized products</li>
                            <li>Sale or clearance items (unless damaged or incorrect)</li>
                            <li>Products showing signs of use, washing, or alteration</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Return Process</h2>
                        <p>
                            Return or exchange requests must be raised through the registered email or customer support.
                            Reverse pickup will be arranged where serviceable. A nominal reverse shipping fee may be
                            deducted, if applicable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Refunds</h2>
                        <p>
                            Refunds are initiated only after inspection and approval and are processed within <strong>7–10 working days</strong>.
                            Prepaid order refunds are credited to the original payment source. COD refunds are
                            processed via bank transfer or store credit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Cancellation</h2>
                        <p>
                            Orders can be cancelled within <strong>12 hours of placement</strong>. Orders once dispatched cannot be
                            cancelled or modified.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
