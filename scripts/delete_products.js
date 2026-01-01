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

async function deleteProducts() {
    console.log('Deleting all products from database...');
    // Delete all rows from products table
    // neq 0 is a workaround to delete all if no other filter is simpler, or just delete greater than id 0
    const { data, error } = await supabase.from('products').delete().neq('id', 0);

    if (error) {
        console.error('Error deleting products:', error);
        return;
    }
    console.log('Products deleted successfully.');

    // Verify
    const { data: checkData, error: checkError } = await supabase.from('products').select('count');
    if (checkData) console.log('Remaining products count:', checkData.length);
}

deleteProducts();
