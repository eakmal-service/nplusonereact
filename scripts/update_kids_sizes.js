const { createClient } = require('@supabase/supabase-js');

// Credentials
const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const SIZES_BOYS = ['20', '22', '24', '26', '28'];
const SIZES_GIRLS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

async function updateKidsSizes() {
    console.log('Starting Kid\'s Wear size updates...');

    // 1. Fetch all products in Kid's Wear
    // Since we don't have a reliable "Category" column filter (it might be JSON or String),
    // and exact category names might vary ("BOYS WEAR", "Boy's Wear"), we'll fetch all and filter in JS or use ILIKE.
    // Based on Admin Panel, the values are "BOYS WEAR" and "GIRLS WEAR".

    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, category, sizes');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} potential Kid's Wear products.`);

    let updatedCount = 0;

    for (const product of products) {
        const cat = (product.category || '').toUpperCase();
        const title = (product.title || '').toUpperCase();
        const subcat = (product.subcategory || '').toUpperCase();

        let newSizes = null;

        // Check Category OR Title for distinction
        if (cat.includes('BOY') || title.includes('BOY') || subcat.includes('BOY')) {
            newSizes = SIZES_BOYS;
        } else if (cat.includes('GIRL') || title.includes('GIRL') || subcat.includes('GIRL')) {
            newSizes = SIZES_GIRLS;
        } else {
            console.log(`Skipping product ${product.id} (${product.title}) - Category: ${product.category}`);
            continue;
        }

        // Update the product
        const { error: updateError } = await supabase
            .from('products')
            .update({
                sizes: newSizes
            })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Failed to update ${product.id}:`, updateError);
        } else {
            console.log(`Updated ${product.title} (${product.id}) -> ${newSizes.join(', ')}`);
            updatedCount++;
        }
    }

    console.log(`Finished. Updated ${updatedCount} products.`);
}

updateKidsSizes();
