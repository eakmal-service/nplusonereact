const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
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

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAndCreateProduct() {
    try {
        console.log('Step 1: Uploading Image to Cloudinary...');
        const imagePath = path.resolve(__dirname, '../public/products/D3P_1/onfvogfywtagd8vrlt4i.webp');

        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image file not found at: ${imagePath}`);
        }

        const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: 'nplus-products/test-agent',
            public_id: 'agent_test_image_' + Date.now(),
        });

        console.log('✅ Image Uploaded:', uploadResult.secure_url);

        console.log('Step 2: Creating Product in Supabase...');
        const testProduct = {
            title: "Blue Printed Suit Set (Real Image Test)",
            description: "Verifying full flow with REAL image upload to Cloudinary.",
            mrp: 3500,
            selling_price: 1800,
            category: "WESTERN WEAR",
            subcategory: "suit-set",
            stock_quantity: 25,
            status: "active",
            image_url: uploadResult.secure_url,
            image_urls: [uploadResult.secure_url],
            sizes: ["M", "L", "XL"],
            fabric: "Georgette",
            main_color: "Blue",
            default_sku: "REAL-IMG-TEST-002",
            is_admin_uploaded: true
        };

        const { data, error } = await supabase
            .from('products')
            .insert([testProduct])
            .select();

        if (error) {
            console.error('❌ Database Insert Failed:', error);
        } else {
            console.log('✅ Product Created Successfully!', data);
            console.log('You can now check the Admin Panel. The image should be visible.');
        }

    } catch (error) {
        console.error('FAILED:', error);
    }
}

uploadAndCreateProduct();
