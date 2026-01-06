#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const priceUpdates = [
    { style_code: 'D3P_10', price: 551 },
    { style_code: 'D3P_11', price: 611 },
    { style_code: 'D3P_12', price: 651 },
    { style_code: 'D3P_13', price: 601 },
    { style_code: 'D3P_14', price: 551 },
    { style_code: 'D3P_15', price: 611 },
    { style_code: 'D3P_16', price: 571 },
    { style_code: 'D3P_17', price: 571 },
    { style_code: 'D3P_18', price: 551 },
];

async function updatePrices() {
    console.log('Updating PRICE field (not selling_price) for D3P_10 to D3P_18...\n');

    for (const update of priceUpdates) {
        // Update the 'price' field which is what the frontend displays
        const { error } = await supabase
            .from('products')
            .update({
                price: update.price,
                sale_price: update.price  // Also update sale_price to match
            })
            .eq('style_code', update.style_code);

        if (error) {
            console.error(`❌ Failed to update ${update.style_code}:`, error.message);
        } else {
            console.log(`✅ Updated ${update.style_code} to ₹${update.price}`);
        }
    }

    console.log('\n✅ All prices updated in PRICE field!');
    process.exit(0);
}

updatePrices().catch(console.error);
