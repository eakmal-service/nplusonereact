import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // Create website_content table
        const { error } = await supabase.rpc('create_website_content_table_if_not_exists');

        if (error) {
            // Fallback: Try to use direct SQL via a specialized function or just report error
            // Since we can't easily run arbitrary SQL without a helper function in Postgres,
            // we'll try to insert a dummy row to check if table exists, if not we might fail.
            // Ideally, the user should run the SQL manually.
            // However, for this environment, let's assume we can rely on a query if we had a sql runner.
            // But standard Supabase client doesn't export SQL runner for security.
            // We will return a SQL script for the user to run.

            return NextResponse.json({
                message: 'Table creation via RPC failed (likely function missing). Please run this SQL in Supabase SQL Editor:',
                sql: `
          CREATE TABLE IF NOT EXISTS website_content (
            section_id TEXT PRIMARY KEY,
            content JSONB,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
          );
        `
            }, { status: 200 });
        }

        return NextResponse.json({ message: 'Setup completed successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
