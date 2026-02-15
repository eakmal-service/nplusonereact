const https = require('https');

// Credentials from .env.local
const BASE_URL = 'https://my.ithinklogistics.com/api_v3';
const ACCESS_TOKEN = '96f80a961d63f99dd060b6ede5cc979e';
const SECRET_KEY = '2be9aec1ac1f0bfd2f17ff9f8f530228';
const PICKUP_ID = '102720';

// Helper for request
function apiCall(endpoint, data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            data: {
                ...data,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY
            }
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        const req = https.request(`${BASE_URL}${endpoint}`, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve({ raw: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
    });
}

async function test() {
    console.log("--- Testing iThinkLogistics API ---");

    // 1. Test Pincode
    console.log("\n1. Testing Pincode Check (110001)...");
    const pinRes = await apiCall('/pincode/check.json', { pincode: '110001' });
    console.log("Result:", JSON.stringify(pinRes, null, 2));

    if (pinRes.status !== 'success' && pinRes.status !== 'error') { // 'error' might be valid response for unserviceable but implies connection worked
        console.log("⚠️ Connection questionable.");
    }

    // 2. Test Get Warehouses (simplest auth check)
    // Actually, store/get.json is better? Or warehouse/get.json
    console.log("\n2. Testing Get Warehouses...");
    const warehouseRes = await apiCall('/warehouse/get.json', {});
    console.log("Result:", JSON.stringify(warehouseRes, null, 2));

    // 3. Dry Run Shipment (using dummy data intentionally to see validation error vs Auth error)
    console.log("\n3. Testing Shipment Validation (Dummy Data)...");
    const orderData = {
        shipments: [{
            waybill: "",
            order: "TEST-" + Date.now(),
            order_date: new Date().toISOString().split('T')[0],
            payment_mode: "Prepaid",
            total_amount: "100",
            opt_gstin: "",
            name: "Test User",
            add: "Test Address",
            pin: "110001",
            city: "Delhi",
            state: "Delhi",
            country: "India",
            country: "India",
            phone: "9876543210",
            alt_phone: "",
            products: [{
                product_name: "Test Product",
                product_sku: "SKU-1",
                product_quantity: "1",
                product_price: "100",
                product_tax_rate: "5"
            }],
            weight: "0.5",
            pickup_address_id: PICKUP_ID
        }],
        pickup_address_id: PICKUP_ID,
        access_token: ACCESS_TOKEN,
        secret_key: SECRET_KEY,
        order_type: "Forward",
        s_type: "Surface"
    };

    const shipRes = await apiCall('/order/add.json', orderData);
    console.log("Result:", JSON.stringify(shipRes, null, 2));
}

test();
