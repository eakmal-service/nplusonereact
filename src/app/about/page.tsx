import type { Metadata } from "next";

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
                    Premium style, accessible to everyone.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-300 leading-relaxed">
                {/* Introduction */}
                <section>
                    <p className="mb-4">
                        NPLUSONE FASHION is a contemporary fashion brand built on the belief that premium style should be accessible. We create thoughtfully designed apparel that blends refined design, dependable quality, and everyday comfort.
                    </p>
                    <p className="mb-4">
                        Our approach to fashion is balanced and intentional. Each piece is designed to feel elevated while remaining practical and wearable. By focusing on clean silhouettes, quality fabrics, and careful finishing, we deliver fashion that reflects both style and value.
                    </p>
                    <p>
                        At NPLUSONE FASHION, we believe great design lies in simplicity, consistency, and attention to detail. Our collections are created for individuals who appreciate modern fashion with a premium feel and long-term relevance.
                    </p>
                </section>

                {/* Mission & Vision */}
                <section className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-silver mb-3">Our Mission</h3>
                            <p className="mb-4">
                                Our mission is to deliver premium-looking, well-crafted fashion at accessible prices. We focus on thoughtful design, quality materials, and efficient processes to ensure our customers receive clothing that offers both style and value.
                            </p>
                            <p>
                                We aim to make premium fashion practical, wearable, and dependable — without compromising on comfort or quality.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-silver mb-3">Our Vision</h3>
                            <p className="mb-4">
                                Our vision is to establish NPLUSONE FASHION as a trusted fashion brand known for affordable premium design.
                            </p>
                            <p>
                                We strive to make refined fashion more accessible, maintain high standards in quality and finish, build long-term trust through honest pricing and consistency, and grow as a modern Indian brand with a global design mindset.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Legal Disclosure */}
                <section className="text-center border-t border-gray-800 pt-8 mt-12">
                    <h3 className="text-lg font-bold text-silver mb-2">Legal Disclosure</h3>
                    <p className="text-gray-400">
                        NPLUSONE FASHION is owned and operated by Mohammad Rashid Mohammad Shafique (Sole Proprietor).
                    </p>
                </section>
            </div>
        </div>
    );
}
