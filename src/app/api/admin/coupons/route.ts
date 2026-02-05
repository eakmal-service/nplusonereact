import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, coupons: data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Transform the payload to match DB schema
        const couponData = {
            code: body.code,
            type: body.type,
            value: body.value,
            min_order_value: body.min_order_amount, // Key mismatch fix
            max_discount_amount: body.max_discount_amount,
            start_date: body.start_date,
            end_date: body.end_date,
            usage_limit: body.usage_limit,
            per_user_limit: body.per_user_limit, // New column
            status: body.status || 'active',
            is_active: body.status === 'active'
        };

        const { data, error } = await supabaseAdmin
            .from('coupons')
            .insert([couponData])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, coupon: data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ success: false, message: 'ID and Status are required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('coupons')
            .update({ status })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Coupon ID is required' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('coupons')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
