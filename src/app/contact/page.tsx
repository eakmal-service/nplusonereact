import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react"; // Ensure lucide-react is installed

export const metadata: Metadata = {
    title: "Contact Us | NPlusOne Fashion",
    description: "Get in touch with NPlusOne Fashion for support and queries.",
};

export default function ContactPage() {
    return (
        <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-silver mb-8 text-center uppercase tracking-wide">
                    Contact Us
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information Section */}
                    <div className="space-y-8">
                        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                            <h2 className="text-2xl font-semibold text-silver mb-6">Get in Touch</h2>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-6 h-6 text-silver mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-silver">Registered Office</h3>
                                        <p className="text-gray-400 mt-1">
                                            First Floor, Plot No. 17,<br />
                                            Hariichcha Ind Co-Op Hou Soc Ltd,<br />
                                            Opp Patco Ceramic Road No. 24,<br />
                                            Udhana Magdalla Road, SURAT,<br />
                                            GUJARAT, IN, 394210
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start space-x-4">
                                    <Mail className="w-6 h-6 text-silver mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-silver">Email Support</h3>
                                        <a href="mailto:support@nplusonefashion.com" className="text-gray-400 hover:text-white mt-1 block">
                                            support@nplusonefashion.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start space-x-4">
                                    <Phone className="w-6 h-6 text-silver mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-silver">Customer Care</h3>
                                        <a href="tel:+918329208323" className="text-gray-400 hover:text-white mt-1 block">
                                            +91 8329208323
                                        </a>
                                    </div>
                                </div>

                                {/* GST Info */}
                                <div className="pt-6 border-t border-gray-800 mt-6">
                                    <p className="text-sm text-gray-500">
                                        <strong>GSTIN:</strong> 24JMPPS6289M1ZQ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Contact Form (UI Only for Verification) */}
                    <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-sm">
                        <h2 className="text-2xl font-semibold text-silver mb-6">Send a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full rounded-md border border-gray-700 bg-black text-silver px-3 py-2 shadow-sm focus:border-silver focus:outline-none focus:ring-1 focus:ring-silver placeholder-gray-600"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 block w-full rounded-md border border-gray-700 bg-black text-silver px-3 py-2 shadow-sm focus:border-silver focus:outline-none focus:ring-1 focus:ring-silver placeholder-gray-600"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-gray-700 bg-black text-silver px-3 py-2 shadow-sm focus:border-silver focus:outline-none focus:ring-1 focus:ring-silver placeholder-gray-600"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-silver hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
