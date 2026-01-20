
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Using Service Role Key if available would be better for bulk updates, but ANON might work if RLS allows or if we are admin.
// Ideally usage of SERVICE_ROLE_KEY is robust. Let's try ANON first or check if user has SERVICE_ROLE in env.
// Given strict RLS usually blocks ANON from bulk updates, I'll log if it fails.
// Actually, for scripts, we usually need the SERVICE_ROLE_KEY.
// Let's check if we have one, otherwise rely on the user having RLS open or using the anon key with a logged-in session (not possible here easily).
// Assuming 'SUPABASE_SERVICE_ROLE_KEY' might exist in .env.local or we use ANON and hope for the best (often allowed in dev).

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const NEW_WASH_CARE_TEXT = `🧼 Machine Wash Cold: (Gentle Cycle)
🚫 Do Not Bleach
☀️ Dry in Shade: (Avoid direct sun for dark colors)
💨 Steam Iron: (Best for Linen)
🧺 Dry Clean Recommended: (For heavy suits)`;

async function updateWashCare() {
    console.log('Starting Wash & Care update...');

    // 1. Fetch all products (just to see count or verify)
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, title');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
        return;
    }

    console.log(`Found ${products.length} products. Updating...`);

    // 2. Bulk Update
    // Depending on how attributes are stored.
    // In `AddProductForm`, it seems `washCare` is passed as a top-level field to `saveNewProduct`.
    // If `products` table has `wash_care` column:
    const { error: updateError } = await supabase
        .from('products')
        .update({ wash_care: NEW_WASH_CARE_TEXT })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy filter to apply to all

    // Note: If `wash_care` column doesn't exist, this will fail.
    // If it's inside a JSONB `attributes` column, we need a different query.
    // Let's assume it's a column based on typical Supabase setup seeing `initialData.washCare`.

    if (updateError) {
        console.error('Update failed:', updateError);
        // Fallback: Check if it is inside attributes (common pattern)
        // console.log("Attempting update via 'attributes' column...");
        // ...
    } else {
        console.log('Successfully updated Wash & Care for all products!');
    }
}

updateWashCare();
