
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual env parsing
const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
            if (key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') supabaseKey = value;
        }
    });
} catch (e) {
    console.error("Error reading .env.local", e);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
    // 1. Get all distinct categories
    const { data: categories, error: catError } = await supabase
        .from('products')
        .select('category, subcategory')

    if (catError) {
        console.error("Error fetching categories:", catError);
        return;
    }

    // Count unique categories
    const counts = {};
    categories.forEach(p => {
        const key = `${p.category} | ${p.subcategory}`;
        counts[key] = (counts[key] || 0) + 1;
    });

    console.log("Product Counts by Category | Subcategory:");
    console.log(JSON.stringify(counts, null, 2));
}

checkCategories();
