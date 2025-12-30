const fs = require('fs');
const path = require('path');
const axios = require('axios');
const tus = require('tus-js-client');
const archiver = require('archiver');
const dotenv = require('dotenv');

// Load environment variables
if (fs.existsSync(path.resolve(__dirname, '../.env.local'))) {
    const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.local')));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const API_TOKEN = process.env.HOSTINGER_API_TOKEN;
const DOMAIN = process.env.DOMAIN_NAME || 'nplusonefashion.com'; // Default or from env
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
    validateStatus: () => true // Handle status codes manually
};

async function createArchive(sourceDir, outPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);

        // Glob to include files, excluding node_modules, .git, and the zip itself
        archive.glob('**/*', {
            cwd: sourceDir,
            ignore: ['node_modules/**', '.git/**', '.next/**', 'deploy.zip', 'scripts/**']
        });

        archive.finalize();
    });
}

async function resolveUsername(domain) {
    console.log(`Resolving username for ${domain}...`);
    const res = await axios.get(`${API_BASE_URL}/api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`, AXIOS_CONFIG);
    if (res.status !== 200) throw new Error(`Failed to resolve username: ${res.status} ${JSON.stringify(res.data)}`);

    const websites = res.data.data;
    if (!websites || websites.length === 0) throw new Error('No website found');
    return websites[0].username;
}

async function getUploadCredentials(username, domain) {
    console.log('Fetching upload credentials...');
    const res = await axios.post(`${API_BASE_URL}/api/hosting/v1/files/upload-urls`, { username, domain }, AXIOS_CONFIG);
    if (res.status !== 200) throw new Error(`Failed to get credentials: ${res.status} ${JSON.stringify(res.data)}`);
    return res.data;
}

async function uploadFile(filePath, uploadUrl, authToken, authRestToken) {
    const fileSize = fs.statSync(filePath).size;
    const fileName = path.basename(filePath);
    const cleanUrl = uploadUrl.replace(/\/$/, '');
    const targetUrl = `${cleanUrl}/${fileName}?override=true`;

    console.log(`Starting upload to ${targetUrl}...`);

    // Pre-upload request
    try {
        await axios.post(targetUrl, '', {
            headers: { 'X-Auth': authToken, 'X-Auth-Rest': authRestToken },
            validateStatus: (status) => status === 201
        });
    } catch (e) {
        console.warn('Pre-upload request warning (might be ignored if file exists):', e.message);
    }

    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const upload = new tus.Upload(fileStream, {
            uploadUrl: targetUrl,
            retryDelays: [1000, 2000, 4000],
            uploadDataDuringCreation: false,
            chunkSize: 5 * 1024 * 1024, // 5MB
            headers: { 'X-Auth': authToken, 'X-Auth-Rest': authRestToken },
            uploadSize: fileSize,
            metadata: { filename: fileName },
            onError: (error) => reject(error),
            onSuccess: () => resolve(),
        });
        upload.start();
    });
}

async function fetchBuildSettings(username, domain, archiveName) {
    console.log('Fetching build settings...');
    const url = `${API_BASE_URL}/api/hosting/v1/accounts/${username}/websites/${domain}/nodejs/builds/settings/from-archive?archive_path=${encodeURIComponent(archiveName)}`;
    const res = await axios.get(url, AXIOS_CONFIG);
    if (res.status !== 200) throw new Error(`Failed to fetch build settings: ${res.status} ${JSON.stringify(res.data)}`);
    return res.data;
}

async function triggerBuild(username, domain, archiveName, settings) {
    console.log('Triggering build...');
    const url = `${API_BASE_URL}/api/hosting/v1/accounts/${username}/websites/${domain}/nodejs/builds`;
    const payload = {
        ...settings,
        node_version: 20, // Enforce Node 20 or use settings.node_version
        source_type: 'archive',
        source_options: { archive_path: archiveName }
    };

    const res = await axios.post(url, payload, AXIOS_CONFIG);
    if (res.status !== 200) throw new Error(`Failed to trigger build: ${res.status} ${JSON.stringify(res.data)}`);
    console.log('Build triggered successfully!', res.data);
}

async function main() {
    try {
        const zipPath = path.resolve(__dirname, '../deploy.zip');
        console.log('Creating archive...');
        await createArchive(path.resolve(__dirname, '..'), zipPath);
        console.log('Archive created.');

        const username = await resolveUsername(DOMAIN);
        console.log(`Username: ${username}`);

        const creds = await getUploadCredentials(username, DOMAIN);
        await uploadFile(zipPath, creds.uploadUrl, creds.authToken, creds.authRestToken);
        console.log('Upload complete.');

        const archiveName = path.basename(zipPath);
        const settings = await fetchBuildSettings(username, DOMAIN, archiveName);
        await triggerBuild(username, DOMAIN, archiveName, settings);

        // Cleanup
        if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

    } catch (error) {
        console.error('Deployment failed:', error.message);
        if (error.response) console.error('Response data:', error.response.data);
        process.exit(1);
    }
}

main();
