import { NextResponse } from 'next/server';
import { StandardCheckoutClient, Env } from 'pg-sdk-node';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createShipment } from '@/lib/logistics';

// Initialize Config
const CLIENT_ID = process.env.PHONEPE_CLIENT_ID || 'NO_CLIENT_ID_CONFIGURED';
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || 'NO_CLIENT_SECRET_CONFIGURED';
const CLIENT_VERSION = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
const ENV = (process.env.PHONEPE_ENV === 'PRODUCTION') ? Env.PRODUCTION : Env.SANDBOX;

// Re-use logic for GET requests (redirects)
export async function GET(req: Request) {
    return POST(req);
}

export async function POST(req: Request) {
    try {
        console.log("Received PhonePe Callback/Redirect");

        let body: any = {};
        const contentType = req.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            body = await req.json();
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            body = Object.fromEntries(formData.entries());
        } else {
            // Check query params if body parsing fails or for GET requests
            const { searchParams } = new URL(req.url);
            body = Object.fromEntries(searchParams.entries());
        }

        const { code, merchantId, transactionId, amount, providerReferenceId } = body;

        console.log("Callback Body/Params:", JSON.stringify(body));

        const frontendRedirect = process.env.NEXT_PUBLIC_APP_URL || 'https://nplusonefashion.com';
        let targetUrl = `${frontendRedirect}/order-confirmation/${transactionId || 'error'}`;

        // Optimistic handling: If code is success, we try to update DB and redirect.
        if (code === 'PAYMENT_SUCCESS') {
            try {
                // Determine orderId from transactionId (since we used orderId as merchantOrderId)
                const orderId = transactionId;

                // Verify status using SDK check-status to be safe
                const client = StandardCheckoutClient.getInstance(CLIENT_ID, CLIENT_SECRET, CLIENT_VERSION, ENV);
                const statusRes = await client.getOrderStatus(orderId);

                if (statusRes.state === 'COMPLETED') {
                    console.log(`✅ Payment COMPLETED for Order ${orderId}. Starting Sync...`);

                    // 1. Fetch Full Order Details (with items)
                    const { data: orderData, error: dbError } = await supabaseAdmin
                        .from('orders')
                        .select(`*, order_items(*)`)
                        .eq('id', orderId)
                        .single();

                    if (dbError || !orderData) {
                        console.error("❌ Failed to fetch order for sync:", dbError);
                    } else {
                        // 2. Prepare Order Object for Logistics (flatten items structure if needed)
                        // Supabase join returns items as 'order_items' property.
                        // logistics.ts expects 'items' or uses defaults. 
                        // Let's normalize it to match what logistics expects (it looks for order.items).
                        const fullOrder = {
                            ...orderData,
                            items: orderData.order_items
                        };

                        // 3. Trigger Logistics Sync
                        let trackingId = null;
                        let carrierName = null;
                        let syncStatus = 'PENDING';

                        try {
                            console.log(`📦 Triggering iThinkLogistics (Prepaid) for ${orderId}`);
                            const shippingResult = await createShipment(fullOrder, 'Prepaid');

                            if (shippingResult && shippingResult.status === 'success') {
                                syncStatus = 'SUCCESS';

                                if (shippingResult.data) {
                                    const values = Object.values(shippingResult.data) as any[];
                                    if (values.length > 0) {
                                        trackingId = values[0].waybill;
                                        carrierName = 'iThinkLogistics';
                                    }
                                }
                                console.log(`🚀 Logistics Sync Success! AWB: ${trackingId}`);
                            } else {
                                syncStatus = 'FAILURE';
                                console.error("❌ Logistics Sync Failed:", JSON.stringify(shippingResult));
                            }

                            // 4. Log the Hook Event
                            await supabaseAdmin.from('system_logs').insert([{
                                event_type: 'ORDER_HOOK',
                                status: syncStatus,
                                message: syncStatus === 'SUCCESS' ? `Prepaid Shipment Created: ${trackingId}` : 'Prepaid Shipment API Failed',
                                request_data: { orderId, paymentMethod: 'Prepaid' },
                                response_data: shippingResult,
                                user_id: orderData.user_id
                            }]);

                        } catch (syncErr) {
                            console.error("❌ Logistics Sync Exception:", syncErr);
                        }

                        // 5. Update Order Status
                        const updateData: any = {
                            status: 'PROCESSING',
                            payment_status: 'PAID'
                        };

                        if (trackingId) {
                            updateData.tracking_id = trackingId;
                            updateData.carrier = carrierName;
                            updateData.status = 'SHIPPED'; // Auto-move to SHIPPED if AWB is generated?
                        }

                        await supabaseAdmin
                            .from('orders')
                            .update(updateData)
                            .eq('id', orderId);
                    }
                }
            } catch (err) {
                console.error("Quick Status Check Failed in Callback:", err);
            }

            // Redirect
            return NextResponse.redirect(targetUrl, 303);

        } else {
            console.log("Payment Not Success:", code);
            targetUrl = `${frontendRedirect}/cart?error=payment_failed`;
            return NextResponse.redirect(targetUrl, 303);
        }

    } catch (error) {
        console.error("PhonePe Callback Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'https://nplusonefashion.com'}/cart?error=server_error`, 303);
    }
}
