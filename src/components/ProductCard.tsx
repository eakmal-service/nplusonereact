import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  // Calculate discount if not provided
  const discountDisplay = product.discount
    ? (product.discount.includes('%') ? product.discount : `${product.discount}% OFF`)
    : (product.price && product.salePrice && product.price !== product.salePrice)
      ? `${Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF`
      : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-gray-100"
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
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-100">
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

      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-amber-600 line-clamp-2 transition-colors duration-200">
          {product.title}
        </h3>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">
                ₹{product.salePrice || product.price}
              </span>
              {product.salePrice && product.price && product.salePrice !== product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price}
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