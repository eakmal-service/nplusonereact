// Used native fetch


const BASE_URL = 'https://pre-alpha.ithinklogistics.com/api_v3';
// Credentials provided by user
const ACCESS_TOKEN = '5a7b40197cd919337501dd6e9a3aad9a';
const SECRET_KEY = '2b54c373427be180d1899400eeb21aab';

async function checkPincode(pincode) {
    console.log(`\nTesting Pincode Check for: ${pincode}`);
    const payload = {
        data: {
            pincode: pincode,
            access_token: ACCESS_TOKEN,
            secret_key: SECRET_KEY,
        }
    };

    try {
        const response = await fetch(`${BASE_URL}/pincode/check.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Status Code:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run test
checkPincode('400001');
