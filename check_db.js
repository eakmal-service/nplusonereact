
const fs = require('fs');

const envConfig = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envConfig.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envConfig.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

async function run() {
  const url = `${SUPABASE_URL}/rest/v1/products?select=id,title,category,status`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!res.ok) {
    console.error('Error fetching:', await res.text());
    return;
  }
  
  const data = await res.json();
  console.log('Total Products:', data.length);
  const categories = {};
  data.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  console.log('Categories Count:', categories);
  
  const suits = data.filter(p => (p.category || '').toLowerCase().includes('suit'));
  console.log('Suit products found:', suits.length);
  if(suits.length > 0) console.log(suits.slice(0, 5));
}

run();

