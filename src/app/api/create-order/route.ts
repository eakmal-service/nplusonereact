import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customer, items, total, status } = body;

        // 1. Create Order
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([
                {
                    customer_name: customer.name,
                    customer_email: customer.email,
                    shipping_address: customer,
                    total_amount: total,
                    status: 'Pending', // Initial status
                    // New Tracking Fields
                    payment_info: {
                        method: 'COD', // Defaulting to COD for now as per previous flow, or pass from body
                        status: 'pending'
                    },
                    courier_info: {
                        name: 'Not Assigned',
                        tracking_number: null,
                        tracking_url: null
                    },
                    tracking_events: [
                        {
                            status: "placed",
                            label: "Order Placed",
                            message: "Your order has been placed successfully",
                            location: "Online Store",
                            timestamp: new Date().toISOString(),
                            source: "system"
                        }
                    ],
                    order_date: new Date().toISOString()
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
            product_id: item.product.id?.toString(),
            product_title: item.product.title,
            quantity: item.quantity,
            price: parseFloat(item.product.salePrice?.replace(/[^0-9.]/g, '') || item.product.price?.replace(/[^0-9.]/g, '') || '0'),
            size: item.size,
            image_url: item.product.image || item.product.imageUrl
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Error creating order items:', itemsError);
            // Ensure we probably should delete the order if items fail, but for now just error
            return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
        }

        return NextResponse.json({ success: true, orderId });

    } catch (err) {
        console.error('Create Order Handler Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
