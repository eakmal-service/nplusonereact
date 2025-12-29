
const fs = require('fs');

const envConfig = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envConfig.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envConfig.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

const sizeChartHtml = `
<div class='mt-4'>
  <p class='mb-4'>Beautiful 3-piece suit set featuring Rayon Slub fabric for Top and Bottom, and a Chanderi Dupatta with Digital Print. Design No.: D3P_1.</p>
  
  <h4 class='font-bold text-white mb-2'>Top / Kurti Size Chart</h4>
  <table class='min-w-full text-sm bg-gray-800 border-collapse mb-6'>
    <thead>
      <tr class='border-b border-gray-700'>
        <th class='py-3 px-4 text-left font-medium text-white'>Top/Kurti Size</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>S</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>M</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>L</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>XL</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>XXL</th>
      </tr>
    </thead>
    <tbody>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Bust (in)</td>
        <td class='py-2 px-4 text-gray-300'>36</td>
        <td class='py-2 px-4 text-gray-300'>38</td>
        <td class='py-2 px-4 text-gray-300'>40</td>
        <td class='py-2 px-4 text-gray-300'>42</td>
        <td class='py-2 px-4 text-gray-300'>44</td>
      </tr>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Waist (in)</td>
        <td class='py-2 px-4 text-gray-300'>34</td>
        <td class='py-2 px-4 text-gray-300'>36</td>
        <td class='py-2 px-4 text-gray-300'>38</td>
        <td class='py-2 px-4 text-gray-300'>40</td>
        <td class='py-2 px-4 text-gray-300'>42</td>
      </tr>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Hip (in)</td>
        <td class='py-2 px-4 text-gray-300'>39</td>
        <td class='py-2 px-4 text-gray-300'>41</td>
        <td class='py-2 px-4 text-gray-300'>43</td>
        <td class='py-2 px-4 text-gray-300'>45</td>
        <td class='py-2 px-4 text-gray-300'>47</td>
      </tr>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Shoulder (in)</td>
        <td class='py-2 px-4 text-gray-300'>14</td>
        <td class='py-2 px-4 text-gray-300'>14.5</td>
        <td class='py-2 px-4 text-gray-300'>15</td>
        <td class='py-2 px-4 text-gray-300'>15.5</td>
        <td class='py-2 px-4 text-gray-300'>16</td>
      </tr>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Length (in)</td>
        <td class='py-2 px-4 text-gray-300'>45</td>
        <td class='py-2 px-4 text-gray-300'>45</td>
        <td class='py-2 px-4 text-gray-300'>45</td>
        <td class='py-2 px-4 text-gray-300'>45</td>
        <td class='py-2 px-4 text-gray-300'>45</td>
      </tr>
    </tbody>
  </table>

  <h4 class='font-bold text-white mb-2'>Bottom (Pant / Palazzo)</h4>
  <table class='min-w-full text-sm bg-gray-800 border-collapse mb-6'>
    <thead>
      <tr class='border-b border-gray-700'>
        <th class='py-3 px-4 text-left font-medium text-white'>Measurements (in)</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>S</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>M</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>L</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>XL</th>
        <th class='py-3 px-4 text-left font-medium text-gray-300'>XXL</th>
      </tr>
    </thead>
    <tbody>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Waist Full Elastic</td>
        <td class='py-2 px-4 text-gray-300'>28</td>
        <td class='py-2 px-4 text-gray-300'>30</td>
        <td class='py-2 px-4 text-gray-300'>32</td>
        <td class='py-2 px-4 text-gray-300'>34</td>
        <td class='py-2 px-4 text-gray-300'>36</td>
      </tr>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Waist Half Elastic</td>
        <td class='py-2 px-4 text-gray-300'>30</td>
        <td class='py-2 px-4 text-gray-300'>32</td>
        <td class='py-2 px-4 text-gray-300'>34</td>
        <td class='py-2 px-4 text-gray-300'>36</td>
        <td class='py-2 px-4 text-gray-300'>38</td>
      </tr>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Hip</td>
        <td class='py-2 px-4 text-gray-300'>42</td>
        <td class='py-2 px-4 text-gray-300'>43</td>
        <td class='py-2 px-4 text-gray-300'>44</td>
        <td class='py-2 px-4 text-gray-300'>45</td>
        <td class='py-2 px-4 text-gray-300'>46</td>
      </tr>
      <tr class='border-b border-gray-700'>
        <td class='py-2 px-4 font-medium text-white'>Bottom Length</td>
        <td class='py-2 px-4 text-gray-300'>38</td>
        <td class='py-2 px-4 text-gray-300'>38</td>
        <td class='py-2 px-4 text-gray-300'>38</td>
        <td class='py-2 px-4 text-gray-300'>38</td>
        <td class='py-2 px-4 text-gray-300'>38</td>
      </tr>
    </tbody>
  </table>

  <div class='bg-gray-800 p-4 rounded border border-gray-700'>
    <h4 class='font-bold text-white mb-2'>Dupatta Details</h4>
    <p class='text-gray-300'><span class='font-medium text-white'>Length:</span> Standard 2 meters</p>
    <p class='text-gray-300'><span class='font-medium text-white'>Width:</span> 24-32 inches</p>
  </div>
</div>
`;

const product = {
  title: 'Rayon Slub 3-Piece Suit Set (D3P_1)',
  // Using image 3 as main as per user folder structure intuition, or 2 as front. 
  // User sent ordered list. Let's use 3.png as main, 2.png as front.
  image_url: '/products/D3P_1/3.png', 
  price: 325,
  category: 'suit-set',
  description: sizeChartHtml,
  status: 'active',
  stock_quantity: 100
};

async function run() {
  console.log('Importing D3P_1...');
  const url = `${SUPABASE_URL}/rest/v1/products`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify([product])
  });

  if (!res.ok) {
    console.error('Error importing:', await res.text());
  } else {
    console.log('Successfully imported D3P_1');
  }
}

run();

