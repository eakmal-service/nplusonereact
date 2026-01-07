#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// CORRECT mapping with HYPHENS (D3P-10 not D3P_10)
const priceUpdates = [
    { style_code: 'D3P-10', price: 551 },
    { style_code: 'D3P-11', price: 611 },
    { style_code: 'D3P-12', price: 651 },
    { style_code: 'D3P-13', price: 601 },
    { style_code: 'D3P-14', price: 551 },
    { style_code: 'D3P-15', price: 611 },
    { style_code: 'D3P-16', price: 571 },
    { style_code: 'D3P-17', price: 571 },
    { style_code: 'D3P-18', price: 551 },
];

async function updateCorrectPrices() {
    console.log('🔧 Updating prices with CORRECT style codes (D3P-XX with hyphen)...\n');

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

    console.log('\n📋 Verifying...\n');

    const { data: products } = await supabase
        .from('products')
        .select('style_code, selling_price, price')
        .in('style_code', priceUpdates.map(u => u.style_code))
        .order('style_code');

    products.forEach(p => {
        console.log(`${p.style_code}: selling_price=${p.selling_price}, price=${p.price}`);
    });

    process.exit(0);
}

updateCorrectPrices().catch(console.error);
