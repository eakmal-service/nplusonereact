
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Use Admin client for secure reads (if policies restrict) or Public if RLS allows

export async function POST(req: Request) {
    try {
        const { code, cartTotal } = await req.json();

        if (!code) {
            return NextResponse.json({ valid: false, message: 'Coupon code is required' }, { status: 400 });
        }

        // 1. Fetch Coupon
        const { data: coupon, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .eq('code', code)
            .single();

        if (error || !coupon) {
            return NextResponse.json({ valid: false, message: 'Invalid coupon code' }, { status: 200 });
        }

        // 2. Check Active Status & Expiry
        if (coupon.status !== 'active') {
            return NextResponse.json({ valid: false, message: 'This coupon is no longer active' }, { status: 200 });
        }

        const now = new Date();
        if (coupon.start_date && new Date(coupon.start_date) > now) {
            return NextResponse.json({ valid: false, message: 'This coupon is not yet active' }, { status: 200 });
        }
        if (coupon.end_date && new Date(coupon.end_date) < now) {
            return NextResponse.json({ valid: false, message: 'This coupon has expired' }, { status: 200 });
        }

        // 3. Check Usage Limits
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return NextResponse.json({ valid: false, message: 'This coupon usage limit has been reached' }, { status: 200 });
        }

        // 4. Check Amount Constraints
        if (cartTotal < (coupon.min_order_value || 0)) {
            return NextResponse.json({
                valid: false,
                message: `Minimum order of ₹${coupon.min_order_value} required`
            }, { status: 200 });
        }

        // 5. Calculate Discount
        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (cartTotal * coupon.discount_value) / 100;
            if (coupon.max_discount_value && discountAmount > coupon.max_discount_value) {
                discountAmount = coupon.max_discount_value;
            }
        } else if (coupon.discount_type === 'fixed') {
            discountAmount = coupon.discount_value;
        }

        // Ensure discount doesn't exceed total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        return NextResponse.json({
            valid: true,
            discountAmount: Math.round(discountAmount), // Round to nearest integer standard
            message: 'Coupon applied successfully!',
            code: coupon.code,
            type: coupon.discount_type
        });

    } catch (error) {
        console.error('Coupon validation error:', error);
        return NextResponse.json({ valid: false, message: 'Server error validating coupon' }, { status: 500 });
    }
}
