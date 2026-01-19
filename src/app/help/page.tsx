import React from 'react';
import Link from 'next/link';
import { QuestionMarkCircleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-silver">Help Center</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Support */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <QuestionMarkCircleIcon className="w-6 h-6 text-silver" />
                            Contact Support
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-800 p-3 rounded-lg">
                                    <EnvelopeIcon className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Email Us</h3>
                                    <p className="text-sm text-gray-400 mb-1">We'll get back to you within 24 hours</p>
                                    <a href="mailto:support@nplusonefashion.com" className="text-silver hover:underline">
                                        support@nplusonefashion.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-gray-800 p-3 rounded-lg">
                                    <PhoneIcon className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Call Us</h3>
                                    <p className="text-sm text-gray-400 mb-1">Mon - Sat, 10:30 AM - 7:00 PM</p>
                                    <a href="tel:+918329208323" className="text-silver hover:underline">
                                        +91 8329208323
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQs Preview */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                        <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-white mb-1">How can I track my order?</h3>
                                <p className="text-sm text-gray-400">Go to My Orders page and click on the specific order to see tracking details.</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-white mb-1">What is the return policy?</h3>
                                <p className="text-sm text-gray-400">We offer a 5-day return policy for unused items with original tags.</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-white mb-1">Do you ship internationally?</h3>
                                <p className="text-sm text-gray-400">Currently we only ship within India.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
