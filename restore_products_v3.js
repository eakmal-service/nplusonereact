
const fs = require('fs');

const envConfig = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envConfig.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envConfig.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

const productsToRestore = [
  {
    title: 'Pink Cotton Floral Strappy Straight Suit Set',
    image_url: '/images/products/product-2/House_of_Chikankari_Tamara_Chikankari_Mulmul_Straight_Kurta_4_PicCopilot_4bbec.png',
    price: 5995,
    sale_price: null,
    category: 'suit-set',
    description: 'Beautiful pink cotton suit set featuring floral prints and a comfortable strappy design.',
    status: 'active',
    stock_quantity: 100
  },
  {
    title: 'Off-White Cotton Embroidered Flared Suit Set',
    image_url: '/products/3/female_76_1-370.png.avif',
    price: 15950,
    sale_price: null,
    category: 'suit-set',
    description: 'Elegant off-white cotton suit with beautiful embroidery and a comfortable flared design.',
    status: 'active',
    stock_quantity: 100
  },
  {
    title: 'Beige and Teal Pure Cotton Straight Kurta Set',
    image_url: '/products/4/female_1006_01-21.png.avif',
    price: 4999,
    sale_price: 3299,
    category: 'suit-set',
    description: 'A comfortable and stylish straight kurta set made with pure cotton in beautiful beige and teal colors.',
    status: 'active',
    stock_quantity: 100
  },
  {
    title: 'Dull Pink Embroidered Straight Suit Set',
    image_url: '/products/5/female_1013_01-45.png.avif',
    price: 4599,
    sale_price: null,
    category: 'suit-set',
    description: 'Elegant dull pink suit set with detailed embroidery and a classic straight cut design.',
    status: 'active',
    stock_quantity: 100
  },
  {
    title: 'Blue Chanderi Silk Printed Kurta Set',
    image_url: '/products/6/female_1036_01-129.png.avif',
    price: 5699,
    sale_price: null,
    category: 'suit-set',
    description: 'Premium blue Chanderi silk kurta set with elegant prints and premium quality finish.',
    status: 'active',
    stock_quantity: 100
  },
  {
    title: 'Yellow Linen Embroidered Sharara Suit',
    image_url: '/products/7/female_scene1_1.png.avif',
    price: 8250,
    sale_price: 5250,
    category: 'suit-set',
    description: 'Vibrant yellow linen sharara suit featuring beautiful embroidery and a comfortable fit.',
    status: 'active',
    stock_quantity: 100
  },
  {
    title: 'Teal Rayon Printed Straight Kurta Set',
    image_url: '/products/8/female_Spr7_1.png.avif',
    price: 4299,
    sale_price: null,
    category: 'suit-set',
    description: 'Comfortable and stylish teal rayon kurta set with beautiful prints and a straight cut design.',
    status: 'active',
    stock_quantity: 100
  },
  {
    title: 'Rayon Slub 3-Piece Suit Set (D3P_1)',
    image_url: '/products/D3P_1/3.png',
    price: 325,
    sale_price: null,
    category: 'suit-set',
    description: 'Beautiful 3-piece suit set featuring Rayon Slub fabric for Top and Bottom, and a Chanderi Dupatta with Digital Print.',
    status: 'active',
    stock_quantity: 100
  }
];

async function run() {
  console.log('Restoring products (Attempt 3)...');
  const url = `${SUPABASE_URL}/rest/v1/products`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(productsToRestore)
  });

  if (!res.ok) {
    console.error('Error restoring:', await res.text());
  } else {
    console.log('Successfully restored products');
  }
}

run();

