const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function inspectSchema() {
    // First get a valid product ID
    const { data: products } = await supabase.from('products').select('id').limit(1);
    const productId = products && products.length > 0 ? products[0].id : '1';

    // Random UUID generator
    const randomUUID = crypto.randomUUID();

    console.log(`Attempting insert with keys: product_id, rating, comment, user_id=${randomUUID}`);
    const { data, error } = await supabase
        .from('reviews')
        .insert([
            {
                product_id: productId,
                rating: 5,
                comment: 'Test review with user_id',
                user_id: randomUUID
            }
        ])
        .select();

    if (error) {
        console.error('Insert Error:', error);
    } else {
        console.log('Insert Success! Schema Keys:', Object.keys(data[0]));
        // cleanup
        await supabase.from('reviews').delete().eq('id', data[0].id);
    }
}

inspectSchema();
