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
    // 5. Check AWB (Recent window) - TRYING LOCAL TIME (IST)
    const now = new Date();
    const fifteenMinAgo = new Date(now.getTime() - 15 * 60000);

    // Format to yyyy-mm-dd HH:MM:SS in Local Time (assuming system is IST or close)
    // Using sv-SE as a hack for ISO-like format without T/Z, but respecting local timezone offset if passed to Date
    // Actually, safer to manual construct to avoid locale issues on some nodes
    const formatLocal = (d) => {
        const offset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d.getTime() - offset);
        return localDate.toISOString().slice(0, 19).replace('T', ' ');
    };

    const start = formatLocal(fifteenMinAgo);
    const end = formatLocal(now);

    console.log(`\nCheck AWB Window (Local): ${start} to ${end}`);

    await testApiEndpoint('Check AWB (Local Time)', '/order/get_awb.json', {
        start_date_time: start,
        end_date_time: end
    });
}

runTests();
