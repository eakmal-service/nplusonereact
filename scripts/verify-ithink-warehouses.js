const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env vars manually to avoid dependency issues if dotenv isn't set up for scripts
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const ACCESS_TOKEN = env.ITHINK_ACCESS_TOKEN;
const SECRET_KEY = env.ITHINK_SECRET_KEY;
const BASE_URL = env.ITHINK_BASE_URL || 'https://my.ithinklogistics.com/api_v3';

console.log('Using Config:', {
    BASE_URL,
    ACCESS_TOKEN: ACCESS_TOKEN ? '***' : 'MISSING',
    SECRET_KEY: SECRET_KEY ? '***' : 'MISSING'
});

const payload = JSON.stringify({
    data: {
        access_token: ACCESS_TOKEN,
        secret_key: SECRET_KEY,
    },
});

const url = `${BASE_URL}/warehouse/get.json`;
console.log('Fetching:', url);

const req = https.request(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
    },
}, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log('Response Body:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Response Body (Raw):', data);
        }
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.write(payload);
req.end();
