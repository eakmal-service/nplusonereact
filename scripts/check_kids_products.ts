
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const boysProductIds = [
    '551c4d81-a2e8-4202-ac47-1541585a51cc',
    'b5d393f4-d41f-40f4-9203-820f7a52b457'
];

const girlsProductIds = [
    'cfce0631-bcbc-4209-81fa-a02284963b93',
    'eeadb7d4-f549-407d-b5ef-c2e779bfaa4c',
    'a0def249-acdd-46c0-933c-32ccea2463a0',
    '51cb1cbd-4553-4f7f-bd0a-a70ca412b8e4',
    '5d2059f8-74be-43f8-9273-12a63bc896aa',
    'f0421dab-15fb-4a34-9c04-6e72230a50ce',
    'e4ca48c7-1240-4585-97ab-86b81dff5195',
    'fcfdb2d5-494a-41a9-8bcb-82fea7e040a6'
];

async function checkProducts() {
    console.log('--- Checking Boys Products ---');
    const { data: boys, error: err1 } = await supabase
        .from('products')
        .select('id, title, category, subcategory')
        .in('id', boysProductIds);

    if (err1) console.error(err1);
    else console.table(boys);

    console.log('\n--- Checking Girls Products ---');
    const { data: girls, error: err2 } = await supabase
        .from('products')
        .select('id, title, category, subcategory')
        .in('id', girlsProductIds);

    if (err2) console.error(err2);
    else console.table(girls);
}

checkProducts();
