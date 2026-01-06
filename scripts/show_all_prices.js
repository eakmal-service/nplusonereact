#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function showActualPrices() {
    console.log('📊 Fetching ACTUAL prices from database...\n');

    const { data: products, error } = await supabase
        .from('products')
        .select('style_code, title, selling_price, price, sale_price, mrp')
        .in('style_code', ['D3P_10', 'D3P_11', 'D3P_12', 'D3P_13', 'D3P_14', 'D3P_15', 'D3P_16', 'D3P_17', 'D3P_18'])
        .order('style_code');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('STYLE | SELLING_PRICE | PRICE (gen) | SALE_PRICE (gen) | MRP    | TITLE');
    console.log('='.repeat(100));

    products.forEach(p => {
        const style = p.style_code || 'NULL';
        const selling = p.selling_price || 'NULL';
        const price = p.price || 'NULL';
        const sale = p.sale_price || 'NULL';
        const mrp = p.mrp || 'NULL';
        const title = (p.title || '').substring(0, 35);

        console.log(`${style.padEnd(7)} | ${String(selling).padEnd(13)} | ${String(price).padEnd(11)} | ${String(sale).padEnd(16)} | ${String(mrp).padEnd(6)} | ${title}`);
    });

    console.log('\n');
    process.exit(0);
}

showActualPrices().catch(console.error);
