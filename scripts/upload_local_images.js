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

async function uploadLocalImages() {
    console.log("Starting Local Image Migration...");

    // 1. Fetch products
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log(`Found ${products.length} products to check.`);

    // 2. Process each product
    for (const p of products) {
        console.log(`\nProcessing: ${p.title} (ID: ${p.id})`);

        let needsUpdate = false;
        let finalImageUrl = p.image_url;
        let finalImageUrls = p.image_urls || [];

        // Helper to upload a single path
        const uploadPath = async (urlOrPath) => {
            if (!urlOrPath) return urlOrPath;

            // If already Cloudinary, skip
            if (urlOrPath.includes('cloudinary.com')) {
                // console.log(`  Skipping (already valid): ${urlOrPath}`);
                return urlOrPath;
            }

            // Assume it's a relative path in public, e.g., "/products/D3P_1/foo.webp"
            // Remove leading slash
            const relPath = urlOrPath.startsWith('/') ? urlOrPath.slice(1) : urlOrPath;
            const fullPath = path.join(__dirname, '../public', relPath);

            if (!fs.existsSync(fullPath)) {
                console.warn(`  File NOT FOUND: ${fullPath}`);
                return urlOrPath; // Keep as is if missing locally
            }

            // Construct folder path: nplusone-fashion/Products images/{Cat}/{Sub}/{HSN}
            const cat = clean(p.category || 'Uncategorized');
            const sub = clean(p.subcategory || 'General');
            const hsn = clean(p.hsn_code || 'No-HSN');
            const targetFolder = `nplusone-fashion/Products images/${cat}/${sub}/${hsn}`;

            try {
                // Generate public_id from filename to keep it clean (optional)
                const filename = path.parse(fullPath).name; // 's4lcch...'

                console.log(`  Uploading: ${relPath} -> ${targetFolder}`);
                const result = await cloudinary.uploader.upload(fullPath, {
                    folder: targetFolder,
                    public_id: filename,
                    resource_type: 'auto',
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true
                });

                return result.secure_url;
            } catch (e) {
                console.error(`  Upload Error for ${relPath}:`, e.message);
                return urlOrPath;
            }
        };

        // Update Scan
        const newMain = await uploadPath(p.image_url);
        if (newMain !== p.image_url) {
            finalImageUrl = newMain;
            needsUpdate = true;
        }

        if (Array.isArray(p.image_urls)) {
            const newList = [];
            for (const u of p.image_urls) {
                newList.push(await uploadPath(u));
            }
            if (JSON.stringify(newList) !== JSON.stringify(p.image_urls)) {
                finalImageUrls = newList;
                needsUpdate = true;
            }
        }

        // Save DB
        if (needsUpdate) {
            console.log(`  Updating DB Record...`);
            const { error: dbErr } = await supabase
                .from('products')
                .update({
                    image_url: finalImageUrl,
                    image_urls: finalImageUrls
                })
                .eq('id', p.id);

            if (dbErr) {
                console.error(`  DB Update Failed:`, dbErr);
            } else {
                console.log(`  Success!`);
            }
        } else {
            console.log(`  No changes needed.`);
        }
    }
}

uploadLocalImages();
