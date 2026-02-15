import { NextResponse } from 'next/server';
import { trackOrder } from '@/lib/logistics';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { awb } = body;

        if (!awb) {
            return NextResponse.json({ error: 'Missing AWB number' }, { status: 400 });
        }

        // Call Logistics API
        // trackOrder expects an array of strings
        // It returns the API response directly
        const trackingData = await trackOrder([awb]);

        if (!trackingData) {
            return NextResponse.json({ error: 'Failed to fetch tracking info' }, { status: 500 });
        }

        return NextResponse.json(trackingData);

    } catch (error: any) {
        console.error("Tracking API Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
