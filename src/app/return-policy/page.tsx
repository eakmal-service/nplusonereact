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
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">Return Policy</h2>
                        <p className="text-gray-400">
                            We have a 5-day return policy, which means you have 5 days after receiving your item to request a return.
                            Once the return product is received it will be inspected and the return will be approved within 2 days.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
