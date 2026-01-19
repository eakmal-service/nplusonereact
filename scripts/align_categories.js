const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function alignCategories() {
    console.log("Aligning categories...");

    // 1. Fix Co-ord Sets -> Co-ord Set
    const { error: err1 } = await supabase
        .from('categories')
        .update({ name: 'Co-ord Set', slug: 'co-ord-set' })
        .eq('slug', 'co-ord-sets');

    if (err1) console.error("Error updating Co-ord Sets:", err1);
    else console.log("Updated Co-ord Sets -> Co-ord Set");

    // 2. Fix KID'S WEAR -> KIDS WEAR
    const { error: err2 } = await supabase
        .from('categories')
        .update({ name: 'KIDS WEAR', slug: 'kids-wear' }) // active products have uppercase "KIDS WEAR" or normalized "kids-wear"
        .eq('slug', 'kids-wear');

    if (err2) console.error("Error updating KID'S WEAR:", err2);
    else console.log("Updated KID'S WEAR -> KIDS WEAR");

    // 3. Fix MEN'S WEAR -> MENS WEAR?
    // Products have "MENS WEAR" (No apostrophe?) - Wait, my debug output didn't show MENS WEAR in unique products list.
    // "Unique Categories in Products Table: [ 'CO-ORD SET', 'KIDS WEAR', 'SUIT SET' ]"
    // So there are NO active Men's Wear products?
    // If there were, they would likely be MENS WEAR based on style.

    // Let's check subcategories just in case.
    // "Unique Subcategories in Products Table (Reference): []"

    console.log("Alignment complete.");
}

alignCategories();
