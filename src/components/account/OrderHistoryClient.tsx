"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

type OrderItem = {
    product_name: string;
    quantity: number;
    price_per_unit: number;
    selected_size?: string;
    selected_color?: string;
    products?: {
        image_url: string;
        title: string;
    } | null;
};

type Order = {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    payment_status: string;
    payment_method: string;
    order_items: OrderItem[];
};

interface Props {
    initialOrders: Order[];
}

const OrderHistoryClient: React.FC<Props> = ({ initialOrders }) => {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [timeFilter, setTimeFilter] = useState('ALL'); // '1M', '3M', '6M', 'Y', 'ALL'
    const [sortOrder, setSortOrder] = useState('NEWEST'); // 'NEWEST', 'OLDEST'

    // Tracking UI State
    const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null); // Which order is being tracked
    const [trackingInput, setTrackingInput] = useState('');
    const [trackingResult, setTrackingResult] = useState<string | null>(null);

    // --- Filtering & Sorting Logic ---
    const filteredOrders = useMemo(() => {
        let result = [...initialOrders];

        // 1. Search (Order ID or Product Name)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order =>
                order.id.toLowerCase().includes(query) ||
                order.order_items.some(item => item.product_name.toLowerCase().includes(query))
            );
        }

        // 2. Time Filter
        const now = new Date();
        if (timeFilter !== 'ALL') {
            result = result.filter(order => {
                const orderDate = new Date(order.created_at);
                const diffTime = Math.abs(now.getTime() - orderDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (timeFilter === '1M') return diffDays <= 30;
                if (timeFilter === '3M') return diffDays <= 90;
                if (timeFilter === '6M') return diffDays <= 180;
                if (timeFilter === 'THIS_YEAR') return orderDate.getFullYear() === now.getFullYear();
                return true;
            });
        }

        // 3. Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [initialOrders, searchQuery, timeFilter, sortOrder]);

    // --- Handlers ---
    const handleTrackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder Logic until API is available
        if (trackingInput.trim()) {
            setTrackingResult(`Status: In Transit (Simulated) - Location: Hub`);
        }
    };

    const openTracking = (orderId: string) => {
        setTrackingOrderId(orderId);
        setTrackingInput('');
        setTrackingResult(null);
    };

    return (
        <div className="space-y-8">
            {/* Controls Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Product Name..."
                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-silver outline-none text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:border-silver outline-none cursor-pointer"
                    >
                        <option value="ALL">All Time</option>
                        <option value="1M">Last 30 Days</option>
                        <option value="3M">Last 3 Months</option>
                        <option value="6M">Last 6 Months</option>
                        <option value="THIS_YEAR">This Year ({new Date().getFullYear()})</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:border-silver outline-none cursor-pointer"
                    >
                        <option value="NEWEST">Newest First</option>
                        <option value="OLDEST">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Results */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800 border-dashed">
                    <p className="text-gray-400">No orders found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setTimeFilter('ALL'); }}
                        className="text-silver hover:underline mt-2 text-sm"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all hover:border-gray-600">

                            {/* Order Header */}
                            <div className="bg-gray-800/50 p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-800">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-white">Order #{order.id.slice(0, 8)}</h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${order.status === 'DELIVERED' ? 'bg-green-900/40 text-green-400 border-green-900' :
                                                order.status === 'CANCELLED' ? 'bg-red-900/40 text-red-400 border-red-900' :
                                                    'bg-blue-900/40 text-blue-400 border-blue-900'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Total Amount</p>
                                    <p className="font-bold text-xl text-silver">₹{order.total_amount}</p>
                                </div>
                            </div>

                            {/* Order Body */}
                            <div className="p-6">
                                {/* Items */}
                                <div className="space-y-4 mb-6">
                                    {order.order_items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            {/* Image */}
                                            <div className="w-16 h-20 bg-gray-800 rounded overflow-hidden relative flex-shrink-0">
                                                <Image
                                                    src={item.products?.image_url || '/placeholder.png'}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            {/* Details */}
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium line-clamp-1">{item.product_name}</h4>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                                                    <span>Size: {item.selected_size || 'N/A'}</span>
                                                    {item.selected_color && <span>Color: {item.selected_color}</span>}
                                                    <span>Qty: {item.quantity}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 mt-1">₹{item.price_per_unit}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions Footer */}
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-800">

                                    <Link
                                        href={`/orders/${order.id}/invoice`}
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-700 text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Download Invoice
                                    </Link>

                                    <Link
                                        href={`/order-confirmation/${order.id}`} // Or a dedicated detail page if exists
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-700 text-white"
                                    >
                                        View Details
                                    </Link>

                                    {/* Tracking Button (Only for Active Orders) */}
                                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'RETURNED' && (
                                        <button
                                            onClick={() => openTracking(order.id)}
                                            className="ml-auto bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                        >
                                            Track Order
                                        </button>
                                    )}
                                </div>

                                {/* Tracking Expanded Panel */}
                                {trackingOrderId === order.id && (
                                    <div className="mt-6 bg-black p-4 rounded-lg border border-gray-700 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-sm font-bold text-silver uppercase tracking-wider">Track Shipment</h4>
                                            <button
                                                onClick={() => setTrackingOrderId(null)}
                                                className="text-gray-500 hover:text-white"
                                            >
                                                Close
                                            </button>
                                        </div>

                                        {!trackingResult ? (
                                            <form onSubmit={handleTrackSubmit} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter Tracking ID (received in email)"
                                                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-silver outline-none"
                                                    value={trackingInput}
                                                    onChange={(e) => setTrackingInput(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                                                >
                                                    Track
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="bg-gray-900 p-3 rounded border border-gray-800">
                                                <p className="text-green-400 text-sm font-medium mb-1">✓ Tracking ID Verified</p>
                                                <p className="text-white text-sm">{trackingResult}</p>
                                                <button
                                                    onClick={() => { setTrackingInput(''); setTrackingResult(null); }}
                                                    className="text-xs text-blue-400 hover:underline mt-2"
                                                >
                                                    Track another ID
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">
                                            Note: Tracking updates may take up to 24 hours to reflect after shipment.
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryClient;
