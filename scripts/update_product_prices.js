#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const priceUpdates = [
    { style_code: 'D3P_1', price: 571 },
    { style_code: 'D3P_2', price: 571 },
    { style_code: 'D3P_3', price: 601 },
    { style_code: 'D3P_4', price: 571 },
    { style_code: 'D3P_5', price: 561 },
    { style_code: 'D3P_6', price: 571 },
    { style_code: 'D3P_7', price: 601 },
    { style_code: 'D3P_8', price: 551 },
    { style_code: 'D3P_9', price: 551 },
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
    console.log('Starting price updates...\n');

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

    console.log('\n✅ All prices updated successfully!');
}

async function checkColors() {
    console.log('\n\nChecking current colors for these products...\n');

    const { data: products, error } = await supabase
        .from('products')
        .select('style_code, title, main_color, color_options')
        .in('style_code', priceUpdates.map(u => u.style_code))
        .order('style_code');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log('Current Color Information:');
    console.log('========================\n');
    products.forEach(p => {
        console.log(`${p.style_code}: ${p.title}`);
        console.log(`  Main Color: ${p.main_color || 'NOT SET'}`);
        console.log(`  Color Options: ${p.color_options ? JSON.stringify(p.color_options) : 'NOT SET'}`);
        console.log('');
    });
}

async function main() {
    await updatePrices();
    await checkColors();
    process.exit(0);
}

main().catch(console.error);
