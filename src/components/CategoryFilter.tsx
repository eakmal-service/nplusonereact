import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  loading: boolean;
  selectedCategory?: number;
}

export default function CategoryFilter({ categories, loading, selectedCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search');

  const buildCategoryUrl = (categoryId?: number) => {
    const params = new URLSearchParams();
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    if (categoryId) {
      params.set('category', categoryId.toString());
    }
    return `/products${params.toString() ? `?${params.toString()}` : ''}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-2">
        <Link
          href={buildCategoryUrl()}
          className={`block px-3 py-2 rounded-md transition-colors ${!selectedCategory
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
            }`}
        >
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildCategoryUrl(category.id)}
            className={`block px-3 py-2 rounded-md transition-colors ${selectedCategory === category.id
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100'
              }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
} 