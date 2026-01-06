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

async function updateAndVerify() {
    console.log('Updating SELLING_PRICE (source column) for D3P_10 to D3P_18...\n');

    for (const update of priceUpdates) {
        const { error } = await supabase
            .from('products')
            .update({ selling_price: update.price })
            .eq('style_code', update.style_code);

        if (error) {
            console.error(`❌ Failed to update ${update.style_code}:`, error.message);
        } else {
            console.log(`✅ Updated ${update.style_code} selling_price to ₹${update.price}`);
        }
    }

    console.log('\n📋 Verifying updated prices...\n');

    const { data: products } = await supabase
        .from('products')
        .select('style_code, selling_price, price, sale_price, title')
        .in('style_code', ['D3P_10', 'D3P_11', 'D3P_12', 'D3P_13', 'D3P_14', 'D3P_15', 'D3P_16', 'D3P_17', 'D3P_18'])
        .order('style_code');

    console.log('STYLE_CODE | SELLING_PRICE | PRICE (generated) | TITLE');
    console.log('='.repeat(90));
    products.forEach(p => {
        console.log(`${p.style_code.padEnd(11)} | ${String(p.selling_price).padEnd(13)} | ${String(p.price).padEnd(17)} | ${p.title.substring(0, 30)}`);
    });

    process.exit(0);
}

updateAndVerify().catch(console.error);
