import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createShipment } from '@/lib/logistics';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customer, items, total } = body;

        // 1. Create Order (Status: PROCESSING, Payment: PENDING, Method: COD)
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([
                {
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

                if (shippingResult.data) {
                    const values = Object.values(shippingResult.data) as any[];
                    if (values.length > 0 && values[0].waybill) {
                        awb = values[0].waybill;
                    }
                }

                await supabaseAdmin
                    .from('orders')
                    .update({
                        awb_number: awb,
                        courier_name: courier,
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
