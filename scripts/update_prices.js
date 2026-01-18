const { createClient } = require('@supabase/supabase-js');

// Credentials
const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const UPDATES = [
    // Suit Sets (Already updated, keeping for reference or re-run safe)
    // ... (omitting strictly for valid JSON if needed, but here I will just append the new ones effectively)

    // Co-ord Sets
    // Using IDs for AIR-RAYON-D2 variants to distinguish them (Now uniform MRP requested)
    { id: '09429e9e-dca3-4e26-8777-9dfcca7bf8bf', style_code: 'AIR-RAYON-D2', title: 'Yellow', selling_price: 691, mrp: 1193 },
    { id: 'cde5be89-843c-4e86-bbeb-c8dc4a9fd599', style_code: 'AIR-RAYON-D2', title: 'Green', selling_price: 691, mrp: 1193 },
    { id: '27fc1ac7-8aa4-40fd-955e-e00fdd4de8a8', style_code: 'AIR-RAYON-D2', title: 'Blue', selling_price: 691, mrp: 1193 },
    { id: '049823f9-ff95-4bb5-8181-008f4896f7ee', style_code: 'AIR-RAYON-D2', title: 'Red', selling_price: 691, mrp: 1193 },

    // Other Co-ord Sets (Unique Style Codes)
    { style_code: 'AIR-LINEN-D2', selling_price: 1091, mrp: 1901 },
    { style_code: 'AIR-LINEN-D3', selling_price: 1091, mrp: 1846 },
    { style_code: 'AIR-LINEN-D1', selling_price: 1091, mrp: 1881 },
    { style_code: 'AIR-RAYON-D4', selling_price: 1091, mrp: 1914 },

    // Kids Wear
    { style_code: 'NP-KID-FRK-EMB-01', selling_price: 451, mrp: 815 },
    { style_code: 'KIDS-FRK-CRM', selling_price: 451, mrp: 768 },
    { style_code: 'NP-KIDS-OW-07', selling_price: 451, mrp: 815 },
    { style_code: 'NP-KIDS-BSS-01', selling_price: 351, mrp: 621 },
    { style_code: 'NP-KIDS-BSS-02', selling_price: 351, mrp: 587 },
];

async function updatePrices() {
    console.log('Starting price updates...');

    for (const item of UPDATES) {
        let query = supabase.from('products').update({
            mrp: item.mrp,
            selling_price: item.selling_price
        });

        if (item.id) {
            console.log(`Updating by ID: ${item.id} (${item.style_code} - ${item.title || ''})...`);
            query = query.eq('id', item.id);
        } else {
            console.log(`Updating by Style Code: ${item.style_code}...`);
            query = query.eq('style_code', item.style_code);
        }

        const { data, error } = await query.select();

        if (error) {
            console.error(`Error updating ${item.style_code}:`, error);
        } else if (data.length === 0) {
            console.warn(`Product not found: ${item.style_code} (ID: ${item.id})`);
        } else {
            console.log(`Updated successfully: MRP ${item.mrp}, SP ${item.selling_price}`);
        }
    }

    console.log('All updates passed.');
}

updatePrices();
