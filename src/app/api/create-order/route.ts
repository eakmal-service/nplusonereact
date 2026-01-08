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

        // 1. Create Order
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([
                {
                    // user_id: Should ideally be passed if logged in. For now, guest orders might have null user_id?
                    // But schema has user_id REFERENCES profiles. If guest, maybe null is allowed?
                    // Schema: user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
                    // It IS nullable.

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

                    // Update Order with AWB
                    await supabaseAdmin
                        .from('orders')
                        .update({
                            awb_number: awb,
                            courier_name: courier,
                            status: 'SHIPPED' // Auto-mark as shipped for COD? Or just processing?
                            // Usually for COD, "Shipped" means label generated.
                        })
                        .eq('id', orderId);

                    console.log("COD Shipment Created. AWB:", awb);
                } else {
                    console.error("COD Shipping Creation Failed:", shippingResult);
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
