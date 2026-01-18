#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
    console.log('🔍 Checking for potential duplicates (Hyphen vs Underscore)...\n');

    const codesToCheck = ['D3P-10', 'D3P_10', 'D3P-11', 'D3P_11', 'D3P-12', 'D3P_12', 'D3P-13', 'D3P_13'];

    const { data: products, error } = await supabase
        .from('products')
        .select('id, style_code, title, selling_price, price')
        .in('style_code', codesToCheck);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Found these products:');
    console.log('ID                                   | STYLE_CODE | PRICE | TITLE');
    console.log('='.repeat(80));

    products.forEach(p => {
        console.log(`${p.id} | ${p.style_code.padEnd(10)} | ${String(p.price).padEnd(5)} | ${p.title.substring(0, 30)}`);
    });

    process.exit(0);
}

checkDuplicates().catch(console.error);
