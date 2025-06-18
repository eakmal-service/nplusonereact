import React, { useState } from 'react';

const mockProducts = [
  {
    id: 1,
    name: 'Round neck T Shirt',
    image: '',
    price: 399,
    mrp: 800,
    discount: 50,
    category: 'T-Shirts & Top Wear',
    subcategory: 'tshirt',
    views: 0,
    cart: 0,
    sold: 0,
    stock: 60,
    status: 'active',
  },
  {
    id: 2,
    name: 'White Textured Fit & Flare Dress',
    image: '',
    price: 600,
    mrp: 1000,
    discount: 40,
    category: 'T-Shirts & Top Wear',
    subcategory: 'top',
    views: 0,
    cart: 0,
    sold: 0,
    stock: 60,
    status: 'active',
  },
];

const categories = ['All Categories', 'T-Shirts', 'Top Wear', 'Night Pant', 'Child Wear', 'Co-ord Sets', 'Ladies Night Dress'];
const statuses = ['All Statuses', 'Active', 'Inactive'];
const stockFilters = ['All Products', 'In Stock', 'Out of Stock'];
const sortOptions = ['Newest First', 'Oldest First', 'Price Low to High', 'Price High to Low'];

const ManageProductsSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');
  const [stock, setStock] = useState('All Products');
  const [sort, setSort] = useState('Newest First');

  // Filtered products (basic logic)
  let filtered = mockProducts.filter((p) =>
    (category === 'All Categories' || p.category === category) &&
    (status === 'All Statuses' || p.status === status.toLowerCase()) &&
    (stock === 'All Products' || (stock === 'In Stock' ? p.stock > 0 : p.stock === 0)) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === 'Price Low to High') filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === 'Price High to Low') filtered = filtered.sort((a, b) => b.price - a.price);
  if (sort === 'Newest First') filtered = filtered.sort((a, b) => b.id - a.id);
  if (sort === 'Oldest First') filtered = filtered.sort((a, b) => a.id - b.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-silver">Manage Products</h1>
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
              {p.discount > 0 && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">{p.discount}% OFF</span>
              )}
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-full object-contain" />
              ) : (
                <span className="text-gray-400 text-2xl">🖼️</span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-semibold text-white mb-1">{p.name}</div>
              <div className="text-xs text-gray-400 mb-2">Category: {p.category} &bull; {p.subcategory}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg text-white font-bold">₹{p.price}</span>
                <span className="text-sm text-gray-400 line-through">₹{p.mrp}</span>
              </div>
              <div className="flex items-center gap-6 mb-2">
                <span className="text-xs text-gray-400">👁️ {p.views} Views</span>
                <span className="text-xs text-gray-400">🛒 {p.cart} Cart</span>
                <span className="text-xs text-gray-400">🛍️ {p.sold} Sold</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-green-400">In Stock: {p.stock}</span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <select value={p.status} className="p-1 rounded bg-gray-800 text-white border border-gray-700 text-xs">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button className="ml-auto bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center">-</button>
                <button className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center">+</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageProductsSection; 