const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Credentials from ecosystem.config.js / verified environment
const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function exportProducts() {
    console.log('Fetching products...');

    // Fetch all products
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        process.exit(1);
    }

    console.log(`Fetched ${products.length} products.`);

    if (products.length === 0) {
        console.log('No products found.');
        return;
    }

    // Inspect first product for field names
    // console.log('Sample product keys:', Object.keys(products[0]));
    // Common keys expected: title (or name), category, price, salePrice, selling_price

    // Define headers
    const csvRows = [];
    csvRows.push(['Category', 'Style Code', 'Product Name', 'MRP (Price)', 'Selling Price (Sale Price)']);

    products.forEach(p => {
        // Handle variations in field names if any
        const title = p.title || p.name || 'Unknown';
        const category = p.category || 'Uncategorized';
        const styleCode = p.styleCode || p.style_code || 'N/A';

        // Price handling
        // Some DBs store as string, others as number
        const mrp = p.mrp || p.price || '0';
        const salePrice = p.salePrice || p.selling_price || p.discountedPrice || mrp; // fallback to mrp if no sale price

        csvRows.push([
            `"${category}"`, // Quote to handle commas
            `"${styleCode.replace(/"/g, '""')}"`,
            `"${title.replace(/"/g, '""')}"`, // Escape quotes
            mrp,
            salePrice
        ]);
    });

    // Convert to CSV string
    const csvContent = csvRows.map(e => e.join(',')).join('\n');

    const outputPath = path.join(__dirname, '..', 'products_prices.csv');
    fs.writeFileSync(outputPath, csvContent);
    console.log(`CSV saved to: ${outputPath}`);
}

exportProducts();
