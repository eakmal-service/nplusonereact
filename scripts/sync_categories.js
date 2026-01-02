const axios = require('axios');

const categories = [
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
        name: 'WESTERN WEAR',
        title: 'WESTERN WEAR',
        image: '/images/categories/17670078826332.webp',
        link: '/western-dress',
        alt: 'Western Wear'
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
        name: 'KID\'S WEAR',
        title: 'KID\'S WEAR',
        image: '/images/categories/dcnyqzoexbfsn6tpfmth.webp',
        link: '/kids',
        alt: 'Kid\'s Wear'
    },
    {
        id: 5,
        name: 'INDO-WESTERN',
        title: 'INDO-WESTERN',
        image: '/images/categories/17670078974382.webp',
        link: '/indi-western',
        alt: 'Indo-Western'
    },
    {
        id: 6,
        name: 'MAN\'S WEAR',
        title: 'MAN\'S WEAR',
        image: '/images/categories/tvpdbbyrrjmzjrxuwlwe.webp',
        link: '/mens',
        alt: 'Men\'s Collection'
    }
];

async function syncCategories() {
    try {
        console.log('Syncing categories to CMS...');
        const response = await axios.post('http://localhost:3001/api/admin/content', {
            section_id: 'categories',
            content: categories
        });

        if (response.status === 200) {
            console.log('Successfully synced categories!');
            console.log(JSON.stringify(response.data, null, 2));
        } else {
            console.error('Failed to sync:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error syncing categories:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

syncCategories();
