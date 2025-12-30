const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const API_TOKEN = process.env.HOSTINGER_API_TOKEN;

if (!API_TOKEN) {
    console.error('Error: HOSTINGER_API_TOKEN not found in .env.local');
    process.exit(1);
}

async function listWebsites() {
    try {
        const response = await axios.get('https://api.hostinger.com/v1/hosting/websites', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        console.log('--- Hostinger Websites ---');
        console.dir(response.data, { depth: null, colors: true });
    } catch (error) {
        if (error.response) {
            console.error('Request failed with status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

listWebsites();
