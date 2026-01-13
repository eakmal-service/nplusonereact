
/**
 * Maps database category names to Next.js route paths.
 * Handles cases where the route URL doesn't match the category name directly.
 */
export const getCategoryUrl = (category: string | undefined): string => {
    if (!category) return '/products';

    // Normalize: uppercase, trim, and collapse multiple spaces
    const normalized = category.toUpperCase().trim().replace(/\s+/g, ' ');

    const mapping: { [key: string]: string } = {
        'CO-ORD SET': '/co-ord-sets',
        'CO ORD SET': '/co-ord-sets', // Handle missing hyphen
        'COORD SET': '/co-ord-sets',
        'WESTERN WEAR': '/western-dress',
        'MENS WEAR': '/mens',
        'KIDS WEAR': '/kids',
        'INDO-WESTERN': '/indi-western',
        'INDO WESTERN': '/indi-western',
        'SUIT SET': '/suit-set',
        'NIGHT BOTTOMS': '/night-bottoms',
        'GIRLS WEAR': '/girls-wear',
    };

    if (mapping[normalized]) {
        return mapping[normalized];
    }

    // Fallback: standard slugification
    return `/${category.toLowerCase().trim().replace(/\s+/g, '-')}`;
};
