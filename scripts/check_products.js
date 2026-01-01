const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProducts() {
    console.log('Checking database...');
    const { data, error } = await supabase.from('products').select('id, title, category');
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Total Products:', data.length);
    const categories = [...new Set(data.map(p => p.category))];
    console.log('Categories found:', categories);
}

checkProducts();
