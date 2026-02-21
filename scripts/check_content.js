const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jdwzdwkkmqaaycgjuipn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkContent() {
    const { data, error } = await supabase
        .from('website_content')
        .select('*');

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Website Content Rows:", data.length);
        data.forEach(row => {
            console.log(`\nSection: ${row.section_id}`);
            console.log(`Content Type: ${Array.isArray(row.content) ? 'Array' : typeof row.content}`);
            console.log(`Content Length: ${Array.isArray(row.content) ? row.content.length : 'N/A'}`);
            // Show snippet
            console.log(JSON.stringify(row.content, null, 2));
        });
    }
}

checkContent();
