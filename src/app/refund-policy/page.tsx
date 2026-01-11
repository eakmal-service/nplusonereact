import type { Metadata } from "next";
import { Link } from "lucide-react";
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
                    Refund and Cancellation policy
                </h1>

                <div className="space-y-8 text-gray-300">
                    <p className="text-gray-400 text-center mb-8">
                        This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform.
                    </p>

                    {/* Cancellation Policy */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <XSquare className="w-8 h-8 text-silver flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">1. Cancellation Policy</h2>
                                <p className="text-gray-400 mb-2">
                                    Under this policy:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                    <li>Cancellations will only be considered if the request is made within 7 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.</li>
                                    <li>NPlusOne Fashion does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Damaged or Defective Items */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">2. Damaged or Defective Items</h2>
                                <p className="text-gray-400">
                                    In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 7 days of receipt of products.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Product Mismatch */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <RefreshCw className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">3. Product Mismatch</h2>
                                <p className="text-gray-400">
                                    In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Warranty */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">4. Manufacturer Warranty</h2>
                                <p className="text-gray-400">
                                    In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Refunds */}
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <DollarSign className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">5. Refunds</h2>
                                <p className="text-gray-400">
                                    In case of any refunds approved by NPlusOne Fashion, it will take 10 days for the refund to be processed to you.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
