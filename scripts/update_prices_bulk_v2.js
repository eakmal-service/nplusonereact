const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jdwzdwkkmqaaycgjuipn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3pkd2trbXFhYXljZ2p1aXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1ODc2NywiZXhwIjoyMDgwOTM0NzY3fQ.pYp1VzVgPx3-HKbYw7U7XilcEAmM7MvKqVc8yROpsR0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const UPDATES = [
    { category: 'SUIT SET', style_code: 'D3P-1', name: 'Regal Violet Rayon Suit with Contrast Cream Dupatta', mrp: 984, discount: '42%', selling_price: 571 },
    { category: 'SUIT SET', style_code: 'D3P-2', name: 'Peacock Blue Rayon Suit with White Floral Dupatta', mrp: 1038, discount: '45%', selling_price: 571 },
    { category: 'SUIT SET', style_code: 'D3P-4', name: 'Ruby Pink Rayon Kurti Set with V-Neck Embroidery', mrp: 968, discount: '41%', selling_price: 571 },
    { category: 'SUIT SET', style_code: 'D3P-5', name: 'Deep Eggplant Purple Suit with Traditional Zari Work', mrp: 1020, discount: '45%', selling_price: 561 },
    { category: 'SUIT SET', style_code: 'D3P-6', name: 'Sunshine Yellow Rayon Set with Large Floral Print Dupatta', mrp: 1002, discount: '43%', selling_price: 571 },
    { category: 'SUIT SET', style_code: 'D3P-7', name: 'Cream & Lime Green Rayon Suit with Geometric Patterns', mrp: 1002, discount: '40%', selling_price: 601 },
    { category: 'SUIT SET', style_code: 'D3P-8', name: 'Radiant Purple Kurti Set with Cascading Floral Dupatta', mrp: 984, discount: '44%', selling_price: 551 },
    { category: 'SUIT SET', style_code: 'D3P-9', name: 'Wine Red Rayon Slub Ensemble with Floral Digital Print', mrp: 950, discount: '42%', selling_price: 551 },
    { category: 'SUIT SET', style_code: 'D3P-14', name: 'Timeless Black Rayon Suit with Geometric Border Dupatta', mrp: 1093, discount: '45%', selling_price: 601 },
    { category: 'SUIT SET', style_code: 'D3P-13', name: 'Petrol Blue Rayon Suit with Silver Zari Border Dupatta', mrp: 1036, discount: '42%', selling_price: 601 },
    { category: 'SUIT SET', style_code: 'D3P-11', name: 'Elegant Lavender Rayon Set with Scalloped Hem', mrp: 934, discount: '41%', selling_price: 551 },
    { category: 'SUIT SET', style_code: 'D3P-12', name: 'Cream & Fuchsia Festive Set with Gold Print Dupatta', mrp: 1072, discount: '43%', selling_price: 611 },
    { category: 'SUIT SET', style_code: 'D3P-10', name: 'Pastel Sky Blue Rayon Set with Pink Floral Dupatta', mrp: 918, discount: '40%', selling_price: 551 },
    { category: 'SUIT SET', style_code: 'D3P-15', name: 'Emerald Green Rayon Ensemble with Silver Floral Dupatta', mrp: 1111, discount: '45%', selling_price: 611 },
    { category: 'SUIT SET', style_code: 'D3P-16', name: 'Plum Purple Kurti Set with Lace Detail & Floral Dupatta', mrp: 984, discount: '42%', selling_price: 571 },
    { category: 'SUIT SET', style_code: 'D3P-17', name: 'Modern Violet Rayon Suit with Geometric Print Dupatta', mrp: 1019, discount: '44%', selling_price: 571 },
    { category: 'SUIT SET', style_code: 'D3P-18', name: 'Peacock Blue Kurti Set with Floral White Dupatta', mrp: 967, discount: '43%', selling_price: 551 },
    { category: 'CO-ORD SET', style_code: 'AIR-RAYON-D2', name: 'Premium Rayon Printed Co-ord Set with Foil Work – Yellow', mrp: 1256, discount: '45%', selling_price: 691 },
    { category: 'CO-ORD SET', style_code: 'AIR-LINEN-D2', name: 'Premium Linen Striped Co-ord Set with Square Neck Kurti & Pocket Pant', mrp: 1881, discount: '42%', selling_price: 1091 },
    { category: 'CO-ORD SET', style_code: 'AIR-LINEN-D3', name: 'Premium Linen Printed Co-ord Set with Coat-Style Kurti & Pocket Pant', mrp: 1818, discount: '40%', selling_price: 1091 },
    { category: 'SUIT SET', style_code: 'D3P-3', name: 'Chic Off-White Kurti Set with Geometric Red Embroidery', mrp: 1036, discount: '42%', selling_price: 601 },
    { category: 'CO-ORD SET', style_code: 'AIR-RAYON-D2', name: 'Premium Rayon Printed Co-ord Set with Foil Work (Green)', mrp: 1212, discount: '43%', selling_price: 691 },
    { category: 'CO-ORD SET', style_code: 'AIR-RAYON-D2', name: 'Premium Rayon Printed Co-ord Set with Foil Work (Blue)', mrp: 1152, discount: '40%', selling_price: 691 },
    { category: 'CO-ORD SET', style_code: 'AIR-LINEN-D1', name: 'Premium Linen Printed Co-ord Set with A-Line Kurti & Pant', mrp: 1948, discount: '44%', selling_price: 1091 },
    { category: 'CO-ORD SET', style_code: 'AIR-RAYON-D2', name: 'Premium Rayon Printed Co-ord Set with Foil Work (Red)', mrp: 1171, discount: '41%', selling_price: 691 },
    { category: 'CO-ORD SET', style_code: 'AIR-RAYON-D4', name: 'Premium Linen Printed Co-ord Set with Coat-Style Kurti & Pant', mrp: 1984, discount: '45%', selling_price: 1091 },
    { category: 'SUIT SET', style_code: 'NP-3PC-TARA-G', name: 'Embroidered Viscose 3-Piece Suit Set with Organza Dupatta', mrp: 1581, discount: '43%', selling_price: 901 },
    { category: 'SUIT SET', style_code: 'NP-3PC-TULSI-I', name: 'Embroidered Roman Silk 3-Piece Suit Set with Dupatta', mrp: 1571, discount: '42%', selling_price: 911 },
    { category: 'SUIT SET', style_code: 'NP-3PC-TULSI-PURPLE', name: 'Embroidered Roman Silk 3-Piece Suit Set with Dupatta', mrp: 1518, discount: '40%', selling_price: 911 },
    { category: 'SUIT SET', style_code: 'NP-3PC-TARA-Lp', name: 'Embroidered Viscose 3-Piece Suit Set with Organza Dupatta', mrp: 1638, discount: '45%', selling_price: 901 },
    { category: 'SUIT SET', style_code: 'NP-3PC-SHAGUN-M', name: 'Embroidered Cotton Blend 3-Piece Suit Set with Chanderi Dupatta', mrp: 1273, discount: '41%', selling_price: 751 },
    { category: 'SUIT SET', style_code: 'SHAGUN', name: 'Embroidered Deep Blue Kurta Pant Set with Contrast Dupatta', mrp: 1365, discount: '45%', selling_price: 751 },
    { category: 'SUIT SET', style_code: 'RD2929', name: 'Printed Yellow Cotton 3-Piece Kurta Pant Set with Dupatta', mrp: 1142, discount: '43%', selling_price: 651 },
    { category: 'SUIT SET', style_code: 'RD2929', name: 'Printed Indigo Blue Cotton 3-Piece Kurta Pant Set with Dupatta', mrp: 1085, discount: '40%', selling_price: 651 },
    { category: 'SUIT SET', style_code: 'RD2929', name: 'Printed Black Cotton 3-Piece Kurta Pant Set with Dupatta', mrp: 1122, discount: '42%', selling_price: 651 },
    { category: 'SUIT SET', style_code: 'RD2915', name: 'Printed Green Cotton 3-Piece Kurta Pant Set with Dupatta', mrp: 1163, discount: '44%', selling_price: 651 },
    { category: 'SUIT SET', style_code: 'MOHINI', name: 'Mirror Work Grey Cotton Blend 3-Piece Kurta Pant Set with Dupatta', mrp: 1456, discount: '45%', selling_price: 801 },
    { category: 'SUIT SET', style_code: 'MOHINI', name: 'Mirror Work Maroon Cotton Blend 3-Piece Kurta Pant Set with Dupatta', mrp: 1335, discount: '40%', selling_price: 801 },
    { category: 'SUIT SET', style_code: 'MOHINI', name: 'Mirror Work Brown Cotton Blend 3-Piece Kurta Pant Set with Dupatta', mrp: 1381, discount: '42%', selling_price: 801 },
    { category: 'SUIT SET', style_code: 'MOHINI', name: 'Mirror Work Mehndi Green Cotton Blend 3-Piece Kurta Pant Set with Dupatta', mrp: 1405, discount: '43%', selling_price: 801 },
    { category: 'SUIT SET', style_code: 'KUM KUM', name: 'Embroidered Blue Roman Silk 3-Piece Kurta Pant Set with Chanderi Dupatta', mrp: 1527, discount: '41%', selling_price: 901 },
    { category: 'SUIT SET', style_code: 'KUM KUM', name: 'Embroidered Orange Roman Silk 3-Piece Kurta Pant Set with Chanderi Dupatta', mrp: 1638, discount: '45%', selling_price: 901 },
    { category: 'SUIT SET', style_code: 'JASMIN', name: 'Embroidered Purple Cotton Blend 3-Piece Kurta Pant Set with Silk Dupatta', mrp: 1318, discount: '43%', selling_price: 751 },
    { category: 'SUIT SET', style_code: 'JASMIN', name: 'Embroidered Indigo Blue Cotton Blend 3-Piece Kurta Pant Set with Silk Dupatta', mrp: 1252, discount: '40%', selling_price: 751 },
    { category: 'SUIT SET', style_code: 'APPLE', name: 'Embroidered Wine Maroon Silk Blend 3-Piece Kurta Pant Set with Jacquard Dupatta', mrp: 1638, discount: '45%', selling_price: 901 },
    { category: 'SUIT SET', style_code: 'APPLE', name: 'Embroidered Black Silk Blend 3-Piece Kurta Pant Set with Jacquard Dupatta', mrp: 1553, discount: '42%', selling_price: 901 },
    { category: 'SUIT SET', style_code: 'NOORI', name: 'Embroidered Yellow Cotton Blend 3-Piece Kurta Pant Set with Green Chanderi Dupatta', mrp: 1205, discount: '41%', selling_price: 711 },
    { category: 'SUIT SET', style_code: 'NOORI', name: 'Embroidered Green Cotton Blend 3-Piece Kurta Pant Set with Chanderi Dupatta', mrp: 1270, discount: '44%', selling_price: 711 },
    { category: 'KIDS WEAR', style_code: 'NP-KID-FRK-EMB-01', name: 'Girls Cotton Embroidered Frock – Soft & Comfortable Daily Wear Dress', mrp: 752, discount: '40%', selling_price: 451 },
    { category: 'KIDS WEAR', style_code: 'KIDS-FRK-CRM', name: 'Girls Cream Cotton Embroidered Fit & Flare Frock Dress', mrp: 778, discount: '42%', selling_price: 451 },
    { category: 'KIDS WEAR', style_code: 'KIDS-FROCK-04', name: 'Girls Off-White Cotton Embroidered Fit & Flare Frock Dress – Leaf Vine Yoke Design', mrp: 820, discount: '45%', selling_price: 451 },
    { category: 'KIDS WEAR', style_code: 'KD-FLORAL-01', name: 'Girls Off-White Cotton Embroidered Fit & Flare Frock Dress – Floral Vine Design', mrp: 791, discount: '43%', selling_price: 451 },
    { category: 'KIDS WEAR', style_code: 'KIDS-FROCK-05', name: 'Girls Off-White Cotton Embroidered Fit & Flare Frock Dress – Multicolor Floral Yoke', mrp: 764, discount: '41%', selling_price: 451 },
    { category: 'KIDS WEAR', style_code: 'KIDS-FROCK-06', name: 'Girls Off-White Cotton Embroidered Fit & Flare Frock Dress – Classic Single Motif Design', mrp: 805, discount: '44%', selling_price: 451 },
    { category: 'KIDS WEAR', style_code: 'NP-KIDS-OW-07', name: 'Girls Off-White Cotton Embroidered Fit & Flare Frock Dress – Floral Band Design', mrp: 752, discount: '40%', selling_price: 451 },
    { category: 'KIDS WEAR', style_code: 'NP-KIDS-OW-08', name: 'Girls Off-White Cotton Embroidered Fit & Flare Frock Dress – Leaf Bouquet Design', mrp: 778, discount: '42%', selling_price: 451 },
    { category: 'KIDS WEAR', style_code: 'NP-KIDS-BSS-01', name: 'Boys Cotton Printed Shirt & Shorts Set – Soft & Comfortable Daily Wear', mrp: 638, discount: '45%', selling_price: 351 },
    { category: 'KIDS WEAR', style_code: 'NP-KIDS-BSS-02', name: 'Boys Cotton Printed Shirt & Shorts Set – Soft Summer Wear', mrp: 616, discount: '43%', selling_price: 351 }
];

