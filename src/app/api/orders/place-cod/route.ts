import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createShipment } from '@/lib/logistics';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customer, items, total } = body;

        // Try to get authenticated user (Optional for Guest Checkout support)
        let userId = null;
        try {
            const cookieStore = cookies();
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        get(name: string) {
                            return cookieStore.get(name)?.value
                        },
                    },
                }
            );
            const { data: { session } } = await supabase.auth.getSession();
            if (session) userId = session.user.id;
        } catch (authErr) {
            // Context might be static or other issue, ignore auth failure for guest checkout flow
            // But we prioritize guest flow continuing.
            console.warn("Auth check failed in COD route (continuing as guest):", authErr);
        }

        // 1. Create Order (Status: PROCESSING, Payment: PENDING, Method: COD)
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([
                {
                    user_id: userId, // Link to user if logged in
                    total_amount: total,
                    subtotal: total,
                    tax_total: 0,
                    shipping_cost: 0,
                    status: 'PROCESSING', // Confirmed immediately
                    payment_status: 'PENDING',
                    payment_method: 'COD',
                    shipping_address: {
                        fullName: customer.name,
                        email: customer.email,
                        phoneNumber: customer.phoneNumber,
                        ...customer
                    }
                }
            ])
            .select()
            .single();

        if (orderError) throw new Error(`Order Creation Failed: ${orderError.message}`);

        const orderId = orderData.id;

        // 2. Insert Order Items
        const orderItems = items.map((item: any) => ({
            order_id: orderId,
            product_id: item.product.id,
            product_name: item.product.title,
            quantity: item.quantity,
            price_per_unit: item.product.salePrice || item.product.price,
            selected_size: item.size,
            selected_color: item.color || null,
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw new Error(`Order Items Creation Failed: ${itemsError.message}`);

        // 3. Update Inventory (Decrement Stock)
        for (const item of orderItems) {
            if (item.product_id) {
                const { data: currentProduct } = await supabaseAdmin
                    .from('products')
                    .select('stock_quantity')
                    .eq('id', item.product_id)
                    .single();

                if (currentProduct && currentProduct.stock_quantity !== null) {
                    const newStock = Math.max(0, currentProduct.stock_quantity - item.quantity);
                    await supabaseAdmin
                        .from('products')
                        .update({ stock_quantity: newStock })
                        .eq('id', item.product_id);
                }
            }
        }

        // 4. Create Shipment
        try {
            // Reconstruct full order object for logistics
            const fullOrder = { ...orderData, items: orderItems };
            console.log("Creating COD Shipment for Order:", orderId);

            const shippingResult = await createShipment(fullOrder, 'COD');

            if (shippingResult && shippingResult.status === 'success') {
                let awb = 'PENDING';
                let courier = 'iThinkLogistics';
                let logisticOrderId = '';

                // iThink response structure analysis based on user snippet: 
                // data: { "1": { waybill: ..., ord_id: ... } } OR data: [{...}]?
                // User snippet: shippingResult.data?.[1]

                if (shippingResult.data) {
                    const values = Object.values(shippingResult.data) as any[];
                    if (values.length > 0) {
                        const shipmentData = values[0];
                        if (shipmentData.waybill) awb = shipmentData.waybill;
                        if (shipmentData.ord_id) logisticOrderId = shipmentData.ord_id;
                    }
                }

                await supabaseAdmin
                    .from('orders')
                    .update({
                        awb_number: awb,
                        courier_name: courier,
                        logistic_order_id: logisticOrderId,
                        status: 'SHIPPED'
                    })
                    .eq('id', orderId);
            }
        } catch (shipError) {
            console.error("COD Shipment Error:", shipError);
            // Continue -> Don't fail the order just because shipping API hiccuped
        }

        // 5. Send Confirmation Email
        try {
            // Need to dynamically import to ensure it works in API context
            const { sendOrderConfirmationEmail } = await import('@/lib/email');

            // Adjust customer details format if needed
            const customerDetails = {
                email: customer.email,
                name: customer.name,
                ...customer
            };

            await sendOrderConfirmationEmail(orderData, customerDetails, orderItems);
        } catch (emailError) {
            console.error("Email Sending Error:", emailError);
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error: any) {
        console.error("Place COD Order Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
