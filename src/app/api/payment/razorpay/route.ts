
import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import shortid from 'shortid';

export async function POST(req: Request) {
    try {
        const { amount, currency = 'INR', receipt } = await req.json();

        const options = {
            amount: Math.round(amount * 100), // Razorpay accepts amount in paise
            currency,
            receipt: receipt || shortid.generate(),
            payment_capture: 1, // Auto capture
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        });

    } catch (error: any) {
        console.error('Razorpay Error:', error);
        return NextResponse.json(
            { error: error.message || 'Error creating Razorpay order' },
            { status: 500 }
        );
    }
}