async function updatePrices() {
    console.log(`Starting bulk update for ${UPDATES.length} products...`);
    let updatedCount = 0;
    let failedCount = 0;

    for (const item of UPDATES) {
        // First try to find products by style_code
        const { data: products, error } = await supabase
            .from('products')
            .select('id, title, style_code')
            .eq('style_code', item.style_code);

        if (error) {
            console.error(`Error fetching ${item.style_code}:`, error.message);
            failedCount++;
            continue;
        }

        if (!products || products.length === 0) {
            console.warn(`Product not found via style_code: ${item.style_code}`);
            failedCount++;
            continue;
        }

        let targetProduct = null;
        if (products.length === 1) {
            targetProduct = products[0];
        } else {
            // Logic to find best match by Title if duplicate style_code exists
            // We use simple keyword matching from the provided name
            // Extract distinct keywords from the User's provided 'Product Name'
            // NOTE: User's name might differ slightly from DB name, so we use 'includes' checks logic

            // Heuristic: If we have multiple products (e.g. variants), we check which one's title
            // contains key distinguishing words from the user's input.
            // e.g. "Yellow", "Green", "Blue", "Red", "Indigo", "Black"

            // Simple normalizer
            const userTitleLower = item.name.toLowerCase();

            // Try to find exact match first? Unlikely.
            // Let's try to match by finding the DB product whose title has the most overlap with user title?
            // Or look for specific color keywords if present in both?

            // For now, let's try to find a product where the DB title includes significant parts of user title.
            // Or specifically for known problematic ones:

            const colorKeywords = ['Yellow', 'Green', 'Blue', 'Red', 'Black', 'Indigo', 'Maroon', 'Brown', 'Grey', 'Mehndi', 'Orange', 'Purple', 'Wine', 'White', 'Cream', 'Pink', 'Lavender', 'Plum', 'Eggplant', 'Sky', 'Emerald', 'Petrol', 'Lime'];
            const foundColors = colorKeywords.filter(c => item.name.toLowerCase().includes(c.toLowerCase()));

            if (foundColors.length > 0) {
                // Try to find a DB product that ALSO has these colors in title
                const matching = products.filter(p => {
                    const pTitle = p.title.toLowerCase();
                    // matched if all found colors are in pTitle
                    return foundColors.every(c => pTitle.includes(c.toLowerCase()));
                });

                if (matching.length === 1) {
                    targetProduct = matching[0];
                } else if (matching.length > 1) {
                    console.warn(`Multiple matches for ${item.style_code} with colors ${foundColors.join(',')}. Updating ALL matches safely? No, skipping to avoid error.`);
                    // Fallback: If title resembles strictly?
                    // Let's try strictly checking if one contains the other
                    const strictMatch = matching.find(p => p.title.toLowerCase().includes(userTitleLower) || userTitleLower.includes(p.title.toLowerCase()));
                    if (strictMatch) targetProduct = strictMatch;
                }
            }

            if (!targetProduct) {
                // Try strict string containment if color matching didn't yield single result
                targetProduct = products.find(p => p.title.toLowerCase().trim() === userTitleLower.trim()); // Exact
                if (!targetProduct) {
                    targetProduct = products.find(p => p.title.toLowerCase().includes(userTitleLower) || userTitleLower.includes(p.title.toLowerCase()));
                }
            }
        }

        if (targetProduct) {
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    mrp: item.mrp,
                    selling_price: item.selling_price
                })
                .eq('id', targetProduct.id);

            if (updateError) {
                console.error(`Failed to update ${item.style_code} (ID: ${targetProduct.id}):`, updateError.message);
                failedCount++;
            } else {
                console.log(`Updated: ${item.style_code} | ${item.name} -> MRP: ${item.mrp}, SP: ${item.selling_price}`);
                updatedCount++;
            }
        } else {
            console.error(`Could not resolve specific product for duplicate style_code: ${item.style_code}. Available: ${products.map(p => p.title).join(' | ')}`);
            failedCount++;
        }
    }

    console.log(`\nBulk Update Complete.`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Failed/Skipped: ${failedCount}`);
}

updatePrices();
