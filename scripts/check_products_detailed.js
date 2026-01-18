const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProducts() {
    console.log('Checking database...');
    // Fetch all products with relevant fields
    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, category, status, stock_quantity');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log('Total Products:', products.length);

    // Group by category and status
    const categoryStats = {};

    products.forEach(p => {
        const cat = p.category || 'Uncategorized';
        if (!categoryStats[cat]) {
            categoryStats[cat] = { total: 0, active: 0, withStock: 0, examples: [] };
        }
        categoryStats[cat].total++;
        if (p.status === 'active') categoryStats[cat].active++;
        if (p.stock_quantity > 0) categoryStats[cat].withStock++;
        if (categoryStats[cat].examples.length < 3) categoryStats[cat].examples.push(p.title);
    });

    console.log('Category Statistics:', JSON.stringify(categoryStats, null, 2));
}

checkProducts();
