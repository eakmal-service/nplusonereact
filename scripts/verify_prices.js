#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPrices() {
    const { data: products, error } = await supabase
        .from('products')
        .select('style_code, title, selling_price, price')
        .in('style_code', ['D3P_10', 'D3P_11', 'D3P_12', 'D3P_13', 'D3P_14', 'D3P_15', 'D3P_16', 'D3P_17', 'D3P_18'])
        .order('style_code');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n📋 Current Prices in Database:\n');
    console.log('STYLE_CODE | SELLING_PRICE | PRICE | TITLE');
    console.log('='.repeat(80));

    products.forEach(p => {
        console.log(`${p.style_code.padEnd(12)} | ${String(p.selling_price || 'NULL').padEnd(13)} | ${String(p.price || 'NULL').padEnd(5)} | ${p.title.substring(0, 40)}`);
    });

    process.exit(0);
}

checkPrices().catch(console.error);
