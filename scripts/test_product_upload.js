const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables locally
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.join('=').trim();
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
    console.log('Attempting to upload a test product with key ending in: ...' + supabaseKey.slice(-5));

    const testProduct = {
        title: "Blue Printed Suit Set (Agent Verification)",
        description: "Verifying fix for 'Western Wear' enum issue. This product was inserted by the AI agent to confirm stability.",
        mrp: 2999,
        selling_price: 1499,
        // discount: "50%",
        category: "WESTERN WEAR", // This was the failing field ("western-dress")
        subcategory: "suit-set",
        stock_quantity: 50,
        status: "active",
        image_url: "https://placehold.co/600x800", // Placeholder for simulation
        image_urls: ["https://placehold.co/600x800"],
        sizes: ["S", "M", "L", "XL"],
        fabric: "Cotton",
        main_color: "Blue",
        default_sku: "AGENT-VERIFY-001",
        is_admin_uploaded: true
    };

    const { data, error } = await supabase
        .from('products')
        .insert([testProduct])
        .select();

    if (error) {
        console.error('❌ Upload Failed!');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('Error Details:', error.details);
        console.error('Error Hint:', error.hint);
    } else {
        console.log('✅ Upload Successful!', data);
        console.log('Test product UPLOADED and PERSISTED for user verification.');
        // Cleanup DISABLED
        // await supabase.from('products').delete().eq('id', data[0].id);
        // console.log('Test product cleaned up.');
    }
}

testUpload();
