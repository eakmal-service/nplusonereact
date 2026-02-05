import { NextResponse } from 'next/server';
import { printLabel } from '@/lib/logistics';

export async function POST(req: Request) {
    try {
        const { awb_numbers } = await req.json();

        if (!awb_numbers || !Array.isArray(awb_numbers) || awb_numbers.length === 0) {
            return NextResponse.json({ error: 'AWB Numbers array is required' }, { status: 400 });
        }

        const result = await printLabel(awb_numbers);

        // iThinkLogistics usually returns: { data: "url_to_pdf", status: "success" } or similar
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Print Label API Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
