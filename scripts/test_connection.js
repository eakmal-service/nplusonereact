
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual env parsing to avoid dotenv issues
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
}

console.log("Testing Connection...");
console.log("URL:", supabaseUrl);
// Mask key for security in logs
console.log("Key:", supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("CONNECTION FAILED:");
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log("CONNECTION SUCCESSFUL!");
        console.log(`Found ${data} products (if count returned null, check permissions)`);
        // Try explicit select
        const { data: products } = await supabase.from('products').select('id, title').limit(2);
        console.log("Sample Data:", JSON.stringify(products, null, 2));
    }
}

testConnection();
