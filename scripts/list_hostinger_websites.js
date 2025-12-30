const https = require('https');
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

const options = {
    hostname: 'api.hostinger.com',
    path: '/v1/hosting/websites',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
};

const req = https.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const parsed = JSON.parse(data);
                console.log('--- Hostinger Websites ---');
                console.dir(parsed, { depth: null, colors: true });
            } catch (e) {
                console.log('Raw Output:', data);
            }
        } else {
            console.error('Request failed.');
            console.error('Response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
