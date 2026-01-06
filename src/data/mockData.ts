
import { Category, CollectionItem, Product } from "../types";

// Categories for the main category grid
export const categories: Category[] = [
  {
    id: 1,
    name: 'SUIT SET',
    title: 'SUIT SET',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/categories/17670080328782',
    link: '/suit-set',
    alt: 'Suit Sets'
  },
  {
    id: 2,
    name: 'WESTERN WEAR',
    title: 'WESTERN WEAR',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/categories/17670078826332',
    link: '/western-dress',
    alt: 'Western Wear'
  },
  {
    id: 3,
    name: 'CO-ORD SET',
    title: 'CO-ORD SET',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/categories/17670079057732',
    link: '/co-ord-sets',
    alt: 'Co-ord Sets'
  },
  {
    id: 4,
    name: 'KID\'S WEAR',
    title: 'KID\'S WEAR',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/categories/dcnyqzoexbfsn6tpfmth',
    link: '/kids',
    alt: 'Kid\'s Wear'
  },
  {
    id: 5,
    name: 'INDO-WESTERN',
    title: 'INDO-WESTERN',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/categories/17670078974382',
    link: '/indi-western',
    alt: 'Indo-Western'
  },
  {
    id: 6,
    name: 'MEN\'S WEAR',
    title: 'MEN\'S WEAR',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/categories/tvpdbbyrrjmzjrxuwlwe',
    link: '/mens',
    alt: 'Men\'s Collection'
  }
];

// Collection items for the collection slider
export const collectionItems: CollectionItem[] = [
  {
    title: 'DENIMWEAR',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/collections/1',
    link: '/night-bottoms',
    alt: 'Denimwear Collection'
  },
  {
    title: 'INDIGO CHRONICALS',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/collections/2',
    link: '/tshirt-top',
    alt: 'Indigo Chronicals Collection'
  },
  {
    title: 'EVERYDAY GRACE',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/collections/3',
    link: '/co-ord-sets',
    alt: 'Everyday Grace Collection'
  },
  {
    title: 'ONLINE EXCLUSIVE',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/collections/4',
    link: '/tshirt-top',
    alt: 'Online Exclusive Collection'
  },
  {
    title: 'Short Kurta',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/collections/5',
    link: '/co-ord-sets',
    alt: 'Short Kurta Collection'
  },
  {
    title: 'CASUAL CHIC',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/collections/6',
    link: '/tshirt-top',
    alt: 'Casual Chic Collection'
  },
  {
    title: 'SUMMER VIBES',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/collections/7',
    link: '/tshirt-top',
    alt: 'Summer Vibes Collection'
  },
  {
    title: 'ETHNIC FUSION',
    image: 'https://res.cloudinary.com/douy8ujry/image/upload/nplus/images/collections/8',
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