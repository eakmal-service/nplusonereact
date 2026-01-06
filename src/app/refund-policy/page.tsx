import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RefundPolicyPage = () => {
    return (
        <div className="bg-black min-h-screen text-silver font-sans">
            <Header />
            <div className="pt-28 pb-16 container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase tracking-wide">Return, Refund & Order Policy</h1>

                <div className="bg-gray-900 p-8 rounded-lg shadow-lg space-y-8 text-gray-300 leading-relaxed">

                    <section>
                        <p className="border-l-4 border-silver pl-4 italic">
                            At NPLUSONE FASHION, we aim to offer a smooth and transparent shopping experience to our customers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-silver mb-3 uppercase">Returns & Exchanges</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Returns or exchanges can be requested within <strong>7 days of delivery</strong>.</li>
                            <li>Products must be unused, unwashed, unworn, and returned with original tags and packaging intact.</li>
                            <li>Size exchanges are allowed, subject to availability.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-silver mb-3 uppercase">Eligible Cases</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Size or fitting issues</li>
                            <li>Damaged or defective products</li>
                            <li>Incorrect item received</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-silver mb-3 uppercase">Non-Returnable Items</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Made-to-order or customized products</li>
                            <li>Sale or clearance items (unless damaged or incorrect)</li>
                            <li>Products showing signs of use, washing, or alteration</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-silver mb-3 uppercase">Return Process</h2>
                        <p>
                            Return or exchange requests must be raised through the registered email or customer support.
                            Reverse pickup will be arranged where serviceable. A nominal reverse shipping fee may be deducted, if applicable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-silver mb-3 uppercase">Refunds</h2>
                        <p>
                            Refunds are initiated only after inspection and approval and are processed within <strong>7–10 working days</strong>.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Prepaid order refunds</strong> are credited to the original payment source.</li>
                            <li><strong>COD refunds</strong> are processed via bank transfer or store credit.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-silver mb-3 uppercase">Cancellation</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Orders can be cancelled within <strong>12 hours of placement</strong>.</li>
                            <li>Orders once dispatched cannot be cancelled or modified.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-silver mb-3 uppercase">Shipping</h2>
                        <p>
                            Orders are dispatched within <strong>2–4 working days</strong>. Delivery timelines may vary based on location and courier partner operations.
                        </p>
                    </section>

                    <section className="bg-black p-4 rounded border border-gray-700 mt-8">
                        <p className="text-sm text-gray-400 text-center">
                            By placing an order with NPLUSONE FASHION, you agree to this policy. The brand reserves the right to update or modify this policy without prior notice.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RefundPolicyPage;
