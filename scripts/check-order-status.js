const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ORDER_ID = process.argv[2];

if (!ORDER_ID) {
    console.error("Please provide an Order ID");
    process.exit(1);
}

async function checkOrder() {
    console.log(`Checking Order: ${ORDER_ID}`);

    // Explicitly selecting relevant fields
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', ORDER_ID)
        .single();

    if (error) {
        console.error("Error fetching order:", error);
        return;
    }

    if (!data) {
        console.error("Order not found!");
        return;
    }

    console.log("Order Found (Full Dump):");
    console.log(JSON.stringify(data, null, 2));

    if (data.logistic_order_id) {
        console.log("\n✅ SUCCESS: Order synced to iThinkLogistics!");
        console.log(`Logistic ID: ${data.logistic_order_id}`);
    } else {
        console.log("\n❌ FAILURE: Logistic Order ID is missing.");
        if (data.logistic_response) {
            console.log("Logistic Response Dump:", JSON.stringify(data.logistic_response, null, 2));
        }
    }
}

checkOrder();
