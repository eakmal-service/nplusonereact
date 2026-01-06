#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColors() {
    const { data: products, error } = await supabase
        .from('products')
        .select('style_code, title, main_color, color_options, image_url')
        .in('style_code', [
            'D3P_1', 'D3P_2', 'D3P_3', 'D3P_4', 'D3P_5', 'D3P_6',
            'D3P_7', 'D3P_8', 'D3P_9', 'D3P_10', 'D3P_11', 'D3P_12',
            'D3P_13', 'D3P_14', 'D3P_15', 'D3P_16', 'D3P_17', 'D3P_18'
        ])
        .order('style_code');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n📋 Product Colors Report:\n');
    console.log('STYLE_CODE | TITLE | MAIN_COLOR | IMAGE_PATH');
    console.log('='.repeat(100));

    products.forEach(p => {
        // Extract color from title (usually appears as words like "Violet", "Green", "Pink" etc.)
        const title = p.title || '';
        const mainColor = p.main_color || 'NOT SET';
        const imagePath = p.image_url || '';

        console.log(`${p.style_code.padEnd(12)} | ${title.substring(0, 40).padEnd(40)} | ${mainColor.padEnd(15)} | ${imagePath.substring(0, 30)}`);
    });

    console.log('\n\n📝 Instructions:');
    console.log('Please review each product and tell me the CORRECT color for each one.');
    console.log('I will then update the main_color field accordingly.\n');
}

checkColors().then(() => process.exit(0)).catch(console.error);
