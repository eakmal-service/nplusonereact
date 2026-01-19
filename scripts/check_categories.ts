
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCategoryHierarchy() {
    console.log('--- Checking All Categories ---');
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, slug, level, parent_id')
        .order('level', { ascending: true })
        .order('name', { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    // Find 'Kids' related categories
    const kidsRelated = categories.filter(c =>
        c.name.toLowerCase().includes('kid') ||
        c.name.toLowerCase().includes('boy') ||
        c.name.toLowerCase().includes('girl')
    );

    console.table(kidsRelated);
}

checkCategoryHierarchy();
