import type { Metadata } from "next";
import { ShieldCheck, Truck, Headphones } from "lucide-react"; // Importing icons

export const metadata: Metadata = {
    title: "About Us | NPlusOne Fashion",
    description: "Discover the story behind NPlusOne Fashion.",
};

export default function AboutPage() {
    return (
        <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-silver mb-6 uppercase tracking-wider">
                    About NPlusOne Fashion
                </h1>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    Redefining style from the heart of India's textile hub.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-300 leading-relaxed">
                {/* Our Story */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="bg-gray-900 h-64 rounded-lg flex items-center justify-center text-gray-500 border border-gray-800">
                        {/* Placeholder for an image */}
                        <span className="text-lg font-medium">Our Design Studio</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-silver mb-4">Our Story</h2>
                        <p className="mb-4">
                            Born in <strong>Surat, Gujarat</strong>—the city known for its rich textile heritage—<strong>NPLUSONE FASHION</strong> was founded with a simple mission: to bring premium quality fashion to your doorstep without the premium price tag.
                        </p>
                        <p>
                            We understand that fashion is personal. It's not just about clothes; it's about expression. Our team works tirelessly to curate designs that are trendy, comfortable, and made to last.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-silver mb-3">Our Mission</h3>
                            <p>
                                To provide a seamless online shopping experience with a focus on quality fabrics, perfect fits, and customer satisfaction.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-silver mb-3">Our Promise</h3>
                            <p>
                                Authenticity in every thread. We are the manufacturer, not doing outsource of any products. We produce everything in-house to ensure you get the best value direct from the source.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us with Icons */}
                <section>
                    <h2 className="text-2xl font-bold text-silver mb-8 text-center">Why Choose NPlusOne?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">

                        <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-silver transition-colors">
                            <div className="flex justify-center mb-4">
                                <ShieldCheck className="w-10 h-10 text-silver" />
                            </div>
                            <div className="font-bold text-lg mb-2 text-white">Quality Assured</div>
                            <p className="text-sm text-gray-400">Strict quality checks on every piece before dispatch.</p>
                        </div>

                        <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-silver transition-colors">
                            <div className="flex justify-center mb-4">
                                <Truck className="w-10 h-10 text-silver" />
                            </div>
                            <div className="font-bold text-lg mb-2 text-white">Fast Shipping</div>
                            <p className="text-sm text-gray-400">Dispatched within 2-4 days from our Surat warehouse.</p>
                        </div>

                        <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-silver transition-colors">
                            <div className="flex justify-center mb-4">
                                <Headphones className="w-10 h-10 text-silver" />
                            </div>
                            <div className="font-bold text-lg mb-2 text-white">Customer First</div>
                            <p className="text-sm text-gray-400">Dedicated support via phone and email.</p>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}
