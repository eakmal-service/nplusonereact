
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual env parsing
const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
            if (key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') supabaseKey = value;
        }
    });
} catch (e) {
    console.error("Error reading .env.local", e);
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey ? 'Found' : 'Missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContent() {
    const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('section_id', 'home_hero');

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        console.log('Home Hero Content:', JSON.stringify(data, null, 2));

        if (data && data.length > 0) {
            const content = data[0].content;
            console.log("------------------------------------------------");
            console.log("Analyzed Content:");
            if (Array.isArray(content)) {
                console.log("Type: Array");
                console.log("Items:", content.length);
                content.forEach((c, i) => {
                    console.log(`[${i}] VideoSrc: '${c.videoSrc || ''}'`);
                    console.log(`[${i}] DesktopSrc: '${c.desktopSrc || ''}'`);
                });
            } else {
                console.log("Type: Object");
                console.log("VideoSrc:", content.videoSrc);
                console.log("DesktopSrc:", content.desktopSrc);
            }
        } else {
            console.log("NO DATA FOUND for 'home_hero'");
        }
    }
}

checkContent();
