import { Category, CollectionItem, Product } from "../types";

// Categories for the main category grid
export const categories: Category[] = [
  {
    id: 1,
    name: 'SUIT SET',
    title: 'SUIT SET',
    image: '/images/categories/17670080328782.webp',
    link: '/suit-set',
    alt: 'Suit Sets'
  },
  {
    id: 2,
    name: 'WESTERN DRESS',
    title: 'WESTERN DRESS',
    image: '/images/categories/17670078826332.webp',
    link: '/western-dress',
    alt: 'Western Dresses'
  },
  {
    id: 3,
    name: 'CO-ORD SET',
    title: 'CO-ORD SET',
    image: '/images/categories/17670079057732.webp',
    link: '/co-ord-sets',
    alt: 'Co-ord Sets'
  },
  {
    id: 4,
    name: 'LEHENGA',
    title: 'LEHENGA',
    image: '/images/categories/17670079000862.webp',
    link: '/lehenga',
    alt: 'Lehengas'
  },
  {
    id: 5,
    name: 'INDI-WESTERN',
    title: 'INDI-WESTERN',
    image: '/images/categories/17670078974382.webp',
    link: '/indi-western',
    alt: 'Indi-Western'
  },
  {
    id: 6,
    name: 'UNSTICHED SET',
    title: 'UNSTICHED SET',
    image: '/images/categories/17670078888742.webp',
    link: '/unstiched-set',
    alt: 'Unstiched Sets'
  }
];

// Collection items for the collection slider
export const collectionItems: CollectionItem[] = [
  {
    title: 'DENIMWEAR',
    image: '/images/collections/1.png',
    link: '/night-bottoms',
    alt: 'Denimwear Collection'
  },
  {
    title: 'INDIGO CHRONICALS',
    image: '/images/collections/2.png',
    link: '/tshirt-top',
    alt: 'Indigo Chronicals Collection'
  },
  {
    title: 'EVERYDAY GRACE',
    image: '/images/collections/3.png',
    link: '/co-ord-sets',
    alt: 'Everyday Grace Collection'
  },
  {
    title: 'ONLINE EXCLUSIVE',
    image: '/images/collections/4.png',
    link: '/tshirt-top',
    alt: 'Online Exclusive Collection'
  },
  {
    title: 'Short Kurta',
    image: '/images/collections/5.png',
    link: '/co-ord-sets',
    alt: 'Short Kurta Collection'
  },
  {
    title: 'CASUAL CHIC',
    image: '/images/collections/6.png',
    link: '/tshirt-top',
    alt: 'Casual Chic Collection'
  },
  {
    title: 'SUMMER VIBES',
    image: '/images/collections/7.png',
    link: '/tshirt-top',
    alt: 'Summer Vibes Collection'
  },
  {
    title: 'ETHNIC FUSION',
    image: '/images/collections/8.png',
    link: '/co-ord-sets',
    alt: 'Ethnic Fusion Collection'
  }
];

