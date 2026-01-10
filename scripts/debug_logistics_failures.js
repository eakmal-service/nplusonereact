// Debug script for failing Logistics APIs
require('dotenv').config({ path: '.env.local' });

// Mock Fetch if not available (Node 18+ has it)
// We will use the implementation from src/lib/logistics.ts but modified to log raw text

const ACCESS_TOKEN = process.env.ITHINK_ACCESS_TOKEN;
const SECRET_KEY = process.env.ITHINK_SECRET_KEY;
const BASE_URL = process.env.ITHINK_BASE_URL || "https://pre-alpha.ithinklogistics.com/api_v3";

async function testEndpoint(name, url, payloadData) {
    console.log(`\n--- Testing ${name} ---`);
    console.log(`Endpoint: ${url}`);

    // Construct Payload matches logistics.ts structure
    const payload = {
        data: {
            ...payloadData,
            access_token: ACCESS_TOKEN,
            secret_key: SECRET_KEY,
        }
    };

    console.log("Payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        console.log(`Status Status: ${response.status} ${response.statusText}`);

        // CRITICAL: Get text first to see raw error
        const rawText = await response.text();
        console.log("Raw Response Body:", rawText);

        try {
            const json = JSON.parse(rawText);
            console.log("Parsed JSON:", json);
        } catch (e) {
            console.log("Response IS NOT JSON.");
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

async function runDebug() {
    const today = new Date().toISOString().split('T')[0];

    // 1. Print Invoice
    // Hypothesis: Dummy AWB fails
    await testEndpoint('Print Invoice', '/order/print_invoice.json', {
        awb_numbers: "SDD4289479049381" // Using a potentially valid-looking dummy
    });

    // 2. Check AWB (Get Airwaybill)
    // Hypothesis: Time format or Timezone issue
    // Doc says: yyyy-mm-dd H:i:s
    // Let's try explicit format
    const now = new Date();
    const thirtyMinAgo = new Date(now.getTime() - 15 * 60000);

    const formatDate = (d) => d.toISOString().replace('T', ' ').split('.')[0];

    await testEndpoint('Check AWB', '/awb/check.json', {
        from_date: formatDate(thirtyMinAgo),
        to_date: formatDate(now)
    });

    // 3. Get Store
    await testEndpoint('Get Store', '/store/get.json', {});

    // 4. Store Order List
    await testEndpoint('Get Store Order List', '/store/get-order-list.json', {
        start_date: today,
        end_date: today,
        platform_id: "2" // Shopify
    });
}

runDebug();
