'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPinIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    is_default?: boolean;
}

export default function AddressesPage() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        is_default: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) fetchAddresses();
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAddresses(data || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (formData.is_default) {
                // Remove default from other addresses
                await supabase
                    .from('addresses')
                    .update({ is_default: false })
                    .eq('user_id', user?.id);
            }

            const { error } = await supabase
                .from('addresses')
                .insert([{
                    user_id: user?.id,
                    ...formData
                }]);

            if (error) throw error;

            toast.success('Address saved successfully');
            setFormData({
                name: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                is_default: false
            });
            setShowForm(false);
            fetchAddresses();
        } catch (error: any) {
            console.error('Error saving address:', error);
            toast.error(error.message || 'Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Address deleted');
            fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white pt-24 pb-12 flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-silver">Saved Addresses</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        {showForm ? 'Cancel' : 'Add New'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6 text-white">Add New Address</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                                <input
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-gray-400 text-sm mb-2">Address</label>
                                <input
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">City</label>
                                <input
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">State</label>
                                <input
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">ZIP Code</label>
                                <input
                                    name="zip"
                                    required
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-silver focus:ring-silver"
                                />
                                <label className="text-gray-400 text-sm">Set as default address</label>
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-silver hover:bg-gray-300 text-black font-bold px-8 py-3 rounded transition-colors"
                                >
                                    {saving ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {addresses.length === 0 && !showForm ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 flex flex-col items-center text-center">
                        <div className="bg-gray-800 p-4 rounded-full mb-6">
                            <MapPinIcon className="w-12 h-12 text-gray-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No saved addresses</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            You haven't saved any shipping addresses yet. Add one now to speed up checkout.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {addresses.map((addr) => (
                            <div key={addr.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative group">
                                {addr.is_default && (
                                    <span className="absolute top-4 right-4 bg-silver text-black text-xs font-bold px-2 py-1 rounded">
                                        Default
                                    </span>
                                )}
                                <h3 className="font-bold text-white mb-2">{addr.name}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {addr.address}<br />
                                    {addr.city}, {addr.state} {addr.zip}<br />
                                    Phone: {addr.phone}
                                </p>
                                <div className="flex justify-end pt-4 border-t border-gray-800">
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1"
                                    >
                                        <TrashIcon className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link href="/account" className="text-gray-500 hover:text-white transition-colors text-sm">
                        &larr; Back to Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

