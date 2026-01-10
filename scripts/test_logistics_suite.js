// Used native fetch

const BASE_URL = 'https://pre-alpha.ithinklogistics.com/api_v3';
const ACCESS_TOKEN = '5a7b40197cd919337501dd6e9a3aad9a';
const SECRET_KEY = '2b54c373427be180d1899400eeb21aab';

async function testApiEndpoint(name, url, payloadData) {
    console.log(`\n--- Testing ${name} ---`);
    console.log(`Endpoint: ${url}`);

    const payload = {
        data: {
            ...payloadData,
            access_token: ACCESS_TOKEN,
            secret_key: SECRET_KEY,
        }
    };

    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log(`Status Code: ${response.status}`);
        // Log brief success or full error
        if (data.status === 'success' || data.status_code === 200) {
            console.log('Result: Success (Response received)');
            if (data.data) console.log('Data keys:', Object.keys(data.data));
            if (data.Awb_list) console.log('AWB List received');
        } else {
            console.log('Result:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function runTests() {
    // 1. Pincode (Sanity Check)
    await testApiEndpoint('Pincode Check', '/pincode/check.json', { pincode: '400001' });

    // 2. Track Order (Dummy AWB)
    await testApiEndpoint('Track Order', '/order/track.json', { awb_number_list: '123456789' });

    // 3. Print Label (Dummy AWB)
    await testApiEndpoint('Print Label', '/shipping/label.json', {
        awb_numbers: '123456789',
        page_size: 'A4',
        display_cod_prepaid: '1'
    });

    // 4. Cancel Order (Dummy AWB)
    await testApiEndpoint('Cancel Order', '/order/cancel.json', { awb_numbers: '123456789' });

    // 5. Check AWB (Get Airwaybill)
    // CRITICAL: Window must be <= 30 mins
    const now = new Date();
    const fifteenMinAgo = new Date(now.getTime() - 15 * 60000);

    const formatDate = (d) => {
        // Format: YYYY-MM-DD HH:MM:SS
        const iso = d.toISOString();
        return iso.replace('T', ' ').split('.')[0];
    };

    await testApiEndpoint('Check AWB (15 min window)', '/order/get_awb.json', { // Verified endpoint
        start_date_time: formatDate(fifteenMinAgo),
        end_date_time: formatDate(now)
    });

    // 6. Print Invoice
    // Verified Endpoint: /shipping/invoice.json, Payload: awb_numbers
    // Using a dummy AWB for structure check. Expecting 200 OK (even if empty/error message, usually not Invalid Request)
    await testApiEndpoint('Print Invoice', '/shipping/invoice.json', {
        awb_numbers: "SDD12345678"
    });

    // 10. Get Store
    await testApiEndpoint('Get Store', '/store/get.json', {});

    // 11. Get States (India)
    await testApiEndpoint('Get States', '/state/get.json', { country_id: 101 });

    // 12. Get Cities (Maharashtra - assuming ID is known or fetched previously, trying dummy ID 22 for Maharashtra often used)
    // Note: In real flow, we'd use ID from Get States response.
    await testApiEndpoint('Get Cities (State ID 22)', '/city/get.json', { state_id: 22 });

    // 13. Add Warehouse (Dummy Data)
    await testApiEndpoint('Add Warehouse', '/warehouse/add.json', {
        company_name: "Test Warehouse",
        address1: "Test Address Line 1",
        mobile: "9876543210",
        pincode: "400001",
        city_id: 55, // Dummy City ID
        state_id: 22, // Dummy State ID
        country_id: 101,
        gps: ""
    });

    // 14. Get Rate
    // Pincode 395007 (Surat) to 400001 (Mumbai)
    await testApiEndpoint('Get Rate', '/rate/check.json', {
        from_pincode: "395007",
        to_pincode: "400001",
        shipping_weight_kg: "0.5",
        payment_method: "Prepaid",
        product_mrp: "1000",
        order_type: "Forward",
        shipping_length_cms: "10",
        shipping_width_cms: "10",
        shipping_height_cms: "10"
    });

    // 15. Get Rate Zone Wise
    await testApiEndpoint('Get Rate Zone Wise', '/rate/zone_rate.json', {
        from_pincode: "395007",
        shipping_weight_kg: "0.5",
        payment_method: "Prepaid",
        product_mrp: "1000",
        order_type: "Forward",
        service_type: "Air",
        shipping_length_cms: "10",
        shipping_width_cms: "10",
        shipping_height_cms: "10"
    });

    // 16. Get Remittance (Dummy Date)
    await testApiEndpoint('Get Remittance', '/remittance/get.json', { remittance_date: '2025-01-01' });

    // 17. Get Remittance Details (Dummy Date)
    await testApiEndpoint('Get Remittance Details', '/remittance/get_details.json', { remittance_date: '2025-01-01' });

    // 18. Get Store Order List (Dummy Data - Shopify platform ID is often 2, but could differ)
    // Using current date range
    const today = new Date().toISOString().split('T')[0];
    await testApiEndpoint('Get Store Order List', '/store/get-order-list.json', {
        start_date: today,
        end_date: today,
        platform_id: '2'
    });

    // 19. Get Store Order Details (Dummy Data)
    await testApiEndpoint('Get Store Order Details', '/store/get-order-details.json', {
        order_no_list: '1001,1002',
        platform_id: '2'
    });

    // 20. Get NDR
    // Using current date range
    await testApiEndpoint('Get NDR', '/ndr/all.json', {
        from_date: today,
        to_date: today
    });

    // 21. Add Reattempt/RTO (Dummy Data)
    // Action 1: Reattempt
    await testApiEndpoint('Add Reattempt', '/ndr/add-reattempt-rto.json', {
        awb_numbers: "SDD1001008",
        ndr_action: "1",
        reattempt_date: today,
        reattempt_time: "10:00:00",
        reattempt_mobile_number: "9876543210",
        reattempt_address: "Test Address",
        reattempt_address_type: "1"
    });
}



runTests();

