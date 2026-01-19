import React from 'react';

interface ProductPriceProps {
    price?: string | number; // Original MRP
    salePrice?: string | number; // Selling Price
    discount?: string; // Discount string (e.g., "43% OFF")
    size?: 'sm' | 'md' | 'lg' | 'xl'; // To adjust text sizes for different contexts
    align?: 'left' | 'center' | 'right';
    showDiscount?: boolean;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
    price,
    salePrice,
    discount,
    size = 'md',
    align = 'left',
    showDiscount = true
}) => {
    // Ensure we have strings for display
    const displayPrice = price ? `₹${price}` : null;
    const displaySalePrice = salePrice ? `₹${salePrice}` : null;

    // Calculate discount if not provided but prices exist
    let displayDiscount = discount;
    if (!displayDiscount && price && salePrice && price !== salePrice) {
        const p = parseFloat(price.toString());
        const s = parseFloat(salePrice.toString());
        if (!isNaN(p) && !isNaN(s) && p > s) {
            const d = Math.round(((p - s) / p) * 100);
            displayDiscount = `${d}% OFF`;
        }
    } else if (displayDiscount && !displayDiscount.includes('OFF') && !displayDiscount.includes('%')) {
        // Handle simple number case if passed
        // But typically it's passed as string. If just number, append % OFF
        // displayDiscount = `${displayDiscount}% OFF`; 
        // Should rely on prop being correct usually
    }

    // Size mappings
    const sizeClasses = {
        sm: {
            sale: 'text-base',
            original: 'text-sm',
            discount: 'text-xs'
        },
        md: {
            sale: 'text-xl', // Increased from lg
            original: 'text-base',
            discount: 'text-sm'
        },
        lg: {
            sale: 'text-2xl',
            original: 'text-lg',
            discount: 'text-base'
        },
        xl: { // Matches Product Detail Page roughly
            sale: 'text-4xl sm:text-5xl',
            original: 'text-xl',
            discount: 'text-lg'
        }
    };

    const currentSize = sizeClasses[size];
    const alignClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

    if (!displaySalePrice) return null;

    return (
        <div className={`flex items-center gap-2 ${alignClass} flex-wrap`}>
            {/* Sale Price (Bold, White/Silver) */}
            <span className={`${currentSize.sale} font-bold text-white`}>
                {displaySalePrice}
            </span>

            {/* Original Price (Strikethrough, Gray) */}
            {displayPrice && displayPrice !== displaySalePrice && (
                <span className={`${currentSize.original} text-gray-400 line-through`}>
                    {displayPrice}
                </span>
            )}

            {/* Discount (Red, Bold) */}
            {showDiscount && displayDiscount && displayPrice !== displaySalePrice && (
                <span className={`${currentSize.discount} text-[#DC2626] font-bold`}>
                    {displayDiscount.includes('OFF') ? displayDiscount : `${displayDiscount} OFF`}
                </span>
            )}
        </div>
    );
};

export default ProductPrice;
