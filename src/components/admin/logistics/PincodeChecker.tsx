import React, { useState } from 'react';

export default function PincodeChecker() {
    const [pincode, setPincode] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkPincode = async () => {
        if (!pincode) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/admin/logistics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'checkPincode', data: { pincode } }),
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError('Failed to check pincode');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-silver">📍 Pincode Serviceability</h3>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter Pincode (e.g. 110001)"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={checkPincode}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-bold disabled:opacity-50"
                >
                    {loading ? 'Checking...' : 'Check'}
                </button>
            </div>

            {error && <p className="text-red-400 mt-4">{error}</p>}

            {result && (
                <div className="mt-4 p-4 bg-gray-900 rounded border border-gray-700">
                    <pre className="text-sm text-gray-300 overflow-auto max-w-full">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
