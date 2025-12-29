import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const errorData = await req.json();

        const { error_message, error_stack, url, user_agent } = errorData;

        // Basic validation
        if (!error_message) {
            return NextResponse.json({ error: 'Error message is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('system_errors')
            .insert([
                {
                    error_message: error_message,
                    error_stack: error_stack,
                    url: url,
                    user_agent: user_agent || 'unknown',
                    status: 'open'
                }
            ])
            .select();

        if (error) {
            console.error('Failed to log error to Supabase:', error);
            return NextResponse.json({ error: 'Database logging failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data?.[0]?.id });

    } catch (err) {
        console.error('Error logging endpoint failed:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
