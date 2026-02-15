import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createShipment } from '@/lib/logistics';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customer, items, total } = body;

        // --- STRICT LOGIN POLICY ENFORCEMENT ---
        // 1. Verify Session
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

        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session || !session.user) {
            console.warn("COD Attempt blocked: User not logged in.");
            return NextResponse.json({ error: 'Unauthorized: Please login to place a COD order.' }, { status: 401 });
        }

        const userId = session.user.id;
        // ---------------------------------------

        // 2. Create Order (Status: PROCESSING, Payment: PENDING, Method: COD)
        // We now enforce user_id, so no more guest orders or null user_ids.
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([
                {
                    user_id: userId,
                    total_amount: total,
                    subtotal: total,
                    tax_total: 0,
                    shipping_cost: 0,
                    status: 'PENDING', // Default state for admin review
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

        // 3. Insert Order Items
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

        // 4. Update Inventory (Decrement Stock)
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

        // 5. RTO Risk Check & Shipment Creation
        try {
            const { validateOrderRisk } = await import('@/lib/rto-protection');
            const riskCheck = validateOrderRisk({
                phoneNumber: customer.phoneNumber,
                address: customer.address || customer.address1 || customer.addressLine1 || '',
                pincode: customer.pincode
            });

            if (!riskCheck.isSafe) {
                console.warn(`⚠️ RTO Risk Detected for Order ${orderId}: ${riskCheck.reason}`);

                // Move to ON_HOLD
                await supabaseAdmin
                    .from('orders')
                    .update({ status: 'ON_HOLD' })
                    .eq('id', orderId);

                // Log Risk
                await supabaseAdmin.from('system_logs').insert([{
                    event_type: 'RTO_RISK',
                    status: 'WARNING',
                    message: `Order put ON_HOLD. Reason: ${riskCheck.reason}`,
                    request_data: { orderId, reason: riskCheck.reason },
                    user_id: userId
                }]);

                // EXIT EARLY - DO NOT SHIP
                // Convert to "success" response so frontend shows success page, but backend held it.
                return NextResponse.json({ success: true, orderId, message: "Order placed successfully. Validation pending." });
            }

            // --- SAFE To Place (Manual Approval Mode) ---
            // We previously triggered shipment here. Now we SKIP it.
            // Admin must click "Accept" -> "Print Label" manually.

            console.log(`COD Order ${orderId} placed. Status: PENDING (Waiting for Admin)`);
            return NextResponse.json({ success: true, orderId });

        } catch (shipError) {
            console.error("COD Validation Error:", shipError);
            // Continue 
        }

        // 6. Send Confirmation Email
        try {
            // Need to dynamically import to ensure it works in API context
            const { sendOrderConfirmationEmail, sendAdminNewOrderEmail } = await import('@/lib/email');

            // Adjust customer details format if needed
            const customerDetails = {
                email: customer.email,
                name: customer.name,
                ...customer
            };


            await sendOrderConfirmationEmail(orderData, customerDetails, orderItems);

            // --- NEW: Send Admin Notification ---
            await sendAdminNewOrderEmail(orderData, customerDetails, orderItems);
            // ------------------------------------

        } catch (emailError) {
            console.error("Email Sending Error:", emailError);
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error: any) {
        console.error("Place COD Order Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
