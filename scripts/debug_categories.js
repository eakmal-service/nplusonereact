const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
// Using the service key to bypass RLS if needed, though public read is likely enabled
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function debugCategories() {
    console.log("Fetching unique product categories...");
    const { data: products, error: pError } = await supabase
        .from('products')
        .select('category, subcategory, title')
        .eq('status', 'active');

    if (pError) {
        console.error("Error fetching products:", pError);
        return;
    }

    const productCategories = new Set();
    const productSubcategories = new Set();
    products.forEach(p => {
        if (p.category) productCategories.add(p.category);
        if (p.subcategory) productSubcategories.add(p.subcategory);
    });

    console.log("\nUnique Categories in Products Table:");
    console.log([...productCategories].sort());

    console.log("\nUnique Subcategories in Products Table (Reference):");
    console.log([...productSubcategories].sort());

    console.log("\nFetching DB Categories...");
    const { data: categories, error: cError } = await supabase
        .from('categories')
        .select('name, slug, level');

    if (cError) {
        console.error("Error fetching categories:", cError);
        return;
    }

    console.log("\nCategories in 'categories' Table:");
    categories.forEach(c => {
        console.log(`Level ${c.level}: "${c.name}" (Slug: ${c.slug})`);
    });

    // Check for normalization matches
    console.log("\n--- Checking Mismatches ---");
    [...productCategories].forEach(pCat => {
        const normP = pCat.toLowerCase().trim().replace(/\s+/g, '-');
        const match = categories.find(c => {
            const normC = c.name.toLowerCase().trim().replace(/\s+/g, '-');
            return normC === normP;
        });

        if (match) {
            console.log(`[MATCH] Product "${pCat}" -> Category "${match.name}" (Slug: ${match.slug})`);
        } else {
            console.log(`[MISMATCH] Product "${pCat}" has NO matching Category name (Normalized: ${normP})`);
        }
    });

    // Also check logical fallback for slugs like 'suit-set'
    // If URL is /category/suit-set -> Category Name is "Suit Set" -> Context Filters for "suit-set"
}

debugCategories();
