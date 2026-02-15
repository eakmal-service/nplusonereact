import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createShipment } from '@/lib/logistics';

// Helper to parse price (handles both string and number)
const parsePrice = (price: string | number | undefined): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price.replace(/[^0-9.]/g, ''));
    return 0;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customer, items, total, status, paymentMethod } = body;

        const method = paymentMethod || 'COD'; // Default to COD if not specified

        // --- NEW: Get User Session ---
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;
        // -----------------------------

        // 1. Create Order
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([
                {
                    user_id: userId, // Now linking to user!
                    total_amount: total,
                    subtotal: total, // Simplified for now, or calculate from items/tax
                    tax_total: 0, // Placeholder or passed from frontend
                    shipping_cost: 0, // Placeholder
                    status: 'PENDING',
                    payment_status: status === 'paid' ? 'PAID' : 'PENDING',
                    payment_method: method,
                    shipping_address: {
                        fullName: customer.name,
                        email: customer.email,
                        ...customer
                    },
                    // Remove non-existent fields:
                    // customer_name, customer_email (inside shipping_address now)
                    // payment_info (use payment_status/method)
                    // courier_info, tracking_events (not in schema)
                }
            ])
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        const orderId = orderData.id;

        // 2. Create Order Items
        const orderItems = items.map((item: any) => ({
            order_id: orderId,
            product_id: item.product.id, // Ensure this is UUID
            product_name: item.product.title, // Schema: product_name
            quantity: item.quantity,
            price_per_unit: parsePrice(item.product.salePrice || item.product.price), // Schema: price_per_unit
            selected_size: item.size, // Schema: selected_size
            selected_color: item.color || null, // Schema: selected_color
            // image_url is NOT in default order_items schema provided in supabase_schema.sql?
            // "151: CREATE TABLE public.order_items (... 155: product_name TEXT NOT NULL ...)"
            // No image_url column in snippet.
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Error creating order items:', itemsError);
            // Ensure we probably should delete the order if items fail, but for now just error
            return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
        }

        if (method === 'COD') {
            try {
                // Construct full order object for logistics
                const fullOrder = {
                    ...orderData,
                    items: orderItems // Use the array we just inserted (has product_name, price_per_unit, etc.)
                };

                console.log("Triggering Shipping for COD Order:", orderId);
                const shippingResult = await createShipment(fullOrder, 'COD');

                if (shippingResult && shippingResult.status === 'success') {
                    // Robust extraction:
                    let awb = 'PENDING';
                    let courier = 'iThinkLogistics';

                    if (shippingResult.data) {
                        const values = Object.values(shippingResult.data) as any[];
                        if (values.length > 0 && values[0].waybill) {
                            awb = values[0].waybill;
                        }
                    }

                    await supabaseAdmin
                        .from('orders')
                        .update({
                            tracking_id: awb, // Schema has tracking_id, not awb_number
                            carrier: courier, // Schema has carrier, not courier_name
                            status: 'SHIPPED'
                        })
                        .eq('id', orderId);

                    console.log("COD Shipment Created. AWB:", awb);

                    // Log Success
                    await supabaseAdmin.from('system_logs').insert([{
                        event_type: 'ORDER_HOOK',
                        status: 'SUCCESS',
                        message: `COD Shipment Created: ${awb}`,
                        request_data: { orderId, paymentMethod: 'COD' },
                        response_data: shippingResult,
                        user_id: orderData.user_id // Might be null
                    }]);

                } else {
                    console.error("COD Shipping Creation Failed:", shippingResult);
                    // Log Failure
                    await supabaseAdmin.from('system_logs').insert([{
                        event_type: 'ORDER_HOOK',
                        status: 'FAILURE',
                        message: 'COD Shipping API Failed',
                        request_data: { orderId, paymentMethod: 'COD' },
                        response_data: shippingResult
                    }]);
                }

            } catch (shipError) {
                console.error("COD Shipping Logic Error:", shipError);
                // Non-blocking
            }
        }

        return NextResponse.json({ success: true, orderId });

    } catch (err) {
        console.error('Create Order Handler Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
