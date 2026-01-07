const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Env Setup
const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
            if (key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') supabaseKey = value;
        }
    });
} catch (e) {
    console.error("Error reading .env.local", e);
    process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Migration Logic
async function migrateImages() {
    console.log("Starting Image Migration...");

    // Fetch all products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, image_url, image_urls');

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log(`Found ${products.length} products to check.`);

    let updatedCount = 0;

    for (const p of products) {
        let needsUpdate = false;
        let newImageUrl = p.image_url;
        let newImageUrls = p.image_urls || [];

        // Helper to fix a single URL
        const fixUrl = (url) => {
            if (!url) return url;
            if (typeof url !== 'string') return url;

            // Check if it's a Cloudinary URL that needs fixing
            // Case 1: Root folder upload (no folder path before filename, just /upload/v12345/filename.jpg)
            // But we actually want to MOVE it or just RENAME the pointer? 
            // The user request says: "REWRITE all existing image_url entries... If an image URL is in the root or broken, update it to point to nplusone-fashion/products/[filename]."
            // Wait, simply changing the URL string won't move the file in Cloudinary. 
            // The User Instructions: "Logic: If an image URL is in the root or broken, update it to point to nplusone-fashion/products/[filename]."
            // This implies the files MIGHT already be there, or we are just updating the PATH structure assuming they will be moved, OR we are just "fixing" it to match the new convention?
            // "Goal: Ensure every product image points to the correct Cloudinary folder so 404s are resolved."
            // This strongly implies the files ARE in `nplusone-fashion/products` (or will be) and the DB has wrong pointers.

            // For now, let's assume we just need to inject `nplusone-fashion/products/` if it's missing or wrong.
            // AND user explicitly asked to "force uploads into: npluson-fashion/products".

            // Heuristic: If it contains `nplusone-fashion/products`, it's good.
            if (url.includes('nplusone-fashion/products')) return url;

            // If it has NO folder (just /upload/v.../filename), we inject.
            // .../upload/v123.../filename.jpg -> .../upload/v123.../nplusone-fashion/products/filename.jpg

            // Let's protect against double slashes
            // Regex to find the version part: /v\d+/
            const versionMatch = url.match(/\/v\d+\//);
            if (versionMatch) {
                const versionPart = versionMatch[0]; // e.g. "/v174..."
                const parts = url.split(versionPart);
                if (parts.length === 2) {
                    // parts[0] = https://res.cloudinary.../upload
                    // parts[1] = existing_path_or_filename
                    const tail = parts[1];

                    // If tail already has folder, maybe we replace it? 
                    // Or just PREPEND `nplusone-fashion/products`?
                    // User said: "update it to point to nplusone-fashion/products/[filename]"

                    // Let's strip any existing folder path and keep just filename
                    const filename = tail.split('/').pop();

                    return `${parts[0]}${versionPart}nplusone-fashion/products/${filename}`;
                }
            }

            return url;
        };

        const fixedMain = fixUrl(p.image_url);
        if (fixedMain !== p.image_url) {
            newImageUrl = fixedMain;
            needsUpdate = true;
        }

        if (Array.isArray(newImageUrls)) {
            const fixedList = newImageUrls.map(u => fixUrl(u));
            if (JSON.stringify(fixedList) !== JSON.stringify(p.image_urls)) {
                newImageUrls = fixedList;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            console.log(`Updating Product ${p.id} (${p.title})...`);
            // console.log(`  Old: ${p.image_url}`);
            // console.log(`  New: ${newImageUrl}`);

            const updatePayload = {
                image_url: newImageUrl,
                image_urls: newImageUrls
            };

            const { error: updateError } = await supabase
                .from('products')
                .update(updatePayload)
                .eq('id', p.id);

            if (updateError) {
                console.error(`  Failed to update ${p.id}:`, updateError);
            } else {
                updatedCount++;
            }
        }
    }

    console.log(`Migration Complete. Updated ${updatedCount} products.`);
}

migrateImages();
