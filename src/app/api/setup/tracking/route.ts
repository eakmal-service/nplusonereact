import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // We will attempt to run SQL via a direct query if possible, or just log what needs to be done.
        // Since Supabase JS client doesn't support generic SQL execution without RLS/stored prod, 
        // we might need to rely on the user running it or use pg directly if available (it's not).
        // However, if the user has a `rpc` function for executing sql (common in setups), we can use that.
        // Assuming we might not have it, we'll try to use the 'website_content' table hack or similar if needed, 
        // but the best way here is to instruct the user.
        // actually, for this specific user environment, we usually can't run DDL.

        // BUT, I will construct a response that contains the SQL for the user to run.

        const sql = `
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS payment_info JSONB DEFAULT '{"method": "COD", "status": "pending"}'::jsonb,
      ADD COLUMN IF NOT EXISTS courier_info JSONB DEFAULT '{"name": null, "tracking_number": null, "tracking_url": null}'::jsonb,
      ADD COLUMN IF NOT EXISTS tracking_events JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `;

        // Attempt to run via RPC if 'exec_sql' exists (common pattern)
        const { error } = await supabase.rpc('exec_sql', { sql });

        if (error) {
            return NextResponse.json({
                message: "Automatic setup failed. Please run this SQL in Supabase SQL Editor:",
                sql: sql
            });
        }

        return NextResponse.json({ success: true, message: "Tracking columns added to orders table." });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
