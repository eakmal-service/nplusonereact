
import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import { ShoppingBagIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const revalidate = 0; // Ensure dynamic data on every load

import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

async function getOrders(): Promise<Order[]> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/account/orders');
    }

    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
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

    if (orders.length === 0) {
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

                <div className="space-y-4">
                    {orders.map((order) => {
                        const date = new Date(order.created_at || '').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });

                        // Determine badge color
                        let statusColor = 'bg-gray-800 text-gray-400 border-gray-700';
                        if (order.status === 'PROCESSING' || order.payment_status === 'PAID') {
                            statusColor = 'bg-blue-900/40 text-blue-400 border-blue-900';
                        }
                        if (order.status === 'DELIVERED') {
                            statusColor = 'bg-green-900/40 text-green-400 border-green-900';
                        }
                        if (order.status === 'PENDING' && order.payment_status !== 'PAID') {
                            statusColor = 'bg-yellow-900/40 text-yellow-400 border-yellow-900';
                        }

                        return (
                            <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 transition-colors hover:border-gray-700">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-lg font-semibold text-white">Order #{order.id.slice(0, 8)}</h2>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${statusColor}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">Placed on {date}</p>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                                            <p className="font-bold text-silver">₹{order.total_amount}</p>
                                        </div>

                                        <Link
                                            href={`/order-confirmation/${order.id}`}
                                            className="flex items-center gap-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            View Details
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/account" className="text-gray-500 hover:text-white transition-colors text-sm">
                        &larr; Back to Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
