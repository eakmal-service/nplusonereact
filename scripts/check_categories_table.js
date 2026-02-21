const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jdwzdwkkmqaaycgjuipn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('level', 0); // Top level

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Dynamic Categories (Level 0) Count:", data.length);
        data.forEach(cat => console.log(`- ${cat.name}`));
    }
}

checkCategories();
