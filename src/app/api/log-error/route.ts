import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Support both old format (error_message) and new format (eventType/message)
        const eventType = body.eventType || 'CLIENT_ERROR';
        const message = body.message || body.error_message || 'Unknown Error';
        const status = body.status || 'FAILURE';

        // Extract data
        const requestData = body.requestData || { stack: body.error_stack };
        const responseData = body.responseData || {};
        const url = body.url;
        const userAgent = body.userAgent || body.user_agent || 'unknown';
        const userId = body.userId; // Can be passed if known

        const { data, error } = await supabaseAdmin
            .from('system_logs')
            .insert([
                {
                    event_type: eventType,
                    status: status,
                    message: message,
                    request_data: requestData,
                    response_data: responseData,
                    user_id: userId,
                    url: url,
                    user_agent: userAgent
                }
            ])
            .select();

        if (error) {
            console.error('Failed to log to system_logs:', error);
            // Fallback: Try system_errors if system_logs fails (backward compatibility)
            // But we prefer logging failure than crashing
            return NextResponse.json({ error: 'Database logging failed', details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data?.[0]?.id });

    } catch (err) {
        console.error('Error logging endpoint failed:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
