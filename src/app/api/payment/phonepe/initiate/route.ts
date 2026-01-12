import { NextResponse } from 'next/server';
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from 'pg-sdk-node';

// Initialize SDK Credentials from Env
const CLIENT_ID = process.env.PHONEPE_CLIENT_ID || 'NO_CLIENT_ID_CONFIGURED';
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || 'NO_CLIENT_SECRET_CONFIGURED';
const CLIENT_VERSION = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
const ENV = (process.env.PHONEPE_ENV === 'PRODUCTION') ? Env.PRODUCTION : Env.SANDBOX;

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';

// Callback URLs
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
const CALLBACK_URL = `${BASE_URL}/api/payment/phonepe/callback`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, orderId, mobileNumber, userId } = body;

        if (!amount || !orderId || !mobileNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const merchantOrderId = orderId;

        // Initialize Client
        const client = StandardCheckoutClient.getInstance(CLIENT_ID, CLIENT_SECRET, CLIENT_VERSION, ENV);

        // Build Request
        // Adjusted to match StandardCheckoutPayRequest builder methods (no callbackUrl, no mobileNumber)
        const request = StandardCheckoutPayRequest.builder()
            .merchantOrderId(merchantOrderId)
            .amount(amount * 100)
            .redirectUrl(CALLBACK_URL)
            .build();

        // Initiate Payment
        const response = await client.pay(request);

        const checkoutPageUrl = response.redirectUrl;

        return NextResponse.json({
            success: true,
            redirectUrl: checkoutPageUrl,
            transactionId: merchantOrderId
        });

    } catch (error: any) {
        console.error("PhonePe Init SDK Error:", error);
        return NextResponse.json({
            error: error.message || "Payment initiation failed",
            details: error
        }, { status: 500 });
    }
}
