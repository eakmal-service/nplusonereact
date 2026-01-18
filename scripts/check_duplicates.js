const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkproducts() {
    const styleCodes = [
        'AIR-RAYON-D2',
        'AIR-LINEN-D2',
        'AIR-LINEN-D3',
        'AIR-LINEN-D1',
        'AIR-RAYON-D4'
    ];

    console.log(`Checking products...`);

    const { data, error } = await supabase
        .from('products')
        .select('id, title, style_code, mrp, selling_price')
        .in('style_code', styleCodes);

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(p => {
        console.log(`Code: ${p.style_code} | Title: ${p.title} | MRP: ${p.mrp} | SP: ${p.selling_price}`);
    });
}

checkproducts();
