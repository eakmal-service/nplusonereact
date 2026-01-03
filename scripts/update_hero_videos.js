const axios = require('axios');

const heroContent = [
    {
        desktopSrc: '', // Video takes precedence usually, or we keep image as fallback
        mobileSrc: '',
        videoSrc: '/hero-slider-desktop/Desktop.mp4',
        mobileVideoSrc: '/hero-slider-mobile/mobile-video.mp4',
        alt: 'NPlusOne Fashion Collection (Video)'
    },
    { desktopSrc: '/hero-slider-desktop/Slide-2.webp', alt: 'Special Offer - 35% Off' },
    { desktopSrc: '/hero-slider-desktop/Slide-3.webp', alt: 'Stylish Designs' },
    { desktopSrc: '/hero-slider-desktop/Slide-4.webp', alt: 'Fashion Collection' },
    { desktopSrc: '/hero-slider-desktop/Slide-5.webp', alt: 'Slide 5' },
    { desktopSrc: '/hero-slider-desktop/Slide-6.webp', alt: 'Slide 6' },
];

async function updateHero() {
    try {
        console.log('Updating Hero Content...');
        // Assuming API is running on localhost:3001
        const response = await axios.post('http://localhost:3001/api/admin/content', {
            section_id: 'hero',
            content: heroContent
        });

        if (response.data.success) {
            console.log('Successfully updated Hero content!');
        } else {
            console.error('Failed to update:', response.data);
        }
    } catch (error) {
        console.error('Error updating content:', error.message);
    }
}

updateHero();
