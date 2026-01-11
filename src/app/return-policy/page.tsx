import type { Metadata } from "next";
import { Link } from "lucide-react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Return Policy | NPlusOne Fashion",
    description: "Read our return policy.",
};

export default function ReturnPolicyPage() {
    return (
        <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-silver mb-8 text-center uppercase tracking-wide">
                    Return Policy
                </h1>

                <div className="space-y-8 text-gray-300">
                    <p className="text-gray-400 text-center mb-8">
                        We offer refund / exchange within first 7 days from the date of your purchase. If 7 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind.
                    </p>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">1. Eligibility for Returns & Exchanges</h2>
                                <p className="text-gray-400 mb-2">
                                    In order to become eligible for a return or an exchange:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                    <li>The purchased item should be unused and in the same condition as you received it.</li>
                                    <li>The item must have original packaging.</li>
                                    <li>If the item that you purchased on a sale, then the item may not be eligible for a return / exchange.</li>
                                    <li>Only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">2. Exempt Goods</h2>
                                <p className="text-gray-400">
                                    You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified to you at the item of purchase.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex items-start space-x-4">
                            <RefreshCw className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-silver mb-3">3. Process</h2>
                                <p className="text-gray-400">
                                    For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further, if the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
