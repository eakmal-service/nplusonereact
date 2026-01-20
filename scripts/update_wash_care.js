
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.log('No .env.local found, checking process env...');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const NEW_WASH_CARE_TEXT = `🧼 Machine Wash Cold: (Gentle Cycle)
🚫 Do Not Bleach
☀️ Dry in Shade: (Avoid direct sun for dark colors)
💨 Steam Iron: (Best for Linen)
🧺 Dry Clean Recommended: (For heavy suits)`;

async function updateWashCare() {
    console.log('Starting Wash & Care update...');

    // 1. Fetch all products
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
        return;
    }

    console.log(`Found ${products.length} products. Updating...`);

    // 2. Bulk Update
    const { error: updateError } = await supabase
        .from('products')
        .update({ wash_care: NEW_WASH_CARE_TEXT })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy filter

    if (updateError) {
        console.error('Update failed:', updateError);
    } else {
        console.log('Successfully updated Wash & Care for all products!');
    }
}

updateWashCare();
