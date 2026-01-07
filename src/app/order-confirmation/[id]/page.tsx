
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabaseServer';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

interface Props {
    params: { id: string };
}

// Security: Verify user can view this order
async function getOrder(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: order, error } = await (supabase
        .from('orders') as any)
        .select('*')
        .eq('id', id)
        .single();

    if (error || !order) return null;

    // Security Check
    if (order.user_id) {
        if (!user || user.id !== order.user_id) {
            // If order belongs to a user, but current session doesn't match => Unauthorized
            // However, allow if it's a freshly placed order? No, strict security requested.
            // "Ensure that the user can only view their own order"
            return 'unauthorized';
        }
    }
    // If order.user_id is null (Guest Checkout), anyone with the UUID link can view it (Standard Pattern)

    // Fetch Items
    const { data: items } = await (supabase
        .from('order_items') as any)
        .select(`
            product_name, 
            quantity, 
            price_per_unit, 
            selected_size, 
            selected_color, 
            products (
                image_url
            )
        `)
        .eq('order_id', id);

    return { order, items: items || [], user };
}

export default async function OrderConfirmationPage({ params }: Props) {
    const data = await getOrder(params.id);

    if (!data) return notFound();
    if (data === 'unauthorized') {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Unauthorized Access</h1>
                <p className="text-gray-400">You do not have permission to view this order details.</p>
                <Link href="/" className="mt-6 text-blue-400 hover:text-blue-300">
                    Return Home
                </Link>
            </div>
        );
    }

    // TypeScript now knows data is { order, items, user }
    const { order, items } = data;

    // Parse Shipping Address
    const shippingAddress = typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;

    // Estimated Delivery Text
    const deliveryText = "Estimated Delivery within 7 days";

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 rounded-full"></div>
                        <CheckCircleIcon className="w-24 h-24 text-green-500 relative z-10" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-xl text-gray-400">
                        Thank you for your purchase. Your order has been received.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Order ID: <span className="font-mono text-gray-300">{order.id}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Order Details */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Status Card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4 text-silver">Order Status</h2>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Payment Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.payment_status === 'PAID' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                                    }`}>
                                    {order.payment_method?.toLowerCase() === 'cod' ? 'COD' : (order.payment_status?.toUpperCase() || 'PENDING')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Estimated Delivery</span>
                                <span className="text-white font-medium">{deliveryText}</span>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-6 text-silver">Items Ordered</h2>
                            <div className="space-y-6">
                                {items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-20 h-24 bg-gray-800 rounded overflow-hidden relative flex-shrink-0">
                                            <Image
                                                src={item.products?.image_url || '/placeholder.png'}
                                                alt={item.product_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-white line-clamp-2">{item.product_name}</h3>
                                            <div className="text-sm text-gray-400 mt-1 space-y-1">
                                                <p>Size: {item.selected_size}</p>
                                                {item.selected_color && <p>Color: {item.selected_color}</p>}
                                                <p>Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-silver mt-2">₹{item.price_per_unit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Address & Actions */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4 text-silver">Shipping To</h2>
                            <div className="text-gray-400 text-sm space-y-1">
                                <p className="text-white font-medium text-base mb-2">{shippingAddress?.name}</p>
                                <p>{shippingAddress?.address}</p>
                                <p>{shippingAddress?.city}, {shippingAddress?.zip}</p>
                                <p>{shippingAddress?.email}</p>
                                <p>{shippingAddress?.contact || ''}</p>
                            </div>
                        </div>

                        {/* Order Total */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-2 text-gray-400">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            {order.discount_total > 0 && (
                                <div className="flex justify-between items-center mb-2 text-green-500">
                                    <span>Discount</span>
                                    <span>-₹{order.discount_total}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-800 mt-4 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total Paid</span>
                                <span className="text-lg font-bold text-white">₹{order.total_amount}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Link
                                href={`/orders/${order.id}/invoice`}
                                target="_blank"
                                className="block w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 text-center py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                                Download Invoice
                            </Link>
                            <Link href="/account/orders" className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center py-3 rounded-lg font-medium transition-colors">
                                Track My Orders
                            </Link>
                            <Link href="/" className="block w-full bg-white hover:bg-gray-200 text-black text-center py-3 rounded-lg font-bold transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
