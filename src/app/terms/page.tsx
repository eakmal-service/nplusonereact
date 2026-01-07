import React from 'react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-silver">Terms & Conditions</h1>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6 text-gray-300">
                    <p>
                        Welcome to NPlusOne Fashion. By using our website, you agree to comply with and be bound by the following terms and conditions of use.
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">1. General</h2>
                        <p>
                            The content of the pages of this website is for your general information and use only. It is subject to change without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">2. Products & Pricing</h2>
                        <p>
                            We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">3. Returns & Refunds</h2>
                        <p>
                            Please review our Refund Policy posted on the Site prior to making any purchases.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">4. User Account</h2>
                        <p>
                            If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
