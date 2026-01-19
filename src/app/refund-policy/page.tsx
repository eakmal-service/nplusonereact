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
                    Refund Policy
                </h1>

                <div className="space-y-8 text-gray-300">
                    <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-bold text-silver mb-3">Refunds</h2>
                        <p className="text-gray-400">
                            We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too. If more than 15 business days have passed since we’ve approved your return, please contact us at support@nplusonefashion.com/8329208323
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
