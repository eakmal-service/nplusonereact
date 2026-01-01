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

async function checkStorage() {
    console.log('Checking storage buckets...');
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }

    console.log('Buckets found:', data.map(b => b.name));

    const bucketName = 'product-images';
    const bucket = data.find(b => b.name === bucketName);

    if (bucket) {
        console.log(`Bucket '${bucketName}' exists.`);
        if (!bucket.public) console.warn(`Warning: Bucket '${bucketName}' is NOT public.`);
    } else {
        console.log(`Bucket '${bucketName}' does NOT exist. Creating...`);
        const { data: createData, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true
        });
        if (createError) {
            console.error('Error creating bucket:', createError);
        } else {
            console.log('Bucket created successfully.');
        }
    }
}

checkStorage();
