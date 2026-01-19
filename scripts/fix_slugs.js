const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function fixSlugs() {
    console.log('Fetching categories...');
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    console.log(`Found ${categories.length} categories. Updating slugs...`);

    for (const cat of categories) {
        // Generate new slug ONLY from name
        let newSlug = slugify(cat.name);

        // Manual overrides for cleaner URLs if needed
        if (cat.name === "Co-ord Sets") newSlug = "co-ord-sets";
        if (cat.name === "Suit Set") newSlug = "suit-set";
        if (cat.name === "Western Wear") newSlug = "western-wear";
        if (cat.name === "Indo-Western") newSlug = "indo-western";
        if (cat.name === "Boy's Wear") newSlug = "boys-wear";

        if (cat.slug !== newSlug) {
            console.log(`Updating "${cat.name}": ${cat.slug} -> ${newSlug}`);

            const { error: updateError } = await supabase
                .from('categories')
                .update({ slug: newSlug })
                .eq('id', cat.id);

            if (updateError) {
                console.error(`Error updating ${cat.name}:`, updateError.message);
            }
        }
    }
    console.log('Slug fix complete!');
}

fixSlugs();
