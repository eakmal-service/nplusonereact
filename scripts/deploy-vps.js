const axios = require('axios');

// Configurations
const API_BASE_URL = 'https://developers.hostinger.com';
const VM_ID = '1149588';
const API_TOKEN = process.env.HOSTINGER_API_TOKEN;
const PROJECT_NAME = 'nplusone-web';
const REPO_URL = 'https://github.com/eakmal-service/nplusonereact.git';

if (!API_TOKEN) {
    console.error('Error: HOSTINGER_API_TOKEN environment variable is required.');
    process.exit(1);
}

const log = (msg) => console.log(`[VPS Deploy] ${msg}`);

async function deployDockerCompose() {
    log(`Starting deployment for project: ${PROJECT_NAME} on VM: ${VM_ID}`);

    try {
        const url = `${API_BASE_URL}/api/vps/v1/virtual-machines/${VM_ID}/docker`;
        const headers = {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        };

        const data = {
            project_name: PROJECT_NAME,
            content: REPO_URL,
            environment: 'NODE_ENV=production'
        };

        log(`Sending deployment request to ${url}...`);

        const response = await axios.post(url, data, { headers });

        log('Deployment successful!');
        log('Response Data:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error('Deployment failed with API error:', error.response.status, error.response.statusText);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));

            // If project already exists, we might need to update/redeploy instead of create?
            // "If project with the same name already exists, existing project will be replaced." 
            // So POST should be fine.
        } else {
            console.error('Deployment failed:', error.message);
        }
        process.exit(1);
    }
}

deployDockerCompose();
