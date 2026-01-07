#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const priceUpdates = [
    { style_code: 'D3P-11', price: 551 },
    { style_code: 'D3P-12', price: 611 },
    { style_code: 'D3P-14', price: 601 },
];

async function updateCorrections() {
    console.log('🔧 Updating CORRECTED prices for D3P-11, D3P-12, D3P-14...\n');

    for (const update of priceUpdates) {
        const { error } = await supabase
            .from('products')
            .update({ selling_price: update.price })
            .eq('style_code', update.style_code);

        if (error) {
            console.error(`❌ Failed to update ${update.style_code}:`, error.message);
        } else {
            console.log(`✅ Updated ${update.style_code} to ₹${update.price}`);
        }
    }

    console.log('\n✅ Corrections applied to database!');
    process.exit(0);
}

updateCorrections().catch(console.error);
