#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminUsers() {
    console.log('Checking for admin users...\n');

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, is_admin, full_name')
        .eq('is_admin', true);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (profiles && profiles.length > 0) {
        console.log('✅ Admin users found:');
        profiles.forEach(p => {
            console.log(`  - ${p.email || 'No email'} (${p.full_name || 'No name'}) - ID: ${p.id}`);
        });
    } else {
        console.log('❌ No admin users found in database!');
        console.log('\nTo create an admin user:');
        console.log('1. Sign up at https://nplusonefashion.com/');
        console.log('2. Get your user ID from the auth.users table');
        console.log('3. Run: UPDATE profiles SET is_admin = true WHERE id = \'YOUR_USER_ID\'');
    }

    process.exit(0);
}

checkAdminUsers().catch(console.error);
