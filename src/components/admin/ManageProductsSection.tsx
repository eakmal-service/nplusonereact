import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import Link from 'next/link';

const categories = [
  'All Categories',
  'Suit Set',
  'Western Dress',
  'Co-ord Sets',
  'Kids',
  'Indi-Western',
  'man\'s',
];
const statuses = ['All Statuses', 'Active', 'Inactive'];
const stockFilters = ['All Products', 'In Stock', 'Out of Stock'];
const sortOptions = ['Newest First', 'Oldest First', 'Price Low to High', 'Price High to Low'];

interface ManageProductsSectionProps {
  onEdit?: (product: any) => void;
}

const ManageProductsSection: React.FC<ManageProductsSectionProps> = ({ onEdit }) => {
  const { products, removeProduct, updateStatus } = useProducts();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');
  const [stock, setStock] = useState('All Products');
  const [sort, setSort] = useState('Newest First');

  // Helper to parse price string to number
  const parsePrice = (priceStr: string | undefined): number => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
  };

  // Filtered products
  let filtered = products.filter((p) =>
    (category === 'All Categories' || (p.category && p.category.toLowerCase() === category.toLowerCase()) || (!p.category && category === 'All Categories')) &&
    (status === 'All Statuses' || (p.status && p.status.toLowerCase() === status.toLowerCase())) &&
    (stock === 'All Products' || (stock === 'In Stock' ? (p.stockQuantity || 0) > 0 : (p.stockQuantity || 0) === 0)) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || (p.category && p.category.toLowerCase().includes(search.toLowerCase())))
  );

  // Sorting
  if (sort === 'Price Low to High') filtered = filtered.sort((a, b) => parsePrice(a.salePrice || a.price) - parsePrice(b.salePrice || b.price));
  if (sort === 'Price High to Low') filtered = filtered.sort((a, b) => parsePrice(b.salePrice || b.price) - parsePrice(a.salePrice || a.price));
  if (sort === 'Newest First') filtered = filtered.sort((a, b) => b.id - a.id);
  if (sort === 'Oldest First') filtered = filtered.sort((a, b) => a.id - b.id);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      removeProduct(id);
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus(id, newStatus as 'active' | 'inactive' | 'draft');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-silver">Manage Products ({filtered.length})</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] p-2 rounded bg-gray-900 text-white border border-gray-700"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-700">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-700">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={stock} onChange={e => setStock(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-700">
          {stockFilters.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-700">
          {sortOptions.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden flex flex-col">
            <div className="relative h-40 flex items-center justify-center bg-gray-800">
              {p.discount && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">{p.discount} OFF</span>
              )}
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="h-full object-contain" />
              ) : (
                <span className="text-gray-400 text-2xl">🖼️</span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-semibold text-white mb-1 line-clamp-1" title={p.title}>{p.title}</div>
              <div className="text-xs text-gray-400 mb-2">Category: {p.category} &bull; {p.subcategory}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg text-white font-bold">{p.salePrice || p.price}</span>
                {p.salePrice && p.salePrice !== p.price && (
                  <span className="text-sm text-gray-400 line-through">{p.price}</span>
                )}
              </div>
              <div className="flex items-center gap-6 mb-2">
                <span className="text-xs text-gray-400">👁️ {p.viewCount || 0} Views</span>
                <span className="text-xs text-gray-400">🛒 {p.cartCount || 0} Cart</span>
                <span className="text-xs text-gray-400">🛍️ {p.purchaseCount || 0} Sold</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs ${(p.stockQuantity || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(p.stockQuantity || 0) > 0 ? `In Stock: ${p.stockQuantity}` : 'Out of Stock'}
                </span>
                {p.sizes && p.sizes.length > 0 && (
                  <span className="text-xs text-silver ml-2 border border-gray-700 px-1 rounded">
                    Sizes: {p.sizes.join(', ')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <select
                  value={p.status || 'active'}
                  onChange={(e) => handleStatusChange(p.id, e.target.value)}
                  className="p-1 rounded bg-gray-800 text-white border border-gray-700 text-xs"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center transition"
                    title="Delete Product"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => onEdit && onEdit(p)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-7 h-7 flex items-center justify-center transition"
                    title="Edit Product"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-900 rounded border border-gray-800">
            <p className="text-gray-400 mb-4">No products found matching your filters.</p>
            <button
              onClick={() => {
                setCategory('All Categories');
                setStatus('All Statuses');
                setStock('All Products');
                setSearch('');
              }}
              className="text-silver underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProductsSection; 