const fs = require('fs');
const path = require('path');
const axios = require('axios');
const tus = require('tus-js-client');
const archiver = require('archiver');

// Configurations
const API_BASE_URL = 'https://developers.hostinger.com';
const DOMAIN = process.env.DOMAIN || 'nplusonefashion.com'; // Change this if needed
const API_TOKEN = process.env.HOSTINGER_API_TOKEN;

if (!API_TOKEN) {
    console.error('Error: HOSTINGER_API_TOKEN environment variable is required.');
    process.exit(1);
}

// Helper: Logging
const log = (msg) => console.log(`[Hostinger Deploy] ${msg}`);

async function resolveUsername(domain) {
    log(`Resolving username for domain: ${domain}`);
    try {
        const response = await axios.get(`${API_BASE_URL}/api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`, {
            headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        });
        // Assuming the response contains an array of websites or a single object.
        // Based on typical APIs, if searching by domain, it returns items.
        // We take the first one.
        const websites = response.data.data || response.data; // adjust based on actual structure if known
        if (!websites || (Array.isArray(websites) && websites.length === 0)) {
            throw new Error('Domain not found');
        }
        const site = Array.isArray(websites) ? websites[0] : websites;
        log(`Resolved username: ${site.username}`);
        return site.username;
    } catch (error) {
        console.error('Error resolving username:', error.response?.data || error.message);
        throw error;
    }
}

async function getUploadCredentials(username, domain) {
    log('Fetching upload credentials...');
    try {
        const response = await axios.post(`${API_BASE_URL}/api/hosting/v1/files/upload-urls`, {
            username,
            domain
        }, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching upload credentials:', error.response?.data || error.message);
        throw error;
    }
}

async function uploadArchive(filePath, credentials) {
    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = credentials;
    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    // Pre-flight check
    const cleanUploadUrl = uploadUrl.replace(/\/$/, '');
    const uploadUrlWithFile = `${cleanUploadUrl}/${filename}?override=true`;

    const requestHeaders = {
        'X-Auth': authToken,
        'X-Auth-Rest': authRestToken
    };

    log('Performing pre-upload check...');
    try {
        await axios.post(uploadUrlWithFile, '', {
            headers: requestHeaders,
            validateStatus: status => status == 201
        });
    } catch (error) {
        console.error('Pre-upload check failed:', error.response?.data || error.message);
        throw error;
    }

    log(`Starting TUS upload for ${filename}...`);
    return new Promise((resolve, reject) => {
        const upload = new tus.Upload(fileStream, {
            uploadUrl: uploadUrlWithFile,
            retryDelays: [1000, 2000, 4000],
            uploadDataDuringCreation: false,
            chunkSize: 10485760, // 10MB
            // header note: pre-flight headers might be needed here too
            headers: requestHeaders,
            uploadSize: stats.size,
            metadata: {
                filename: filename
            },
            onError: (error) => {
                console.error('Upload failed:', error);
                reject(error);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                process.stdout.write(`Uploading: ${percentage}%\r`);
            },
            onSuccess: () => {
                console.log('\nUpload finished!');
                resolve({ filename });
            }
        });
        upload.start();
    });
}

function zipDirectory(sourceDir, outPath) {
    log(`Zipping directory ${sourceDir} to ${outPath}...`);
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            log(`Archive created: ${archive.pointer()} total bytes`);
            resolve();
        });

        archive.on('error', (err) => reject(err));

        archive.pipe(output);

        // Glob to include all files except node_modules, .git, etc.
        archive.glob('**/*', {
            cwd: sourceDir,
            ignore: ['node_modules/**', '.git/**', '.next/**', 'out/**', '.env*', '*.zip']
        });

        archive.finalize();
    });
}

async function fetchBuildSettings(username, domain, filename) {
    log('Fetching build settings...');
    try {
        const response = await axios.get(`${API_BASE_URL}/api/hosting/v1/accounts/${username}/websites/${domain}/nodejs/builds/settings/from-archive?archive_path=${encodeURIComponent(filename)}`, {
            headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching build settings:', error.response?.data || error.message);
        throw error;
    }
}

async function triggerBuild(username, domain, filename, buildSettings) {
    log('Triggering build...');
    try {
        const buildData = {
            ...buildSettings,
            node_version: buildSettings?.node_version || 20,
            source_type: 'archive',
            source_options: {
                archive_path: filename
            }
        };

        const response = await axios.post(`${API_BASE_URL}/api/hosting/v1/accounts/${username}/websites/${domain}/nodejs/builds`, buildData, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        log('Build triggered successfully!');
        return response.data; // Contains build info/ID
    } catch (error) {
        console.error('Error triggering build:', error.response?.data || error.message);
        throw error;
    }
}

async function main() {
    const archiveName = `deploy-${Date.now()}.zip`;
    const archivePath = path.join(process.cwd(), archiveName);

    try {
        await zipDirectory(process.cwd(), archivePath);

        const username = await resolveUsername(DOMAIN);
        const creds = await getUploadCredentials(username, DOMAIN);

        const { filename } = await uploadArchive(archivePath, creds);

        const buildSettings = await fetchBuildSettings(username, DOMAIN, filename);
        await triggerBuild(username, DOMAIN, filename, buildSettings);

        log('Deployment triggered successfully! Check Hostinger dashboard for progress.');

    } catch (err) {
        console.error('Deployment failed.');
        process.exit(1);
    } finally {
        // Cleanup zip
        if (fs.existsSync(archivePath)) {
            fs.unlinkSync(archivePath);
            log('Cleaned up archive.');
        }
    }
}

main();
