const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

// 1. Env Setup
const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';
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
            if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
            if (key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') supabaseKey = value;
            if (key === 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME') cloudName = value;
            if (key === 'CLOUDINARY_API_KEY') apiKey = value;
            if (key === 'CLOUDINARY_API_SECRET') apiSecret = value;
        }
    });
} catch (e) {
    console.error("Error reading .env.local", e);
    process.exit(1);
}

if (!supabaseUrl || !supabaseKey || !cloudName || !apiKey || !apiSecret) {
    console.error("Missing credentials.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

// Helper to clean path segments
const clean = (s) => s?.trim().replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'General';

// Helper to extract Public ID from URL
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    // .../upload/v12345/folder/filename.jpg
    // We want "folder/filename" (no extension)
    // Regex: /upload/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/
    const regex = /upload\/(?:v\d+\/)?(.+?)(\.[a-zA-Z0-9]+)?$/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
};

async function organizeCloudinary() {
    console.log("Starting Cloudinary Reorganization...");

    // 1. Migrate Products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, category, subcategory, hsn_code, image_url, image_urls');

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log(`Found ${products.length} products to process.`);

    for (const p of products) {
        const targetFolder = `nplusone-fashion/Products images/${clean(p.category)}/${clean(p.subcategory)}/${clean(p.hsn_code)}`;

        const processUrl = async (url) => {
            if (!url) return url;
            const currentPublicId = getPublicIdFromUrl(url);
            if (!currentPublicId) return url;

            // Check if already in correct folder
            if (currentPublicId.startsWith(targetFolder)) return url;

            const filename = currentPublicId.split('/').pop();
            const newPublicId = `${targetFolder}/${filename}`;

            try {
                console.log(`  Moving: ${currentPublicId} -> ${newPublicId}`);
                const result = await cloudinary.uploader.rename(currentPublicId, newPublicId, { overwrite: true });
                return result.secure_url; // Use the new secure_url
            } catch (e) {
                if (e.error && e.error.message && e.error.message.includes("not found")) {
                    console.warn(`    Image not found in Cloudinary: ${currentPublicId}`);
                } else {
                    console.error(`    Error moving image: ${e.message || e}`);
                }
                // Return original if move failed, to avoid breaking DB (or we could try to construct the new URL manually if we are sure? No, unsafe)
                return url;
            }
        };

        let needsUpdate = false;
        let newImageUrl = p.image_url;
        let newImageUrls = p.image_urls || [];

        // Migrate primary image
        const updatedMain = await processUrl(p.image_url);
        if (updatedMain !== p.image_url) {
            newImageUrl = updatedMain;
            needsUpdate = true;
        }

        // Migrate gallery images
        if (Array.isArray(p.image_urls)) {
            const updatedList = [];
            for (const u of p.image_urls) {
                updatedList.push(await processUrl(u));
            }
            if (JSON.stringify(updatedList) !== JSON.stringify(p.image_urls)) {
                newImageUrls = updatedList;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            console.log(`  Updating DB for Product ${p.id}...`);
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    image_url: newImageUrl,
                    image_urls: newImageUrls
                })
                .eq('id', p.id);

            if (updateError) {
                console.error(`  Failed to update DB for ${p.id}:`, updateError);
            }
        }
    }

    console.log("\n-----------------------------------");
    console.log("Product Migration Complete.");
    console.log("NOTE: 'Hero', 'Fav', 'Category', 'Banner' images are usually stored in 'website_content' table or hardcoded.");
    console.log("This script only handled the 'products' table.");
    console.log("For other assets, please manually move them in Cloudinary Dashboard to:");
    console.log("- nplusone-fashion/Hero section images");
    console.log("- nplusone-fashion/My Fav images");
    console.log("- nplusone-fashion/Category images");
    console.log("- nplusone-fashion/Banner images");
    console.log("And then update the CMS content via Admin Panel or DB update if they are dynamic.");
}

organizeCloudinary();
