const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkImages() {
    console.log('Checking for HTTP images...');
    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, image_url, image_urls');

    if (error) {
        console.error('Error:', error);
        return;
    }

    let httpCount = 0;
    const httpExamples = [];

    products.forEach(p => {
        if (p.image_url && p.image_url.startsWith('http:')) {
            httpCount++;
            if (httpExamples.length < 5) httpExamples.push({ id: p.id, url: p.image_url });
        }
        if (p.image_urls) {
            p.image_urls.forEach(url => {
                if (url && url.startsWith('http:')) {
                    httpCount++;
                    if (httpExamples.length < 5) httpExamples.push({ id: p.id, url: url });
                }
            });
        }
    });

    console.log(`Found ${httpCount} HTTP image URLs.`);
    if (httpCount > 0) {
        console.log('Examples:', JSON.stringify(httpExamples, null, 2));
    }
}

checkImages();
