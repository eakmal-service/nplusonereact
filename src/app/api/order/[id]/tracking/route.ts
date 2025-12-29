import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const orderId = params.id;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Determine current status
        // The DB "status" column might be "Pending", "Processing", etc.
        // We need to map it to the tracking status keys: placed, confirmed, packed, shipped, out_for_delivery, delivered

        // Logic to build the timeline based on tracking_events
        // We define the standard flow
        const standardFlow = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

        const events = order.tracking_events || [];
        const latestEvent = events.length > 0 ? events[events.length - 1] : null;
        const currentStatus = latestEvent ? latestEvent.status : 'placed';

        // Build the timeline array with "completed" flags
        // Find index of current status in standard flow
        let currentIndex = standardFlow.indexOf(currentStatus);
        if (currentIndex === -1) currentIndex = 0; // Default if unknown

        const timeline = standardFlow.map((step, index) => ({
            status: step,
            completed: index <= currentIndex
        }));

        // Construct the Final Merged JSON
        const response = {
            order_id: order.id, // Using DB UUID or custom ID if you have one
            current_status: currentStatus,
            estimated_delivery: order.estimated_delivery || "Calculating...",
            timeline: timeline,
            // Including detailed tracking for UI if needed, though strictly user asked for the specific JSON structure above as "Customer ko ye dikhega"
            // But for a tracking page, we often want the detailed events too. 
            // I will stick to the requested 4 structure exactly for the "response" but maybe create a separate endpoint for details?
            // Actually, usually the tracking page IS this JSON. 
            // But the user showed "4. FINAL MERGED TRACKING JSON" separately. 
            // I will add the detailed events as `tracking_events` just in case, or stick to the requested simple timeline.
            // User said "Customer ko ye dikhega" pointing to section 4.
            // I'll return exactly that structure. 
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Tracking API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
