import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createShipment } from '@/lib/logistics';

export async function POST(req: Request) {
    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
        }

        console.log(`🚛 Manual Shipment Generation Triggered for ${orderId}`);

        // 1. Fetch Order
        const { data: orderData, error: dbError } = await supabaseAdmin
            .from('orders')
            .select(`*, order_items(*)`)
            .eq('id', orderId)
            .single();

        if (dbError || !orderData) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 2. Prepare Data
        // Fix items structure mapping just like in other routes
        const fullOrder = {
            ...orderData,
            items: orderData.order_items
        };

        const paymentMethod = orderData.payment_method === 'COD' ? 'COD' : 'Prepaid';

        // 3. Call Logistics
        const shippingResult = await createShipment(fullOrder, paymentMethod);

        if (shippingResult && shippingResult.status === 'success') {
            let awb = 'PENDING';
            let carrier = 'iThinkLogistics';

            if (shippingResult.data) {
                const values = Object.values(shippingResult.data) as any[];
                if (values.length > 0) {
                    awb = values[0].waybill;
                }
            }

            // 4. Update Order (Status -> READY_TO_SHIP)
            await supabaseAdmin
                .from('orders')
                .update({
                    tracking_id: awb,
                    carrier: carrier,
                    status: 'READY_TO_SHIP',
                    tracking_events: [
                        ...(orderData.tracking_events || []),
                        {
                            status: 'ready_to_ship',
                            label: 'Label Generated',
                            message: `AWB Generated: ${awb}`,
                            timestamp: new Date().toISOString()
                        }
                    ]
                })
                .eq('id', orderId);

            return NextResponse.json({ success: true, awb, message: 'Shipment Created' });

        } else {
            console.error("Manual Shipment Failed:", shippingResult);
            return NextResponse.json({
                success: false,
                error: 'Logistics API Failed',
                details: shippingResult
            }, { status: 500 });
        }

    } catch (e: any) {
        console.error("Create Shipment API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
