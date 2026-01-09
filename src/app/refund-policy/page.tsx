import type { Metadata } from "next";
import { Link } from "lucide-react"; // Placeholder import, icons used inline below
import { RefreshCw, CheckCircle, XCircle, FileText, DollarSign, XSquare } from "lucide-react";

export const metadata: Metadata = {
    title: "Return & Refund Policy | NPlusOne Fashion",
    description: "Read our return and refund policy.",
};

export default function RefundPolicyPage() {
    return (
        <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-silver mb-8 text-center uppercase tracking-wide">
                    Return & Refund Policy
                </h1>

                <div className="space-y-8 text-gray-300">
                    <p className="text-gray-400 text-center mb-8">
                        At NPlusOne Fashion, we want you to love what you ordered. If something isn't right, let us know.
                    </p>

                    {/* Returns & Exchanges */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <RefreshCw className="w-8 h-8 text-silver flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">1. Returns & Exchanges</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>We accept returns/exchanges within <strong>7 days</strong> of delivery.</li>
                                    <li>The item must be unused, unwashed, and in its original condition with all tags intact.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Eligible Cases */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">2. Eligible Cases for Return</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Defective or damaged product received.</li>
                                    <li>Wrong size or product delivered.</li>
                                    <li>Quality issues (subject to verification).</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Non-Returnable */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">3. Non-Returnable Items</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Products purchased during clearace sales.</li>
                                    <li>Accessories and innerwear (for hygiene reasons).</li>
                                    <li>Items without original tags or packaging.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Return Process */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <FileText className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">4. How to Initiate a Return</h2>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Email us at <a href="mailto:support@nplusonefashion.com" className="text-silver hover:underline">support@nplusonefashion.com</a> or WhatsApp us at +91 8329208323 with your Order ID and images of the product.</li>
                                    <li>Our team will review your request within 24-48 hours.</li>
                                    <li>Once approved, we will arrange a reverse pickup (subject to pincode availability).</li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    {/* Refunds */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <DollarSign className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">5. Refunds</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Prepaid Orders:</strong> Refund will be credited to the original source within 5-7 working days after we receive the product.</li>
                                    <li><strong>COD Orders:</strong> Refund will be provided via bank transfer or UPI. You will need to provide your bank details.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Cancellation */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <XSquare className="w-8 h-8 text-gray-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">6. Cancellation Policy</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Orders can be cancelled before they are shipped.</li>
                                    <li>Once shipped, the order cannot be cancelled but can be returned after delivery.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
