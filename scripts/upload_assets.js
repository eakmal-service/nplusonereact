
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// 1. Load Environment Variables
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envConfig = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envConfig.split('\n').forEach(line => {
            const parts = line.split('=');
            const key = parts[0]?.trim();
            const value = parts.slice(1).join('=')?.trim();
            if (key && value) {
                env[key] = value.replace(/^["']|["']$/g, '');
            }
        });
        return env;
    } catch (e) {
        process.exit(1);
    }
}

const env = loadEnv();

cloudinary.config({
    cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
});

const SYNC_DIRS = [
    'products',
    'images',
    'hero-slider-desktop',
    'hero-slider-mobile',
    'explore-collection'
];

async function uploadFile(filePath, relativePath) {
    // FILTER: For 'products', ONLY allow WebP
    if (relativePath.startsWith('products/') && !relativePath.endsWith('.webp')) {
        return;
    }

    // SKIP system files
    if (path.basename(filePath).startsWith('.')) return;

    try {
        // "public/products/D3P_1/1.webp" -> "nplus/products/D3P_1/1" (public_id)
        // Cloudinary doesn't need extension in public_id usually, but let's keep path structure
        // We will strip the extension for the public_id to be clean, or keep it if needed.
        // Let's us "nplus/" as root folder for organization.

        const folder = path.dirname(relativePath);
        const nameWithoutExt = path.basename(relativePath, path.extname(relativePath));
        const publicId = `nplus/${folder}/${nameWithoutExt}`;

        const result = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            overwrite: true,
            resource_type: "auto"
        });

        console.log(`✅ Uploaded: ${relativePath} -> ${result.secure_url}`);

    } catch (err) {
        console.error(`❌ Error uploading ${relativePath}:`, err.message);
    }
}

async function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await walkDir(fullPath);
        } else {
            if (file === '.DS_Store') continue;
            const relativePath = fullPath.split('public/')[1];
            if (relativePath) {
                await uploadFile(fullPath, relativePath);
            }
        }
    }
}

async function main() {
    console.log(`🚀 Starting Cloudinary Upload...`);

    for (const dirName of SYNC_DIRS) {
        const dirPath = path.join(process.cwd(), 'public', dirName);
        if (fs.existsSync(dirPath)) {
            console.log(`\n📂 Scanning: ${dirName}...`);
            await walkDir(dirPath);
        }
    }
    console.log("\n✨ All operations completed!");
}

main();
