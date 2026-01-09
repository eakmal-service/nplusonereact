import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | NPlusOne Fashion",
    description: "Discover the story behind NPlusOne Fashion.",
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 uppercase tracking-wider">
                    About NPlusOne Fashion
                </h1>
                <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
                    Redefining style from the heart of India's textile hub.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-700 leading-relaxed">
                {/* Our Story */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-400">
                        {/* Placeholder for an image - using text for now */}
                        <span className="text-lg font-medium">Our Design Studio</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                        <p className="mb-4">
                            Born in <strong>Surat, Gujarat</strong>—the city known for its rich textile heritage—<strong>NPLUSONE FASHION</strong> was founded with a simple mission: to bring premium quality fashion to your doorstep without the premium price tag.
                        </p>
                        <p>
                            We understand that fashion is personal. It's not just about clothes; it's about expression. Our team works tirelessly to curate designs that are trendy, comfortable, and made to last.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                            <p>
                                To provide a seamless online shopping experience with a focus on quality fabrics, perfect fits, and customer satisfaction.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Promise</h3>
                            <p>
                                Authenticity in every thread. We source our materials directly from trusted manufacturers in Surat to ensure you get the best value.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose NPlusOne?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="p-4">
                            <div className="font-bold text-lg mb-2 text-black">Quality Assured</div>
                            <p className="text-sm text-gray-600">Strict quality checks on every piece before dispatch.</p>
                        </div>
                        <div className="p-4">
                            <div className="font-bold text-lg mb-2 text-black">Fast Shipping</div>
                            <p className="text-sm text-gray-600">Dispatched within 2-4 days from our Surat warehouse.</p>
                        </div>
                        <div className="p-4">
                            <div className="font-bold text-lg mb-2 text-black">Customer First</div>
                            <p className="text-sm text-gray-600">Dedicated support via phone and email.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
