
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';
let serviceKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
            if (key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') supabaseKey = value;
            if (key === 'SUPABASE_SERVICE_ROLE_KEY') serviceKey = value;
        }
    });
} catch (e) { console.error(e); }

console.log("--- CONFIG ---");
console.log("URL:", supabaseUrl);
// console.log("Anon Key:", supabaseKey); 
// console.log("Service Key:", serviceKey);

async function test(name, key) {
    console.log(`\nTesting with ${name}...`);
    const client = createClient(supabaseUrl, key);
    const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });

    if (error) {
        console.error(`FAILED (${name}):`);
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log(`SUCCESS (${name}): Found ${data} products.`);
    }
}

async function run() {
    await test('ANON KEY', supabaseKey);
    await test('SERVICE KEY', serviceKey);
}

run();
