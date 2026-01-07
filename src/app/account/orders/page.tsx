
import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import OrderHistoryClient from '@/components/account/OrderHistoryClient'; // Import Client Component

export const revalidate = 0; // Ensure dynamic data on every load

import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

async function getOrders() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/account/orders');
    }

    // Fetch Orders with Items and Product Images
    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                products (
                    title,
                    image_url
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }

    return orders || [];
}

export default async function OrderHistoryPage() {
    const orders = await getOrders();

    if (!orders || orders.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-3xl font-bold mb-8 text-silver">Order History</h1>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 flex flex-col items-center">
                        <div className="bg-gray-800 p-4 rounded-full mb-6">
                            <ShoppingBagIcon className="w-12 h-12 text-gray-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Looks like you haven't placed any orders yet. Start exploring our collection to find something you love.
                        </p>
                        <Link
                            href="/"
                            className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-silver">Your Orders</h1>

                {/* Client Component handles Search, Sort, Filter, and Tracking UI */}
                <OrderHistoryClient initialOrders={orders as any} />

                <div className="mt-12 text-center">
                    <Link href="/account" className="text-gray-500 hover:text-white transition-colors text-sm">
                        &larr; Back to Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
