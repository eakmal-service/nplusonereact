const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Service Role Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAdmins() {
    console.log('Fetching admin users...');

    // 1. Get all profiles where is_admin is true
    const { data: adminProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_admin')
        .eq('is_admin', true);

    if (profileError) {
        console.error('Error fetching admin profiles:', profileError);
        return;
    }

    if (!adminProfiles || adminProfiles.length === 0) {
        console.log('No admin profiles found in the database.');
        return;
    }

    const adminIds = adminProfiles.map(p => p.id);
    console.log(`Found ${adminIds.length} admin profiles.`);

    // 2. Get user details from Auth
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('Error fetching users from Auth:', userError);
        return;
    }

    // 3. Match and display
    const adminUsers = users.filter(u => adminIds.includes(u.id));

    console.log('\n--- Admin Users ---');
    adminUsers.forEach(u => {
        console.log(`Email: ${u.email} (ID: ${u.id})`);
    });
    console.log('-------------------\n');

    console.log('--- specific Email Check ---');
    const targetEmails = ['nplusonefashion@gmail.com', 'support@nplusonefashion.com', 'Abduljalilmulla762@gmail.com', 'abduljalilmulla762@gmail.com'];
    targetEmails.forEach(email => {
        const user = users.find(u => u.email === email); // Case sensitive check in find, but typically emails are lowercase in DB
        // Let's also try case-insensitive finding
        const caseInsensitiveUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user) {
            const isAdmin = adminIds.includes(user.id);
            console.log(`Email: ${email} - Found EXACT (ID: ${user.id}) - Is Admin: ${isAdmin}`);
        } else if (caseInsensitiveUser) {
            const isAdmin = adminIds.includes(caseInsensitiveUser.id);
            console.log(`Email: ${email} - Found CASE-INSENSITIVE Match: ${caseInsensitiveUser.email} (ID: ${caseInsensitiveUser.id}) - Is Admin: ${isAdmin}`);
        } else {
            console.log(`Email: ${email} - Not Found in Auth Users`);
        }
    });
    console.log('----------------------------\n');

    console.log('Note: Passwords are securely hashed and cannot be retrieved.');
}

listAdmins();
