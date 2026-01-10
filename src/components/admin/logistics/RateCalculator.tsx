import React, { useState } from 'react';

export default function RateCalculator() {
    const [formData, setFormData] = useState({
        from_pincode: '395007', // Default warehouse pin
        to_pincode: '',
        shipping_weight_kg: '0.5',
        product_mrp: '1000',
        payment_method: 'Prepaid',
        length: '10',
        width: '10',
        height: '10',
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const checkRate = async () => {
        if (!formData.to_pincode) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/admin/logistics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getRate', data: formData }),
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-silver">💰 Check Shipping Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input
                    placeholder="From Pin"
                    value={formData.from_pincode}
                    onChange={(e) => setFormData({ ...formData, from_pincode: e.target.value })}
                    className="bg-gray-900 border border-gray-700 rounded p-2 text-white"
                />
                <input
                    placeholder="To Pin"
                    value={formData.to_pincode}
                    onChange={(e) => setFormData({ ...formData, to_pincode: e.target.value })}
                    className="bg-gray-900 border border-gray-700 rounded p-2 text-white"
                />
                <input
                    placeholder="Weight (kg)"
                    value={formData.shipping_weight_kg}
                    onChange={(e) => setFormData({ ...formData, shipping_weight_kg: e.target.value })}
                    className="bg-gray-900 border border-gray-700 rounded p-2 text-white"
                />
                <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="bg-gray-900 border border-gray-700 rounded p-2 text-white"
                >
                    <option value="Prepaid">Prepaid</option>
                    <option value="COD">COD</option>
                </select>
            </div>
            <button
                onClick={checkRate}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-bold disabled:opacity-50"
            >
                {loading ? 'Calculating...' : 'Get Rates'}
            </button>

            {result && result.data && (
                <div className="mt-4 grid gap-2">
                    {Object.entries(result.data).map(([key, val]: any) => (
                        <div key={key} className="bg-gray-900 p-3 rounded flex justify-between border border-gray-700">
                            <span className="font-bold">{val.courier_name}</span>
                            <span className="text-green-400">₹{val.rate}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
