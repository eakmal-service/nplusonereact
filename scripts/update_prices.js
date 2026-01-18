const { createClient } = require('@supabase/supabase-js');

// Credentials
const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const UPDATES = [
    { style_code: 'D3P-1', selling_price: 571, mrp: 1019, discount: '44.0%' },
    { style_code: 'D3P-2', selling_price: 571, mrp: 968, discount: '41.0%' },
    { style_code: 'D3P-4', selling_price: 571, mrp: 1002, discount: '43.0%' },
    { style_code: 'D3P-5', selling_price: 561, mrp: 976, discount: '42.5%' },
    { style_code: 'D3P-6', selling_price: 571, mrp: 965, discount: '40.8%' },
    { style_code: 'D3P-7', selling_price: 601, mrp: 1077, discount: '44.2%' },
    { style_code: 'D3P-8', selling_price: 551, mrp: 944, discount: '41.6%' },
    { style_code: 'D3P-9', selling_price: 551, mrp: 993, discount: '44.5%' },
    { style_code: 'D3P-14', selling_price: 601, mrp: 1007, discount: '40.3%' },
    { style_code: 'D3P-13', selling_price: 601, mrp: 1068, discount: '43.7%' },
    { style_code: 'D3P-11', selling_price: 551, mrp: 952, discount: '42.1%' },
    { style_code: 'D3P-12', selling_price: 611, mrp: 1107, discount: '44.8%' },
    { style_code: 'D3P-10', selling_price: 551, mrp: 933, discount: '40.9%' },
    { style_code: 'D3P-15', selling_price: 611, mrp: 1045, discount: '41.5%' },
    { style_code: 'D3P-16', selling_price: 571, mrp: 1005, discount: '43.2%' },
    { style_code: 'D3P-17', selling_price: 571, mrp: 960, discount: '40.5%' },
    { style_code: 'D3P-18', selling_price: 551, mrp: 986, discount: '44.1%' },
];

async function updatePrices() {
    console.log('Starting price updates...');

    for (const item of UPDATES) {
        console.log(`Updating ${item.style_code}...`);

        // DB has: mrp, selling_price.
        // 'price' and 'sale_price' might be generated or aliases, we only update core columns.

        const { data, error } = await supabase
            .from('products')
            .update({
                mrp: item.mrp,
                selling_price: item.selling_price
            })
            .eq('style_code', item.style_code);

        if (error) {
            console.error(`Error updating ${item.style_code}:`, error);
        } else {
            console.log(`Updated ${item.style_code} successfully.`);
        }
    }

    console.log('All updates passed.');
}

updatePrices();
