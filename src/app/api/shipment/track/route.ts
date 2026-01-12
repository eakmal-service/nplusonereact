
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { trackOrder } from '@/lib/logistics';

// Initialize Supabase Admin Client for logging
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    let awbNumbers: string[] = [];
    try {
        const body = await req.json();
        awbNumbers = body.awb_numbers || []; // Expecting array of strings

        if (!awbNumbers.length) {
            return NextResponse.json({ error: "AWB Numbers required" }, { status: 400 });
        }

        // Call Logistics API
        const result = await trackOrder(awbNumbers);
        const isSuccess = result?.data && Object.keys(result.data).length > 0;

        // Log Event
        await supabaseAdmin.from('system_logs').insert([{
            event_type: 'SHIPMENT_TRACKING',
            status: isSuccess ? 'SUCCESS' : 'FAILURE',
            message: isSuccess ? `Tracking fetched for ${awbNumbers.length} orders` : 'Tracking API Failed',
            request_data: { awb_numbers: awbNumbers },
            response_data: result,
            url: '/api/shipment/track',
            user_agent: req.headers.get('user-agent') || 'system'
        }]);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Track API Error:', error);

        // Log Exception
        await supabaseAdmin.from('system_logs').insert([{
            event_type: 'SHIPMENT_TRACKING',
            status: 'FAILURE',
            message: error.message || 'Exception in Track API',
            request_data: { awb_numbers: awbNumbers },
            response_data: { error: error.toString() },
            url: '/api/shipment/track',
            user_agent: req.headers.get('user-agent') || 'system'
        }]);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
