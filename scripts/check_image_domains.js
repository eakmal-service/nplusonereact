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

async function checkImageDomains() {
    console.log('Checking image domains...');
    const { data: products, error } = await supabase
        .from('products')
        .select('image_url, image_urls');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const domains = new Set();
    const examples = [];

    const addUrl = (url) => {
        if (!url) return;
        try {
            if (url.startsWith('/')) {
                domains.add('(local)');
            } else {
                const u = new URL(url);
                domains.add(u.hostname);
                if (examples.length < 5) examples.push(url);
            }
        } catch (e) {
            console.log('Invalid URL:', url);
        }
    };

    products.forEach(p => {
        addUrl(p.image_url);
        if (p.image_urls) {
            p.image_urls.forEach(addUrl);
        }
    });

    console.log('Domains found:', [...domains]);
    console.log('Examples:', examples);
}

checkImageDomains();
