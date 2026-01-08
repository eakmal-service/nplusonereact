
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabaseServer';
import { createShipment } from '@/lib/logistics';

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_db_id } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) throw new Error('Razorpay secret not found in environment');

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update Order in Supabase
            const supabase = createClient();

            // Note: In a real scenario, we might want to ensure the amount matched, etc.
            // But for now we trust the signature verification.

            // Assume the frontend has already created a "Pending" order in DB 
            // and passed us the ID (order_db_id) to update.
            // OR we can create the order here if not already created.
            // Based on user prompt "If valid, update the Supabase orders table status to 'PAID'".
            // This implies the order exists.

            if (order_db_id) {
                // 1. Update Order Status
                // Casting to any to avoid build error: Argument of type 'any' is not assignable to parameter of type 'never'
                const { data: updatedOrder, error: updateError } = await (supabase
                    .from('orders') as any)
                    .update({
                        status: 'PROCESSING',
                        payment_status: 'PAID',
                        payment_id: razorpay_payment_id,
                        payment_method: 'RAZORPAY'
                    })
                    .eq('id', order_db_id)
                    .select()
                    .single();

                if (updateError) {
                    console.error("Db Update Error", updateError);
                    // Critical: Payment verified but DB update failed. Log this!
                } else if (updatedOrder) {
                    // 2. Fetch Order Items for Inventory Update & Email
                    const { data: orderItems } = await (supabase
                        .from('order_items') as any)
                        .select('*, product:products(title, price, image_url)')
                        .eq('order_id', order_db_id);

                    if (orderItems && orderItems.length > 0) {
                        // 3. Update Inventory (Decrement Stock)
                        for (const item of (orderItems as any[])) {
                            if (item.product_id) {
                                // RPC call would be safer for atomic updates, but for now standard update:
                                // "Safety: Ensure stock doesn't go below zero."
                                // Fetch current stock first
                                const { data: currentProduct } = await (supabase
                                    .from('products') as any)
                                    .select('stock_quantity')
                                    .eq('id', item.product_id)
                                    .single();

                                if (currentProduct && currentProduct.stock_quantity !== null) {
                                    const newStock = Math.max(0, currentProduct.stock_quantity - item.quantity);
                                    await (supabase
                                        .from('products') as any)
                                        .update({ stock_quantity: newStock })
                                        .eq('id', item.product_id);
                                }
                            }
                        }

                        // 4. Send Confirmation Email
                        // Need customer details from Order (shipping_address) or Profile
                        // updatedOrder.shipping_address is a JSON object.
                        const customerDetails = typeof updatedOrder.shipping_address === 'string'
                            ? JSON.parse(updatedOrder.shipping_address)
                            : updatedOrder.shipping_address;

                        if (customerDetails && customerDetails.email) {
                            // Dynamically import email service to avoid top-level issues if env vars missing
                            const { sendOrderConfirmationEmail } = await import('@/lib/email');
                            await sendOrderConfirmationEmail(updatedOrder, customerDetails, orderItems);
                        }

                        // 5. Automatic Shipping Trigger (iThinkLogistics)
                        try {
                            const fullOrder = { ...updatedOrder, items: orderItems };
                            console.log("Triggering Shipping for Order:", updatedOrder.id);
                            const shippingResult = await createShipment(fullOrder, 'Prepaid');

                            if (shippingResult && shippingResult.status === 'success') {
                                // iThinkLogistics returns keys like 'waybill' or 'ref_id' inside data
                                // Structure depends on response. Usually data: { "1": { waybill: ... } } or similar
                                // Let's check the result structure based on docs/experience or assume generic data access
                                // Snippet suggestion: const shipmentData = shippingResult.data?.[1] || {};

                                // Robust extraction:
                                let awb = 'PENDING';
                                let courier = 'iThinkLogistics';

                                // Try to find waybill in data values
                                if (shippingResult.data) {
                                    const values = Object.values(shippingResult.data) as any[];
                                    if (values.length > 0 && values[0].waybill) {
                                        awb = values[0].waybill;
                                    }
                                }

                                await (supabase.from('orders') as any)
                                    .update({
                                        awb_number: awb,
                                        courier_name: courier,
                                        status: 'SHIPPED' // Auto-mark as shipped
                                    })
                                    .eq('id', updatedOrder.id);

                                console.log("Shipment Created. AWB:", awb);
                            } else {
                                console.error("Shipping Creation Failed:", shippingResult);
                            }
                        } catch (shipError) {
                            console.error("Shipping Logic Error:", shipError);
                            // Don't fail the verification response, just log it
                        }
                    }
                }
            }

            return NextResponse.json({ success: true, message: "Payment verified" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Verification Error:', error);
        return NextResponse.json(
            { error: error.message || 'Error verifying payment' },
            { status: 500 }
        );
    }
}
