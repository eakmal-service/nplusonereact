const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// 1. Env Setup
const envPath = path.resolve(__dirname, '../.env.local');
let cloudName = '';
let apiKey = '';
let apiSecret = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (key === 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME') cloudName = value;
            if (key === 'CLOUDINARY_API_KEY') apiKey = value;
            if (key === 'CLOUDINARY_API_SECRET') apiSecret = value;
        }
    });
} catch (e) {
    console.error("Error reading .env.local", e);
    process.exit(1);
}

if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing credentials.");
    process.exit(1);
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

async function uploadStaticAssets() {
    console.log("Starting Static Asset Migration...");
    const mapping = {};

    const assetsToUpload = [
        // Hero Helper
        { type: 'video', local: 'public/hero-slider-desktop/Desktop.mp4', folder: 'nplusone-fashion/Hero section images' },
        { type: 'video', local: 'public/hero-slider-mobile/mobile-video.mp4', folder: 'nplusone-fashion/Hero section images' },

        // Logo
        { type: 'image', local: 'public/images/logo.svg', folder: 'nplusone-fashion/Logo' },

        // Category Banner
        { type: 'image', local: 'public/images/categories/NPlusOne.png', folder: 'nplusone-fashion/Banner images' },
        { type: 'image', local: 'public/images/categories/Discount.png', folder: 'nplusone-fashion/Banner images' },

        // Category Images (Adding specific ones found in manual check or likely usage)
        { type: 'image', local: 'public/images/categories/17670078826332.webp', folder: 'nplusone-fashion/Category images' },
        // Add more from directory scan if needed, but let's iterate directory for generic
    ];

    // Helper to upload
    const upload = async (item) => {
        const fullPath = path.resolve(__dirname, '..', item.local);
        if (!fs.existsSync(fullPath)) {
            console.warn(`File not found: ${item.local}`);
            return;
        }

        const filename = path.parse(fullPath).name;
        // Use filename as public_id (optional, but good for tracking)
        const public_id = filename;

        try {
            console.log(`Uploading ${item.local} -> ${item.folder}...`);
            const result = await cloudinary.uploader.upload(fullPath, {
                folder: item.folder,
                public_id: public_id,
                resource_type: 'auto', // Auto-detect (video vs image)
                overwrite: true
            });
            console.log(`  => ${result.secure_url}`);
            mapping[item.local] = result.secure_url;
        } catch (e) {
            console.error(`  Error uploading ${item.local}:`, e.message);
        }
    };

    // 1. Upload predefined list
    for (const item of assetsToUpload) {
        await upload(item);
    }

    // 2. Upload all other category images
    const categoryDir = path.resolve(__dirname, '../public/images/categories');
    if (fs.existsSync(categoryDir)) {
        const files = fs.readdirSync(categoryDir);
        for (const file of files) {
            // Skip if we already uploaded it (NPlusOne.png, Discount.png, or specific webp above)
            const relPath = `public/images/categories/${file}`;
            if (assetsToUpload.find(a => a.local === relPath)) continue;
            if (file === '.DS_Store') continue;

            await upload({
                type: 'image',
                local: relPath,
                folder: 'nplusone-fashion/Category images'
            });
        }
    }

    console.log("\n--- Migration Complete ---");
    console.log("Copy these URLs to update your code:");
    console.log(JSON.stringify(mapping, null, 2));
}

uploadStaticAssets();
