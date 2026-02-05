
// Standalone script to check warehouses
const env = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    env.config({ path: envPath });
} else {
    console.warn("⚠️ .env.local not found at", envPath);
}

const BASE_URL = process.env.ITHINK_BASE_URL || 'https://pre-alpha.ithinklogistics.com/api_v3';
const ACCESS_TOKEN = process.env.ITHINK_ACCESS_TOKEN;
const SECRET_KEY = process.env.ITHINK_SECRET_KEY;

if (!ACCESS_TOKEN || !SECRET_KEY) {
    console.error("❌ config missing in env");
    process.exit(1);
}

const getWarehouses = async () => {
    try {
        const payload = {
            data: {
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/warehouse/get.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

async function main() {
    console.log(`Checking Warehouses at: ${BASE_URL}\n`);
    const result = await getWarehouses();

    if (result && result.data) {
        console.log("\n✅ Valid Warehouses Found:");
        result.data.forEach((w) => {
            console.log(`--------------------------------`);
            console.log(`ID:       ${w.warehouse_id}  <-- USE THIS ID`);
            console.log(`Name:     ${w.warehouse_name}`);
            console.log(`Address:  ${w.warehouse_address}`);
            console.log(`City:     ${w.warehouse_city}`);
            console.log(JSON.stringify(w, null, 2));
        });
        console.log(`--------------------------------\n`);
    } else {
        console.log(JSON.stringify(result, null, 2));
        console.error("❌ Failed to fetch warehouses. Check credentials.");
    }
}

main();
