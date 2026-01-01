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
    name: 'Kids',
    title: 'Kids',
    image: '/images/categories/17670079000862.webp', // Using old Lehenga image as placeholder
    link: '/kids',
    alt: 'Kids Collection'
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
    name: 'man\'s',
    title: 'man\'s',
    image: '/images/categories/17670078888742.webp', // Using old Unstitched image as placeholder
    link: '/mens',
    alt: 'Men\'s Collection'
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
export const recommendedProducts: Product[] = [];

// Sample recently viewed products
export const sampleRecentlyViewed: Product[] = [];

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