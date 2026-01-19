const { createClient } = require('@supabase/supabase-js');

// Use the same credentials as other scripts
const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const categoryHierarchy = [
    {
        id: 'women', // We'll map these IDs to UUIDs
        label: "WOMEN'S WEAR",
        children: [
            {
                id: 'suit-set',
                label: 'Suit Set',
                value: 'SUIT SET',
                children: [{ id: 'all-suit-set', label: 'All Suit Sets', value: 'SUIT SET' }]
            },
            {
                id: 'western-dress',
                label: 'Western Wear',
                value: 'WESTERN WEAR',
                children: [{ id: 'all-western', label: 'All Western Wear', value: 'WESTERN WEAR' }]
            },
            {
                id: 'co-ord-sets',
                label: 'Co-ord Sets',
                value: 'CO-ORD SET',
                children: [{ id: 'all-coord', label: 'All Co-ord Sets', value: 'CO-ORD SET' }]
            },
            {
                id: 'indi-western',
                label: 'Indo-Western',
                value: 'INDO-WESTERN',
                children: [{ id: 'all-indi', label: 'All Indo-Western', value: 'INDO-WESTERN' }]
            },
        ]
    },
    {
        id: 'men',
        label: "MEN'S WEAR",
        children: [
            {
                id: 'mens',
                label: "MEN'S WEAR",
                value: 'MENS WEAR',
                children: [{ id: 'all-mens', label: "All Men's Wear", value: 'MENS WEAR' }]
            }
        ]
    },
    {
        id: 'kids',
        label: "KID'S WEAR",
        children: [
            {
                id: 'boys',
                label: "BOY'S WEAR",
                value: 'BOYS WEAR',
                children: [{ id: 'all-boys', label: "All Boy's Wear", value: 'BOYS WEAR' }]
            },
            {
                id: 'girls',
                label: "GIRL'S WEAR",
                value: 'GIRLS WEAR',
                children: [{ id: 'all-girls', label: "All Girl's Wear", value: 'GIRLS WEAR' }]
            }
        ]
    }
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function migrate() {
    console.log('Starting migration...');

    try {
        for (const superCat of categoryHierarchy) {
            console.log(`Processing Super Category: ${superCat.label}`);

            // Insert Super Category
            const { data: superData, error: superError } = await supabase
                .from('categories')
                .insert({
                    name: superCat.label,
                    slug: slugify(superCat.label),
                    level: 0,
                    is_visible: true,
                    display_order: 0
                })
                .select()
                .single();

            if (superError) {
                console.error(`Error inserting ${superCat.label}:`, superError.message);
                continue;
            }

            const superId = superData.id;

            if (superCat.children) {
                for (const parentCat of superCat.children) {
                    console.log(`  Processing Parent Category: ${parentCat.label}`);

                    // Insert Parent Category
                    const { data: parentData, error: parentError } = await supabase
                        .from('categories')
                        .insert({
                            name: parentCat.label,
                            slug: slugify(parentCat.label + '-' + parentCat.value), // Unique slug
                            level: 1,
                            is_visible: true,
                            parent_id: superId
                        })
                        .select()
                        .single();

                    if (parentError) {
                        console.error(`  Error inserting ${parentCat.label}:`, parentError.message);
                        continue;
                    }

                    const parentId = parentData.id;

                    if (parentCat.children) {
                        for (const childCat of parentCat.children) {
                            console.log(`    Processing Child Category: ${childCat.label}`);

                            // Insert Child Category
                            const { error: childError } = await supabase
                                .from('categories')
                                .insert({
                                    name: childCat.label,
                                    slug: slugify(childCat.label + '-' + parentCat.value + '-' + childCat.id),
                                    level: 2,
                                    is_visible: true,
                                    parent_id: parentId
                                });

                            if (childError) {
                                console.error(`    Error inserting ${childCat.label}:`, childError.message);
                            }
                        }
                    }
                }
            }
        }
        console.log('Migration complete!');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate();
