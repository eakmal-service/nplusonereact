
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cancelOrder } from '@/lib/logistics';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    let awbNumbers: string[] = [];
    try {
        const body = await req.json();
        awbNumbers = body.awb_numbers || [];

        if (!awbNumbers.length) {
            return NextResponse.json({ error: "AWB Numbers required" }, { status: 400 });
        }

        const result = await cancelOrder(awbNumbers);
        // iThink response usually has 'data' key with success info
        const isSuccess = result?.status === 'success' || (result?.data && Object.keys(result.data).length > 0);

        await supabaseAdmin.from('system_logs').insert([{
            event_type: 'SHIPMENT_CANCEL',
            status: isSuccess ? 'SUCCESS' : 'FAILURE',
            message: `Cancellation request for: ${awbNumbers.join(', ')}`,
            request_data: { awb_numbers: awbNumbers },
            response_data: result,
            url: '/api/shipment/cancel',
            user_agent: req.headers.get('user-agent') || 'system'
        }]);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Cancel API Error:', error);

        await supabaseAdmin.from('system_logs').insert([{
            event_type: 'SHIPMENT_CANCEL',
            status: 'FAILURE',
            message: error.message || 'Exception in Cancel API',
            request_data: { awb_numbers: awbNumbers },
            response_data: { error: error.toString() },
            url: '/api/shipment/cancel',
            user_agent: req.headers.get('user-agent') || 'system'
        }]);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
