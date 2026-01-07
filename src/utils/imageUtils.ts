export const optimizeCloudinaryUrl = (url: string | null | undefined): string => {
    if (!url) return '';

    // If it's already optimized or not a Cloudinary URL, return as is
    if (!url.includes('cloudinary.com') || url.includes('f_auto,q_auto')) {
        return url;
    }

    // Insert f_auto,q_auto after /upload/
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
};
