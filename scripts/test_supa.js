
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
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
}

async function test() {
    const env = loadEnv();
    console.log("URL:", env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Key Length:", env.SUPABASE_SERVICE_ROLE_KEY?.length);

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    console.log("Attempting to list buckets...");
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error("❌ Error listing buckets:", error);
    } else {
        console.log("✅ buckets found:");
        buckets.forEach(b => console.log(` - ${b.name}`));

        // Check if product-images exists
        const exists = buckets.find(b => b.name === 'product-images');
        if (exists) {
            console.log("✅ 'product-images' bucket exists.");
        } else {
            console.error("❌ 'product-images' bucket NOT found in list.");
        }
    }
}

test();
