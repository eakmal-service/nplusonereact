
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { printLabel } from '@/lib/logistics';

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

        const result = await printLabel(awbNumbers);
        // Check for PDF link or success status
        const isSuccess = !!result?.data; // Usually returns binary or link in data

        await supabaseAdmin.from('system_logs').insert([{
            event_type: 'LABEL_GENERATION',
            status: isSuccess ? 'SUCCESS' : 'FAILURE',
            message: `Label generated for ${awbNumbers.length} orders`,
            request_data: { awb_numbers: awbNumbers },
            response_data: result ? { ...result, data: 'PDF_BINARY_OR_LINK_HIDDEN' } : null, // Avoid logging huge binary if any
            url: '/api/shipment/label',
            user_agent: req.headers.get('user-agent') || 'system'
        }]);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Label API Error:', error);

        await supabaseAdmin.from('system_logs').insert([{
            event_type: 'LABEL_GENERATION',
            status: 'FAILURE',
            message: error.message || 'Exception in Label API',
            request_data: { awb_numbers: awbNumbers },
            response_data: { error: error.toString() },
            url: '/api/shipment/label',
            user_agent: req.headers.get('user-agent') || 'system'
        }]);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
