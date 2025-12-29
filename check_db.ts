
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('id, title, category, status');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Total Products:', data.length);
  console.log('Categories found:', [...new Set(data.map(p => p.category))]);
  console.log('Heuristically checking for Suit Sets:');
  const suits = data.filter(p => p.category?.toLowerCase().includes('suit'));
  console.log(JSON.stringify(suits, null, 2));
}

checkProducts();

