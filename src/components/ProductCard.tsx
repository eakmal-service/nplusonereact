import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 block h-full"
    >
      <div className="relative aspect-square">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
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
          <span className="text-lg font-bold text-blue-600">
            {product.salePrice || product.price}
          </span>

          {(product.stockQuantity || 0) > 0 ? (
            <span className="text-sm text-green-600">
              In Stock ({product.stockQuantity})
            </span>
          ) : (
            <span className="text-sm text-red-600">
              {product.stockQuantity === 0 ? 'Out of Stock' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
} 