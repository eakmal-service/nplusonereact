import React, { useState, useEffect } from 'react';
// Remove direct supabase client import
// import { supabase } from '@/lib/supabaseClient';

type Coupon = {
    id: string;
    code: string;
    type: 'percentage' | 'flat';
    value: number;
    min_order_amount: number;
    usage_limit: number | null;
    per_user_limit: number | null;
    start_date: string;
    end_date: string | null;
    status: 'active' | 'inactive' | 'expired';
    used_count: number;
};

const CouponsSection = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        min_order_amount: '',
        usage_limit: '',
        per_user_limit: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'active',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/coupons');

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server returned ${res.status}: ${text.substring(0, 100)}...`);
            }

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            setCoupons(data.coupons || []);
        } catch (err: any) {
            console.error('Error fetching coupons:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (!formData.code || !formData.value) {
                throw new Error('Code and Value are required.');
            }

            const newCoupon = {
                code: formData.code.toUpperCase(),
                type: formData.type,
                value: parseFloat(formData.value),
                min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
                usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
                per_user_limit: formData.per_user_limit ? parseInt(formData.per_user_limit) : null,
                start_date: formData.start_date || new Date().toISOString(),
                end_date: formData.end_date || null,
                status: formData.status,
            };

            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCoupon),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server error ${res.status}: ${text.substring(0, 100)}...`);
            }

            const result = await res.json();

            if (!result.success) throw new Error(result.message);

            setShowAddForm(false);
            setFormData({
                code: '',
                type: 'percentage',
                value: '',
                min_order_amount: '',
                usage_limit: '',
                per_user_limit: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                status: 'active',
            });
            fetchCoupons();
        } catch (err: any) {
            console.error('Error creating coupon:', err);
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const res = await fetch(`/api/admin/coupons?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server error ${res.status}: ${text}`);
            }

            const result = await res.json();

            if (!result.success) throw new Error(result.message);

            setCoupons(prev => prev.filter(c => c.id !== id));
        } catch (err: any) {
            console.error('Error deleting coupon:', err);
            alert('Failed to delete coupon: ' + err.message);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server error ${res.status}: ${text}`);
            }

            const result = await res.json();

            if (!result.success) throw new Error(result.message);

            setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        } catch (err: any) {
            console.error('Error updating status:', err);
            alert('Failed to update status: ' + err.message);
        }
    };

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-silver">Manage Coupons</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                >
                    {showAddForm ? 'Cancel' : 'Add New Coupon'}
                </button>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Coupon Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="e.g. SUMMER25"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Value</label>
                            <input
                                type="number"
                                name="value"
                                value={formData.value}
                                onChange={handleInputChange}
                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="e.g. 20"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Min Order Amount</label>
                            <input
                                type="number"
                                name="min_order_amount"
                                value={formData.min_order_amount}
                                onChange={handleInputChange}
                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="e.g. 500"
                                min="0"
                            />
                        </div>
                        <div>
                            {/* Usage Limits Section - Simplified */}
                            <div className="col-span-1 md:col-span-2 space-y-4 border-t border-gray-800 pt-4 mt-2">
                                <h3 className="text-sm font-semibold text-silver">Usage Limits</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Total Usage Limit */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Total Limit (How many coupons available?)</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="usage_limit_type"
                                                    checked={!formData.usage_limit}
                                                    onChange={() => setFormData(prev => ({ ...prev, usage_limit: '' }))}
                                                    className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                                />
                                                <span className="text-white text-sm">Unlimited</span>
                                            </label>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="usage_limit_type"
                                                    checked={!!formData.usage_limit}
                                                    onChange={() => setFormData(prev => ({ ...prev, usage_limit: '100' }))} // Default start value
                                                    className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                                />
                                                <span className="text-white text-sm">Limit total uses</span>
                                            </label>
                                        </div>
                                        {formData.usage_limit !== '' && (
                                            <input
                                                type="number"
                                                name="usage_limit"
                                                value={formData.usage_limit}
                                                onChange={handleInputChange}
                                                className="mt-2 w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                                placeholder="Enter max number of uses"
                                                min="1"
                                            />
                                        )}
                                    </div>

                                    {/* Per User Limit */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Usage per Customer</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="per_user_limit_option"
                                                    checked={formData.per_user_limit === '1'}
                                                    onChange={() => setFormData(prev => ({ ...prev, per_user_limit: '1' }))}
                                                    className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                                />
                                                <span className="text-white text-sm">Once per user (Recommended)</span>
                                            </label>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="per_user_limit_option"
                                                    checked={formData.per_user_limit === ''}
                                                    onChange={() => setFormData(prev => ({ ...prev, per_user_limit: '' }))}
                                                    className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                                />
                                                <span className="text-white text-sm">Unlimited uses per user</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium transition"
                        >
                            Create Coupon
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading coupons...</div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-10 bg-gray-900 rounded border border-gray-800 text-gray-400">
                    No coupons found. Create one to get started!
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Validity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-white">{coupon.code}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">
                                            {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                                        </div>
                                        {coupon.min_order_amount > 0 && (
                                            <div className="text-xs text-gray-500">Min: ₹{coupon.min_order_amount}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{coupon.used_count} used</div>
                                        <div className="text-xs text-gray-500">
                                            Limit: {coupon.usage_limit || '∞'} (User: {coupon.per_user_limit || '∞'})
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">
                                            {new Date(coupon.start_date).toLocaleDateString()}
                                        </div>
                                        {coupon.end_date && (
                                            <div className="text-xs text-gray-500">to {new Date(coupon.end_date).toLocaleDateString()}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleStatus(coupon.id, coupon.status)}
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${coupon.status === 'active'
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                        >
                                            {coupon.status.toUpperCase()}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CouponsSection;
