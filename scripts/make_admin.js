#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeFirstUserAdmin() {
    console.log('Looking for users to make admin...\n');

    // Get all profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.log('❌ No users found in profiles table!');
        console.log('\n📝 You need to:');
        console.log('1. Go to https://nplusonefashion.com/');
        console.log('2. Click "Sign Up" and create an account');
        console.log('3. Run this script again to make that user an admin');
        process.exit(0);
    }

    console.log('Found users:');
    profiles.forEach((p, i) => {
        console.log(`${i + 1}. ${p.email || 'No email'} - ${p.full_name || 'No name'} - Admin: ${p.is_admin || false}`);
    });

    // Make the first user admin
    const firstUser = profiles[0];

    if (firstUser.is_admin) {
        console.log(`\n✅ User ${firstUser.email} is already an admin!`);
        process.exit(0);
    }

    console.log(`\n📝 Making ${firstUser.email || 'first user'} an admin...`);

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', firstUser.id);

    if (updateError) {
        console.error('❌ Error:', updateError);
    } else {
        console.log(`✅ Successfully made ${firstUser.email || 'user'} an admin!`);
        console.log(`\nYou can now access the admin dashboard at:`);
        console.log(`https://nplusonefashion.com/admin/dashboard`);
    }

    process.exit(0);
}

makeFirstUserAdmin().catch(console.error);
