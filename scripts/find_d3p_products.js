#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findProducts() {
    console.log('🔍 Searching for D3P products...\n');

    // Search for any product with D3P in style_code
    const { data: products, error } = await supabase
        .from('products')
        .select('id, style_code, title, selling_price, price, mrp, status')
        .ilike('style_code', 'D3P%')
        .order('style_code');

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (!products || products.length === 0) {
        console.log('❌ No products found with style_code starting with D3P!');
        console.log('\n🔍 Let me search for products with "D3P" anywhere in the title or code...\n');

        const { data: titleSearch } = await supabase
            .from('products')
            .select('id, style_code, title, selling_price, price, status')
            .or('style_code.ilike.%D3P%,title.ilike.%D3P%')
            .limit(20);

        if (titleSearch && titleSearch.length > 0) {
            console.log('Found products:');
            titleSearch.forEach(p => {
                console.log(`- ${p.style_code || 'NO_CODE'} | ${p.title.substring(0, 50)} | ₹${p.price} | Status: ${p.status}`);
            });
        } else {
            console.log('❌ No products found with "D3P" in title or style_code!');
        }
        process.exit(0);
    }

    console.log(`✅ Found ${products.length} products:\n`);
    console.log('STYLE_CODE  | SELLING | PRICE | MRP   | STATUS | TITLE');
    console.log('='.repeat(90));

    products.forEach(p => {
        const style = (p.style_code || 'NULL').padEnd(11);
        const selling = String(p.selling_price || 'NULL').padEnd(7);
        const price = String(p.price || 'NULL').padEnd(5);
        const mrp = String(p.mrp || 'NULL').padEnd(5);
        const status = (p.status || 'NULL').padEnd(6);
        const title = (p.title || '').substring(0, 35);

        console.log(`${style} | ${selling} | ${price} | ${mrp} | ${status} | ${title}`);
    });

    process.exit(0);
}

findProducts().catch(console.error);
