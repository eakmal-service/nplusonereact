import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
    const sectionId = request.nextUrl.searchParams.get('section_id');

    try {
        if (sectionId) {
            const { data, error } = await supabase
                .from('website_content')
                .select('*')
                .eq('section_id', sectionId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
                throw error;
            }

            return NextResponse.json(data ? data.content : null);
        } else {
            const { data, error } = await supabase
                .from('website_content')
                .select('*');

            if (error) throw error;

            // Convert array to object keyed by section_id
            const contentMap: Record<string, any> = {};
            data?.forEach((row: any) => {
                contentMap[row.section_id] = row.content;
            });

            return NextResponse.json(contentMap);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { section_id, content } = body;

        if (!section_id || !content) {
            return NextResponse.json({ error: 'Missing section_id or content' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('website_content')
            .upsert({
                section_id,
                content,
                updated_at: new Date().toISOString()
            })
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
