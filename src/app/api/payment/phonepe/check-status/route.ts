import { NextResponse } from 'next/server';
import { StandardCheckoutClient, Env } from 'pg-sdk-node';

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID || 'NO_CLIENT_ID_CONFIGURED';
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || 'NO_CLIENT_SECRET_CONFIGURED';
const CLIENT_VERSION = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
const ENV = (process.env.PHONEPE_ENV === 'PRODUCTION') ? Env.PRODUCTION : Env.SANDBOX;

export async function POST(req: Request) {
    try {
        const { transactionId } = await req.json();

        if (!transactionId) {
            return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
        }

        const client = StandardCheckoutClient.getInstance(CLIENT_ID, CLIENT_SECRET, CLIENT_VERSION, ENV);

        const response = await client.getOrderStatus(transactionId);

        console.log("PhonePe Status Response:", JSON.stringify(response));

        if (response.state === "COMPLETED") {
            return NextResponse.json({
                status: 'PAID',
                details: response
            });
        } else if (response.state === "FAILED") {
            return NextResponse.json({
                status: 'FAILED',
                details: response
            });
        } else {
            return NextResponse.json({
                status: 'PENDING',
                details: response
            });
        }

    } catch (error: any) {
        console.error("PhonePe Status SDK Error:", error);
        return NextResponse.json({ error: "Failed to check status", details: error.message }, { status: 500 });
    }
}
