'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabaseClient';

export default function AccountPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        address_line1: '',
        city: '',
        pincode: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                setEditForm({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    phone_number: data.phone_number || '',
                    address_line1: data.address_line1 || '',
                    city: data.city || '',
                    pincode: data.pincode || ''
                });
            }
            setLoading(false);
        }

        if (user) fetchProfile();
    }, [user]);

    if (authLoading || loading) {
        return <div className="min-h-screen bg-black text-white pt-24 pb-12 flex justify-center items-center">Loading...</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-silver">Profile Settings</h1>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                    <div className="flex items-center gap-6 mb-8 border-b border-gray-800 pb-8">
                        <div className="bg-gray-800 p-4 rounded-full">
                            <UserIcon className="w-16 h-16 text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-white">
                                {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Fashion Enthusiast'}
                            </h2>
                            <p className="text-gray-400">Member since {new Date(user.created_at).getFullYear()}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Contact Info Block */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-silver">Contact Information</h3>

                            <div className="bg-black/50 p-4 rounded-lg flex items-center gap-4">
                                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Email Address</p>
                                    <p className="text-white">{user.email}</p>
                                </div>
                            </div>

                            <div className="bg-black/50 p-4 rounded-lg flex items-center gap-4">
                                <PhoneIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Phone Number</p>
                                    <p className="text-white">{profile?.phone_number || profile?.phone || user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Block */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-silver">Default Shipping Address</h3>

                            <div className="bg-black/50 p-4 rounded-lg">
                                {profile?.address_line1 ? (
                                    <div className="text-white space-y-1">
                                        <p>{profile.address_line1}</p>
                                        <p>{profile.city}{profile.pincode ? `, ${profile.pincode}` : ''}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No default address saved.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <h3 className="text-lg font-medium text-silver mb-4">Edit Profile</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 uppercase">First Name</label>
                                    <input
                                        type="text"
                                        value={editForm.first_name}
                                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white outline-none focus:border-silver"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 uppercase">Last Name</label>
                                    <input
                                        type="text"
                                        value={editForm.last_name}
                                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white outline-none focus:border-silver"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 uppercase">Phone Number</label>
                                    <input
                                        type="text"
                                        value={editForm.phone_number}
                                        onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white outline-none focus:border-silver"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs text-gray-500 mb-1 uppercase">Address Line 1</label>
                                    <input
                                        type="text"
                                        value={editForm.address_line1}
                                        onChange={(e) => setEditForm({ ...editForm, address_line1: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white outline-none focus:border-silver"
                                        placeholder="123 Fashion Street, Apt 4B"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 uppercase">City</label>
                                    <input
                                        type="text"
                                        value={editForm.city}
                                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white outline-none focus:border-silver"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 uppercase">Pincode</label>
                                    <input
                                        type="text"
                                        value={editForm.pincode}
                                        onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white outline-none focus:border-silver"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 rounded font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        setSaving(true);
                                        const { data, error } = await supabase
                                            .from('profiles')
                                            .upsert({ id: user.id, ...editForm })
                                            .select()
                                            .single();

                                        if (data && !error) {
                                            setProfile(data);
                                            setIsEditing(false);
                                        } else {
                                            console.error("Failed to update profile", error);
                                        }
                                        setSaving(false);
                                    }}
                                    disabled={saving}
                                    className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8 pt-8 border-t border-gray-800 flex justify-end">
                            <button onClick={() => setIsEditing(true)} className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
