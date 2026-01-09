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
                                    <p className="text-white">{profile?.phone || user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800 flex justify-end">
                        <button className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
