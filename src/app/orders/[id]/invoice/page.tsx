"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import InvoiceTemplate from '@/components/invoice/InvoiceTemplate';
import Link from 'next/link';

export default function InvoicePage() {
    const { id } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Force print styles
    const printStyles = `
      @media print {
        @page { margin: 0; }
        body { background-color: white !important; -webkit-print-color-adjust: exact; }
        nav, footer, .header, .sidebar { display: none !important; } /* Hide potential global elements */
        * { visibility: hidden; }
        .invoice-container, .invoice-container * { visibility: visible; }
        .invoice-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
      }
    `;

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push(`/auth/login?next=/orders/${id}/invoice`);
                    return;
                }

                // 1. Fetch Order
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (orderError || !orderData) throw new Error('Order not found');

                // Check permission (User owns order OR User is admin)
                // If your RLS is strict, the select above would fail empty if not allowed, 
                // but explicit check is good if RLS allows public read but you want to restrict invoice.
                // Assuming RLS handles it.

                setOrder(orderData);

                // 2. Fetch Items
                const { data: itemsData, error: itemsError } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', id);

                if (itemsError) throw itemsError;
                setItems(itemsData || []);

                // 3. Fetch User Profile (for Bill To name if needed, though Order has shipping address)
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', orderData.user_id)
                    .single();

                setUserProfile(profileData);

            } catch (err: any) {
                console.error('Error fetching invoice:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInvoiceData();
        }
    }, [id, router]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Invoice...</div>;
    if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-600">Error: {error}</div>;
    if (!order) return null;

    return (
        <div className="min-h-screen bg-black pt-24 pb-10 print:bg-white print:p-0">
            <style>{printStyles}</style>

            <div className="invoice-container bg-white max-w-4xl mx-auto print:max-w-none print:w-full">
                <InvoiceTemplate order={order} items={items} user={userProfile} />
            </div>

            {/* Controls (Bottom) */}
            <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center px-4 print:hidden gap-4">
                <Link href={`/account/orders`} className="text-gray-400 hover:text-white hover:underline transition-colors">
                    &larr; Back to Order History
                </Link>
                <button
                    onClick={() => window.print()}
                    className="bg-white text-black px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition-colors font-bold flex items-center gap-2 text-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Download Invoice / Print
                </button>
            </div>
        </div>
    );
}
