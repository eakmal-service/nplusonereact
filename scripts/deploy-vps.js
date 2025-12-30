const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const API_TOKEN = process.env.HOSTINGER_API_TOKEN;
const VM_ID = '1149588'; // Hardcoded from verification
const PROJECT_NAME = 'nplusone';
const REPO_URL = 'https://github.com/eakmal-service/nplusonereact';
const API_BASE_URL = 'https://api.hostinger.com';

if (!API_TOKEN) {
    console.error('Error: HOSTINGER_API_TOKEN is required');
    process.exit(1);
}

const AXIOS_CONFIG = {
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    validateStatus: () => true
};

async function deployToVPS() {
    const url = `${API_BASE_URL}/api/vps/v1/virtual-machines/${VM_ID}/docker`;
    console.log(`Deploying to VPS (ID: ${VM_ID})...`);
    console.log(`Project: ${PROJECT_NAME}`);
    console.log(`Source: ${REPO_URL}`);

    // Prepare environment variables string (KEY=VALUE\nKEY=VALUE)
    // Exclude HOSTINGER_API_TOKEN as it's for deployment only, but keep app vars
    const envString = Object.entries(process.env)
        .filter(([key]) => !['HOSTINGER_API_TOKEN', 'PATH', 'PWD', 'SHLVL', 'HOME', 'LOGNAME', '_'].includes(key))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const payload = {
        project_name: PROJECT_NAME,
        content: REPO_URL,
        environment: envString
    };

    try {
        const res = await axios.post(url, payload, AXIOS_CONFIG);

        if (res.status >= 200 && res.status < 300) {
            console.log('Deployment triggered successfully!');
            console.log('Response:', res.data);
        } else {
            console.error(`Deployment failed with status: ${res.status}`);
            console.error('Response:', res.data);
            process.exit(1);
        }
    } catch (error) {
        console.error('Network Error:', error.message);
        if (error.response) console.error(error.response.data);
        process.exit(1);
    }
}

deployToVPS();
