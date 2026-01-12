const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixOrder() {
    const orderId = '137ac17b-1ea1-439f-99c9-cb7b2dd908ab';

    const { error } = await supabase
        .from('orders')
        .update({
            status: 'PROCESSING', // Valid ENUM likely
            payment_status: 'PAID',
            payment_method: 'PHONEPE_UPDATED'
        })
        .eq('id', orderId);

    if (error) {
        console.error("Failed to update order:", error);
    } else {
        console.log("Successfully updated order to PROCESSING/PAID:", orderId);
    }
}

fixOrder();
