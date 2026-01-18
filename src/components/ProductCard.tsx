import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  // Calculate prices
  const originalPrice = product.mrp ? parseFloat(product.mrp.toString()) : (product.price ? parseFloat(product.price) : 0);
  const currentPrice = product.salePrice ? parseFloat(product.salePrice) : (product.price ? parseFloat(product.price) : 0);

  // Calculate discount dynamically if not present
  const discountDisplay = product.discount
    ? (product.discount.includes('%') ? product.discount : `${product.discount}% OFF`)
    : (originalPrice > currentPrice)
      ? `${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF`
      : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 block h-full"
    >
      <div className="relative aspect-square">
        {product.image ? (
          <Image
            src={optimizeCloudinaryUrl(product.image)}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
          {product.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">
                ₹{currentPrice}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          {(product.stockQuantity || 0) > 0 ? (
            <span className="text-sm text-green-600">
              In Stock
            </span>
          ) : (
            <span className="text-sm text-red-600">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Discount Badge */}
      {discountDisplay && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          {discountDisplay}
        </div>
      )}
    </Link>
  );
} 