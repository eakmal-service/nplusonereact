
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { addReattemptRTO } from '@/lib/logistics';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    let returnData: any = {};
    try {
        const body = await req.json();
        returnData = body;

        if (!returnData.awb_number) {
            return NextResponse.json({ error: "AWB Number required" }, { status: 400 });
        }

        const result = await addReattemptRTO(returnData);
        const isSuccess = result?.status === 'success';

        await supabaseAdmin.from('system_logs').insert([{
            event_type: 'SHIPMENT_RETURN',
            status: isSuccess ? 'SUCCESS' : 'FAILURE',
            message: `Return/RTO Action for AWB: ${returnData.awb_number}`,
            request_data: returnData,
            response_data: result,
            url: '/api/shipment/return',
            user_agent: req.headers.get('user-agent') || 'system'
        }]);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Return API Error:', error);

        await supabaseAdmin.from('system_logs').insert([{
            event_type: 'SHIPMENT_RETURN',
            status: 'FAILURE',
            message: error.message || 'Exception in Return API',
            request_data: returnData,
            response_data: { error: error.toString() },
            url: '/api/shipment/return',
            user_agent: req.headers.get('user-agent') || 'system'
        }]);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