// Recommended products data
export const recommendedProducts: Product[] = [
  {
    id: 1,
    title: 'OFF-WHITE AND BLACK COTTON PRINTED TIERED DRESS',
    image: '/images/products/product-1/115998d5-47c8-4143-ba49-17351e01b3b3_PicCopilot_b131a.png',
    price: '₹3,999',
    originalPrice: '₹5,999',
    discount: '30% OFF',
    link: '/product/1',
    alt: 'Off-White and Black Cotton Printed Tiered Dress',
    badge: 'Sale',
    description: 'This elegant piece features premium cotton fabric with intricate printed details. Perfect for both casual and formal occasions.',
    colors: [
      { name: 'Off-White-Black', color: '#f8f4e3' }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    thumbnails: [
      { url: '/images/products/product-1/115998d5-47c8-4143-ba49-17351e01b3b3_PicCopilot_b131a.png', alt: 'Front view' },
      { url: '/images/products/product-1/115998d5-47c8-4143-ba49-17351e01b3b3_PicCopilot_dfdb4.png', alt: 'Back view' },
      { url: '/images/products/product-1/9be1af35-6d6c-4f34-9d9f-5f63188e1fca_PicCopilot_81ee1.png', alt: 'Side view' },
      { url: '/images/products/product-1/image-13_PicCopilot_2d726.png', alt: 'Detail view' }
    ]
  },
  {
    id: 2,
    title: 'Pink Cotton Floral Strappy Straight Suit Set',
    image: '/images/products/product-2/House_of_Chikankari_Tamara_Chikankari_Mulmul_Straight_Kurta_4_PicCopilot_4bbec.png',
    price: '₹5,995',
    link: '/product/2',
    alt: 'Pink Cotton Floral Strappy Straight Suit Set',
    category: 'suit-set',
    description: 'Beautiful pink cotton suit set featuring floral prints and a comfortable strappy design.',
    colors: [
      { name: 'Pink-Floral', color: '#ffb6c1' }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    thumbnails: [
      { url: '/images/products/product-2/House_of_Chikankari_Tamara_Chikankari_Mulmul_Straight_Kurta_4_PicCopilot_4bbec.png', alt: 'Front view' },
      { url: '/images/products/product-2/House_of_Chikankari_Tamara_Chikankari_Mulmul_Straight_Kurta_4_PicCopilot_9da7a.png', alt: 'Back view' },
      { url: '/images/products/product-2/House_of_Chikankari_Tamara_Chikankari_Mulmul_Straight_Kurta_4_PicCopilot_d6d96.png', alt: 'Side view' },
      { url: '/images/products/product-2/House_of_Chikankari_Tamara_Chikankari_Mulmul_Straight_Kurta_4_PicCopilot_e8a16.png', alt: 'Detail view' }
    ]
  },
  {
    id: 3,
    title: 'Off-White Cotton Embroidered Flared Suit Set',
    image: '/products/3/female_76_1-370.png.avif',
    price: '₹15,950',
    link: '/product/3',
    alt: 'Off-White Cotton Embroidered Flared Suit Set',
    category: 'suit-set',
    description: 'Elegant off-white cotton suit with beautiful embroidery and a comfortable flared design.',
    colors: [
      { name: 'Off-White', color: '#f7f7f7' }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    thumbnails: [
      { url: '/products/3/female_76_1-370.png.avif', alt: 'Front view' },
      { url: '/products/3/female_76_2-371.png.avif', alt: 'Back view' },
      { url: '/products/3/female_76_3-372.png.avif', alt: 'Side view' }
    ]
  },
  {
    id: 4,
    title: 'Beige and Teal Pure Cotton Straight Kurta Set',
    image: '/products/4/female_1006_01-21.png.avif',
    price: '₹3,299',
    originalPrice: '₹4,999',
    discount: '34% OFF',
    link: '/product/4',
    alt: 'Beige and Teal Pure Cotton Straight Kurta Set',
    badge: 'Sale',
    description: 'A comfortable and stylish straight kurta set made with pure cotton in beautiful beige and teal colors.',
    colors: [
      { name: 'Beige-Teal', color: '#f5f5dc' }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    thumbnails: [
      { url: '/products/4/female_1006_01-21.png.avif', alt: 'Front view' },
      { url: '/products/4/female_1006_02-22.png.avif', alt: 'Back view' },
      { url: '/products/4/female_1006_03-23.png.avif', alt: 'Side view' },
      { url: '/products/4/female_1006_04-24.png.avif', alt: 'Detail view' }
    ]
  },
  {
    id: 5,
    title: 'Dull Pink Embroidered Straight Suit Set',
    image: '/products/5/female_1013_01-45.png.avif',
    price: '₹4,599',
    link: '/product/5',
    alt: 'Dull Pink Embroidered Straight Suit Set',
    description: 'Elegant dull pink suit set with detailed embroidery and a classic straight cut design.',
    colors: [
      { name: 'Dull-Pink', color: '#d8a0a6' }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    thumbnails: [
      { url: '/products/5/female_1013_01-45.png.avif', alt: 'Front view' },
      { url: '/products/5/female_1013_02-46.png.avif', alt: 'Back view' },
      { url: '/products/5/female_1013_03-47.png.avif', alt: 'Side view' },
      { url: '/products/5/female_1013_04-48.png.avif', alt: 'Detail view' }
    ]
  },
  {
    id: 6,
    title: 'Blue Chanderi Silk Printed Kurta Set',
    image: '/products/6/female_1036_01-129.png.avif',
    price: '₹5,699',
    link: '/product/6',
    alt: 'Blue Chanderi Silk Printed Kurta Set',
    badge: 'Online Exclusive',
    description: 'Premium blue Chanderi silk kurta set with elegant prints and premium quality finish.',
    colors: [
      { name: 'Blue-Print', color: '#4169e1' }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    thumbnails: [
      { url: '/products/6/female_1036_01-129.png.avif', alt: 'Front view' },
      { url: '/products/6/female_1036_02-130.png.avif', alt: 'Back view' },
      { url: '/products/6/female_1036_03-131.png.avif', alt: 'Side view' },
      { url: '/products/6/female_1036_04-132.png.avif', alt: 'Detail view' }
    ]
  },
  {
    id: 7,
    title: 'Yellow Linen Embroidered Sharara Suit',
    image: '/products/7/female_scene1_1.png.avif',
    price: '₹5,250',
    originalPrice: '₹8,250',
    discount: '35% OFF',
    link: '/product/7',
    alt: 'Yellow Linen Embroidered Sharara Suit',
    badge: 'Sale',
    description: 'Vibrant yellow linen sharara suit featuring beautiful embroidery and a comfortable fit.',
    colors: [
      { name: 'Yellow-Embroidered', color: '#ffd700' }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    thumbnails: [
      { url: '/products/7/female_scene1_1.png.avif', alt: 'Front view' },
      { url: '/products/7/female_scene1_2.png.avif', alt: 'Back view' },
      { url: '/products/7/female_scene1_3.png.avif', alt: 'Side view' },
      { url: '/products/7/female_scene1_4.png.avif', alt: 'Detail view' }
    ]
  },
  {
    id: 8,
    title: 'Teal Rayon Printed Straight Kurta Set',
    image: '/products/8/female_Spr7_1.png.avif',
    price: '₹4,299',
    link: '/product/8',
    alt: 'Teal Rayon Printed Straight Kurta Set',
    description: 'Comfortable and stylish teal rayon kurta set with beautiful prints and a straight cut design.',
    colors: [
      { name: 'Teal-Print', color: '#008080' }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    thumbnails: [
      { url: '/products/8/female_Spr7_1.png.avif', alt: 'Front view' },
      { url: '/products/8/female_Spr7_2.png.avif', alt: 'Back view' },
      { url: '/products/8/female_Spr7_3.png.avif', alt: 'Side view' },
      { url: '/products/8/female_Spr7_4.png.avif', alt: 'Detail view' }
    ]
  },
  {
    id: 9,
    title: 'Rayon Slub 3-Piece Suit Set (D3P_1)',
    image: '/products/D3P_1/3.png',
    price: '₹325',
    link: '/product/9',
    alt: 'Rayon Slub 3-Piece Suit Set with Chanderi Dupatta',
    description: 'Beautiful 3-piece suit set featuring Rayon Slub fabric for Top and Bottom, and a Chanderi Dupatta with Digital Print. Design No.: D3P_1.',
    category: 'suit-set',
    fabric: 'Rayon Slub',
    colorOptions: [
      { name: 'Black', code: '#000000' },
      { name: 'Silver', code: '#C2C2C1' }
    ],
    fabricDupattaStole: 'Chanderi with Digital Print',
    bottomFabric: 'Rayon Slub',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    thumbnails: [
      { url: '/products/D3P_1/3.png', alt: 'Main View' },
      { url: '/products/D3P_1/2.png', alt: 'Front View' },
      { url: '/products/D3P_1/1.png', alt: 'Back View' },
      { url: '/products/D3P_1/5.png', alt: 'Detail 1' },
      { url: '/products/D3P_1/7.png', alt: 'Detail 2' },
      { url: '/products/D3P_1/6.png', alt: 'Detail 3' }
    ],
    // Store images for compatibility
    images: [
      { url: '/products/D3P_1/3.png', alt: 'Main View' },
      { url: '/products/D3P_1/2.png', alt: 'Front View' },
      { url: '/products/D3P_1/1.png', alt: 'Back View' },
      { url: '/products/D3P_1/5.png', alt: 'Detail 1' },
      { url: '/products/D3P_1/7.png', alt: 'Detail 2' },
      { url: '/products/D3P_1/6.png', alt: 'Detail 3' }
    ],
    sizeChartHtml: `
<table class="min-w-full text-sm bg-gray-800 border-collapse mb-6">
<thead>
  <tr class="border-b border-gray-700">
    <th class="py-3 px-4 text-left font-medium text-white">Top/Kurti Size</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">S</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">M</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">L</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">XL</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">XXL</th>
  </tr>
</thead>
<tbody>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Bust (in)</td>
    <td class="py-2 px-4 text-gray-300">36</td>
    <td class="py-2 px-4 text-gray-300">38</td>
    <td class="py-2 px-4 text-gray-300">40</td>
    <td class="py-2 px-4 text-gray-300">42</td>
    <td class="py-2 px-4 text-gray-300">44</td>
  </tr>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Waist (in)</td>
    <td class="py-2 px-4 text-gray-300">34</td>
    <td class="py-2 px-4 text-gray-300">36</td>
    <td class="py-2 px-4 text-gray-300">38</td>
    <td class="py-2 px-4 text-gray-300">40</td>
    <td class="py-2 px-4 text-gray-300">42</td>
  </tr>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Hip (in)</td>
    <td class="py-2 px-4 text-gray-300">39</td>
    <td class="py-2 px-4 text-gray-300">41</td>
    <td class="py-2 px-4 text-gray-300">43</td>
    <td class="py-2 px-4 text-gray-300">45</td>
    <td class="py-2 px-4 text-gray-300">47</td>
  </tr>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Shoulder (in)</td>
    <td class="py-2 px-4 text-gray-300">14</td>
    <td class="py-2 px-4 text-gray-300">14.5</td>
    <td class="py-2 px-4 text-gray-300">15</td>
    <td class="py-2 px-4 text-gray-300">15.5</td>
    <td class="py-2 px-4 text-gray-300">16</td>
  </tr>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Length (in)</td>
    <td class="py-2 px-4 text-gray-300">45</td>
    <td class="py-2 px-4 text-gray-300">45</td>
    <td class="py-2 px-4 text-gray-300">45</td>
    <td class="py-2 px-4 text-gray-300">45</td>
    <td class="py-2 px-4 text-gray-300">45</td>
  </tr>
</tbody>
</table>

<h4 class="font-bold text-white mb-2">Bottom (Pant / Palazzo)</h4>
<table class="min-w-full text-sm bg-gray-800 border-collapse mb-6">
<thead>
  <tr class="border-b border-gray-700">
    <th class="py-3 px-4 text-left font-medium text-white">Measurements (in)</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">S</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">M</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">L</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">XL</th>
    <th class="py-3 px-4 text-left font-medium text-gray-300">XXL</th>
  </tr>
</thead>
<tbody>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Waist Full Elastic</td>
    <td class="py-2 px-4 text-gray-300">28</td>
    <td class="py-2 px-4 text-gray-300">30</td>
    <td class="py-2 px-4 text-gray-300">32</td>
    <td class="py-2 px-4 text-gray-300">34</td>
    <td class="py-2 px-4 text-gray-300">36</td>
  </tr>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Waist Half Elastic</td>
    <td class="py-2 px-4 text-gray-300">30</td>
    <td class="py-2 px-4 text-gray-300">32</td>
    <td class="py-2 px-4 text-gray-300">34</td>
    <td class="py-2 px-4 text-gray-300">36</td>
    <td class="py-2 px-4 text-gray-300">38</td>
  </tr>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Hip</td>
    <td class="py-2 px-4 text-gray-300">42</td>
    <td class="py-2 px-4 text-gray-300">43</td>
    <td class="py-2 px-4 text-gray-300">44</td>
    <td class="py-2 px-4 text-gray-300">45</td>
    <td class="py-2 px-4 text-gray-300">46</td>
  </tr>
  <tr class="border-b border-gray-700">
    <td class="py-2 px-4 font-medium text-white">Bottom Length</td>
    <td class="py-2 px-4 text-gray-300">38</td>
    <td class="py-2 px-4 text-gray-300">38</td>
    <td class="py-2 px-4 text-gray-300">38</td>
    <td class="py-2 px-4 text-gray-300">38</td>
    <td class="py-2 px-4 text-gray-300">38</td>
  </tr>
</tbody>
</table>

<div class="bg-gray-800 p-4 rounded border border-gray-700">
  <h4 class="font-bold text-white mb-2">Dupatta Details</h4>
  <p class="text-gray-300"><span class="font-medium text-white">Length:</span> Standard 2 meters</p>
  <p class="text-gray-300"><span class="font-medium text-white">Width:</span> 24-32 inches</p>
</div>
    `
  }
];

// Sample recently viewed products
export const sampleRecentlyViewed: Product[] = [
  {
    id: 101,
    title: 'Off-White and Blue Cotton Floral Tiered Dress',
    image: 'https://placehold.co/600x800/lightskyblue/white?text=Tiered+Dress',
    price: '₹2,999',
    link: '/product/101',
    alt: 'Off-White and Blue Cotton Floral Tiered Dress'
  },
  {
    id: 102,
    title: 'Multi-coloured Georgette Tropical Printed A-Line Kurta',
    image: 'https://placehold.co/600x800/purple/white?text=A-Line+Kurta',
    price: '₹1,609',
    originalPrice: '₹2,299',
    discount: '30% OFF',
    link: '/product/102',
    alt: 'Multi-coloured Georgette Tropical Printed A-Line Kurta',
    badge: 'Sale'
  },
  {
    id: 103,
    title: 'Pink Pure Cotton Floral Straight Kurta',
    image: 'https://placehold.co/600x800/hotpink/white?text=Straight+Kurta',
    price: '₹1,799',
    link: '/product/103',
    alt: 'Pink Pure Cotton Floral Straight Kurta'
  },
  {
    id: 104,
    title: 'Emerald Green Silk Festive Tiered Anarkali Dress',
    image: 'https://placehold.co/600x800/emerald/white?text=Anarkali',
    price: '₹10,500',
    link: '/product/104',
    alt: 'Emerald Green Silk Festive Tiered Anarkali Dress'
  },
  {
    id: 105,
    title: 'White and Black Cotton Printed Anarkali Kurta Set',
    image: 'https://placehold.co/600x800/ivory/black?text=Printed+Kurta',
    price: '₹4,599',
    link: '/product/105',
    alt: 'White and Black Cotton Printed Anarkali Kurta Set'
  }
];

// Shopping greetings for popup
export const shoppingGreetings = [
  "Ready to explore our latest collection?",
  "Discover stylish deals waiting for you!",
  "Welcome back to NPlusOne shopping!",
  "Your fashion journey continues here!",
  "New arrivals just for your style!",
  "Find your perfect fashion match today!",
  "Exclusive deals waiting in your cart!",
  "Shop the season's hottest trends now!"
]; 