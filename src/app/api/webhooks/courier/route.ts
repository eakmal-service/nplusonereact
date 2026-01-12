import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const courierData = await req.json();

        // Expected courierData format:
        // {
        //   "courier_name": "Delhivery",
        //   "tracking_number": "DLV123456789",
        //   "current_status": "out_for_delivery", 
        //   "events": [...]
        // }

        // We need to find the order associated with this tracking number.
        // For now, let's assume the request ALSO passes 'order_id' or we match by tracking_number if stored.
        // Since 'tracking_number' is initially null, we might need an initial link.
        // Or this webhook updates based on our internal Order ID if passed in the webhook metadata.
        // Let's assume the webhook url includes ?order_id=... or body has it.
        // User JSON didn't show order_id in courier response.
        // WE WILL ASSUME query param `?order_id=...` for mapping in this demo.

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('order_id');

        if (!orderId) {
            return NextResponse.json({ error: "Order ID required" }, { status: 400 });
        }

        // Fetch existing events
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('tracking_events, courier_info, user_id')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        let existingEvents = order.tracking_events || [];

        // Map Courier Events to Our TrackingEvents
        const newEvents = courierData.events.map((e: any) => ({
            status: e.status, // Ensure this matches our enum or map it
            label: e.status.replace(/_/g, ' ').toUpperCase(), // Simple label generation
            message: e.message,
            location: e.location,
            timestamp: e.timestamp,
            source: 'courier'
        }));

        // Merge events (avoid duplicates based on timestamp/message if possible, or just append)
        // For simplicity, we just append new ones
        const updatedEvents = [...existingEvents, ...newEvents];

        // Update DB
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                tracking_events: updatedEvents,
                courier_info: {
                    name: courierData.courier_name,
                    tracking_number: courierData.tracking_number,
                    tracking_url: null // or generate if pattern known
                },
                status: courierData.current_status // Sync main status
            })
            .eq('id', orderId);

        if (updateError) throw updateError;

        // Log Webhook Success
        await supabase
            .from('system_logs')
            .insert([{
                event_type: 'WEBHOOK_EVENT',
                status: 'SUCCESS',
                message: `Courier Webhook Processed: ${courierData.current_status}`,
                request_data: courierData,
                response_data: { success: true },
                user_id: order.user_id, // Link to user if possible
                url: req.url,
                user_agent: req.headers.get('user-agent') || 'webhook-sender'
            }]);

        return NextResponse.json({ success: true, message: "Tracking updated from courier" });

    } catch (error: any) {
        console.error('Courier Webhook Error:', error);

        // Try to log failure to DB (create new client if needed or reuse existing)
        try {
            await supabase.from('system_logs').insert([{
                event_type: 'WEBHOOK_EVENT',
                status: 'FAILURE',
                message: error.message || 'Webhook Processing Failed',
                request_data: {}, // Can't easily access body here if parsing failed, but strictly speaking we could try
                response_data: { error: error.toString() },
                url: req.url,
                user_agent: req.headers.get('user-agent') || 'webhook-sender'
            }]);
        } catch (logError) {
            console.error("Failed to log webhook error:", logError);
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
