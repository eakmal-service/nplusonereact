
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateCategoryImages() {
    console.log('Starting category image update...');

    const updates = [
        {
            keywords: ['Women', "Women's", 'Womens'],
            newImage: '/images/categories/17670080328782.webp'
        },
        {
            keywords: ['Kid', "Kid's", 'Kids'],
            newImage: '/images/categories/dcnyqzoexbfsn6tpfmth.webp'
        },
        {
            keywords: ['Men', "Men's", 'Mens'],
            newImage: '/images/categories/tvpdbbyrrjmzjrxuwlwe.webp'
        }
    ];

    // 1. Fetch all level-0 categories to find the correct IDs
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, image_url')
        .eq('level', 0);

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    console.log(`Found ${categories.length} top-level categories:`);
    categories.forEach(c => console.log(` - ${c.name} (ID: ${c.id})`));

    for (const update of updates) {
        // Find matching category
        const category = categories.find(c => {
            const match = update.keywords.some(k => c.name.toLowerCase().includes(k.toLowerCase()));
            // Prevent "Men" matching "Women"
            if (match && update.keywords.includes('Men') && c.name.toLowerCase().includes('women')) {
                return false;
            }
            // Prevent "Men" matching "Women" via "Mens" if relevant, but "Women" covers it.
            // Also ensure we don't match "Menthol" or something if that existed, but "Women" is the main culprit.
            return match;
        });

        if (category) {
            console.log(`Found category: "${category.name}" (ID: ${category.id}). Updating image...`);
            console.log(`Current image: ${category.image_url}`);
            console.log(`New image: ${update.newImage}`);

            const { error: updateError } = await supabase
                .from('categories')
                .update({ image_url: update.newImage })
                .eq('id', category.id);

            if (updateError) {
                console.error(`Failed to update ${category.name}:`, updateError);
            } else {
                console.log(`Successfully updated ${category.name}!`);
            }
        } else {
            console.warn(`Could not find a category matching keywords: ${update.keywords.join(', ')}`);
        }
    }

    console.log('Update process complete.');
}

updateCategoryImages();
