const { StandardCheckoutClient, Env } = require('pg-sdk-node');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
const ENV = (process.env.PHONEPE_ENV === 'PRODUCTION') ? Env.PRODUCTION : Env.SANDBOX;

const orderId = '137ac17b-1ea1-439f-99c9-cb7b2dd908ab'; // Latest order ID

async function checkStatus() {
    try {
        console.log(`Checking status for Order ID: ${orderId}`);
        console.log(`Client ID: ${CLIENT_ID}, Env: ${ENV}`);

        const client = StandardCheckoutClient.getInstance(CLIENT_ID, CLIENT_SECRET, CLIENT_VERSION, ENV);
        const response = await client.getOrderStatus(orderId);

        console.log("PhonePe Response:", JSON.stringify(response, null, 2));
    } catch (error) {
        console.error("Error checking status:", error);
    }
}

checkStatus();
