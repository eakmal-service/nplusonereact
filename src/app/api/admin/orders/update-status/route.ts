import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const { orderId, status, trackingEvent } = await req.json();

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Order ID and Status required' }, { status: 400 });
        }

        // 1. Get current tracking events
        const { data: order, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('tracking_events')
            .eq('id', orderId)
            .single();

        if (fetchError) throw fetchError;

        // 2. Append new event if provided
        let updatedEvents = order?.tracking_events || [];
        // Ensure it's an array (Supabase JSON/Array quirk)
        if (!Array.isArray(updatedEvents)) updatedEvents = [];

        if (trackingEvent) {
            updatedEvents.push(trackingEvent);
        }

        // 3. Update Order
        const { data, error } = await supabaseAdmin
            .from('orders')
            .update({
                status: status,
                tracking_events: updatedEvents,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error("Update Status API Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
