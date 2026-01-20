
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProduct() {
    // Fetch one product to see its data
    const { data, error } = await supabase
        .from('products')
        .select('id, title, wash_care')
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
    } else {
        console.log('Fetched Product:', data);
    }
}

checkProduct();
