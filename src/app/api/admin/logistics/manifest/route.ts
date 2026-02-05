import { NextResponse } from 'next/server';
import { printManifest } from '@/lib/logistics';

export async function POST(req: Request) {
    try {
        const { awb_numbers } = await req.json();

        if (!awb_numbers || !Array.isArray(awb_numbers) || awb_numbers.length === 0) {
            return NextResponse.json({ error: 'AWB Numbers array is required' }, { status: 400 });
        }

        const result = await printManifest(awb_numbers);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Print Manifest API Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
