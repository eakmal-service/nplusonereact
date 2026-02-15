"use client";

import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import Image from 'next/image';
import { Edit2, Trash2, Eye, ShoppingCart, ShoppingBag, Copy, Maximize2, Search, Filter, X } from 'lucide-react';

const categories = [
  'All Categories',
  'Suit Set',
  'Western Wear',
  'Co-ord Set',
  "Kid's Wear",
  'Indo-Western',
  "Men's Wear",
];
const statuses = ['All Statuses', 'Active', 'Inactive'];
const stockFilters = ['All Products', 'In Stock', 'Out of Stock'];
const sortOptions = ['Newest First', 'Oldest First', 'Price Low to High', 'Price High to Low'];

interface ManageProductsSectionProps {
  onEdit?: (product: any) => void;
}

import { supabase } from '@/lib/supabaseClient';

interface CategoryNode {
  id: string;
  label: string;
  value?: string;
  children?: CategoryNode[];
  level?: number;
  is_visible?: boolean;
}

const ManageProductsSection: React.FC<ManageProductsSectionProps> = ({ onEdit }) => {
  const { products, removeProduct, updateStatus, refreshProducts, updateExistingProduct } = useProducts();

  // Dynamic Categories State
  const [dynamicCategories, setDynamicCategories] = useState<CategoryNode[]>([]);
  const [editingCategoryProduct, setEditingCategoryProduct] = useState<any>(null); // Product being edited

  // Edit Modal State
  const [selectedSuperCat, setSelectedSuperCat] = useState<CategoryNode | null>(null);
  const [selectedChildCat, setSelectedChildCat] = useState<CategoryNode | null>(null);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (!error && data) {
      const buildTree = (flatList: any[]): CategoryNode[] => {
        const map: Record<string, CategoryNode> = {};
        const roots: CategoryNode[] = [];
        flatList.forEach(item => {
          map[item.id] = { id: item.id, label: item.name, value: item.name, children: [], level: item.level };
        });
        flatList.forEach(item => {
          if (item.parent_id && map[item.parent_id]) {
            map[item.parent_id].children?.push(map[item.id]);
          } else {
            roots.push(map[item.id]);
          }
        });
        return roots;
      };
      setDynamicCategories(buildTree(data));
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');
  const [stock, setStock] = useState('All Products');
  const [sort, setSort] = useState('Newest First');
  const [isLoading, setIsLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  React.useEffect(() => {
    const fetchAdminProducts = async () => {
      setIsLoading(true);
      await refreshProducts();
      setIsLoading(false);
    };
    fetchAdminProducts();
  }, []);

  const parsePrice = (priceStr: string | undefined): number => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
  };

  let filtered = products.filter((p) =>
    (category === 'All Categories' || (p.category && p.category.toLowerCase() === category.toLowerCase()) || (!p.category && category === 'All Categories')) &&
    (status === 'All Statuses' || (p.status && p.status.toLowerCase() === status.toLowerCase())) &&
    (stock === 'All Products' || (stock === 'In Stock' ? (p.stockQuantity || 0) > 0 : (p.stockQuantity || 0) === 0)) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || (p.category && p.category.toLowerCase().includes(search.toLowerCase())) || String(p.id).includes(search))
  );

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

  const handleDuplicate = (product: any) => {
    if (onEdit) {
      // Create a copy without ID and created_at
      const { id, created_at, ...rest } = product;
      const duplicate = {
        ...rest,
        title: `${rest.title} (Copy)`,
        // Ensure we trigger "Add New" mode logic but with pre-filled data.
        // Since AddProductForm checks for `id` to determine Edit mode, passing an object WITHOUT id is key.
      };
      onEdit(duplicate);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-silver">Manage Products ({filtered.length})</h1>
        <button onClick={() => { setSearch(''); setCategory('All Categories'); setStatus('All Statuses'); setStock('All Products'); }} className="text-sm text-blue-400 hover:text-blue-300">
          Reset Filters
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by ID, Name, or Category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 p-2.5 rounded bg-black text-white border border-gray-700 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Filter size={16} className="text-gray-500" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="p-2.5 rounded bg-black text-white border border-gray-700 outline-none focus:border-blue-500 text-sm">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <select value={status} onChange={e => setStatus(e.target.value)} className="p-2.5 rounded bg-black text-white border border-gray-700 outline-none focus:border-blue-500 text-sm">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>

        <select value={stock} onChange={e => setStock(e.target.value)} className="p-2.5 rounded bg-black text-white border border-gray-700 outline-none focus:border-blue-500 text-sm">
          {stockFilters.map(s => <option key={s}>{s}</option>)}
        </select>

        <div className="ml-auto">
          <select value={sort} onChange={e => setSort(e.target.value)} className="p-2.5 rounded bg-black text-white border border-gray-700 outline-none focus:border-blue-500 text-sm">
            {sortOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {filtered.map((p) => (
          <div key={p.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden flex flex-col group relative hover:border-blue-500/50 transition-colors">

            {/* Quick Actions Overlay (Top Right) */}
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDuplicate(p)}
                className="p-1.5 bg-gray-800 text-white rounded hover:bg-blue-600 transition-colors shadow-lg border border-gray-700"
                title="Duplicate Product"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={() => setQuickViewProduct(p)}
                className="p-1.5 bg-gray-800 text-white rounded hover:bg-blue-600 transition-colors shadow-lg border border-gray-700"
                title="Quick View"
              >
                <Maximize2 size={14} />
              </button>
            </div>

            <div className="relative h-48 flex items-center justify-center bg-gray-800 cursor-pointer" onClick={() => setQuickViewProduct(p)}>
              {p.discount && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10 font-bold">{p.discount} OFF</span>
              )}
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl || '/placeholder.png'}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-gray-400 text-2xl">🖼️</span>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="font-semibold text-white mb-1 line-clamp-1 hover:text-blue-400 cursor-pointer" title={p.title} onClick={() => onEdit && onEdit(p)}>{p.title}</div>
              <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                <span className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 flex items-center gap-1">
                  {p.category}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategoryProduct(p);
                      // Pre-fill logic
                      const superCat = dynamicCategories.find(c => c.value === p.category);
                      setSelectedSuperCat(superCat || null);
                      if (superCat && p.subcategory) {
                        const child = superCat.children?.find(c => c.value === p.subcategory);
                        setSelectedChildCat(child || null);
                      } else {
                        setSelectedChildCat(null);
                      }
                    }}
                    className="text-gray-500 hover:text-white p-0.5 rounded-full hover:bg-gray-700"
                    title="Edit Category"
                  >
                    <Edit2 size={10} />
                  </button>
                </span>
                {p.subcategory && <span>&bull; {p.subcategory}</span>}
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-lg text-white font-bold">{p.salePrice || p.price}</span>
                {p.salePrice && p.salePrice !== p.price && (
                  <span className="text-xs text-gray-500 line-through">{p.price}</span>
                )}
              </div>

              {/* Stats Row with Icons */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-1.5 text-xs text-gray-400" title="Total Views">
                  <Eye size={14} className="text-blue-400" />
                  <span>{p.viewCount || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400" title="Added to Cart">
                  <ShoppingCart size={14} className="text-green-400" />
                  <span>{p.cartCount || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400" title="Units Sold">
                  <ShoppingBag size={14} className="text-purple-400" />
                  <span>{p.purchaseCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <div className={`text-xs font-medium px-2 py-1 rounded border ${(p.stockQuantity || 0) > 0
                  ? 'bg-green-900/20 text-green-400 border-green-900'
                  : 'bg-red-900/20 text-red-400 border-red-900'
                  }`}>
                  {(p.stockQuantity || 0) > 0 ? `Stock: ${p.stockQuantity}` : 'Out of Stock'}
                </div>

                <div className="ml-auto flex gap-2">
                  <select
                    value={p.status || 'active'}
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    className={`w-24 p-1 rounded text-xs border outline-none cursor-pointer ${(p.status === 'active' || !p.status)
                      ? 'bg-gray-800 text-gray-300 border-gray-700'
                      : 'bg-gray-800 text-gray-500 border-gray-700'
                      }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <button
                    onClick={() => onEdit && onEdit(p)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded p-1.5 transition"
                    title="Edit Product"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded p-1.5 transition"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-900 rounded border border-gray-800">
            <p className="text-gray-400 mb-4">No products found matching your filters.</p>
            <button
              onClick={() => {
                setCategory('All Categories');
                setStatus('All Statuses');
                setStock('All Products');
                setSearch('');
              }}
              className="text-silver underline hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
              <h2 className="text-xl font-bold text-white">Quick View</h2>
              <button onClick={() => setQuickViewProduct(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-gray-800">
                {quickViewProduct.imageUrl ? (
                  <Image src={quickViewProduct.imageUrl} alt={quickViewProduct.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                )}
              </div>
              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{quickViewProduct.title}</h3>
                  <p className="text-sm text-gray-400">ID: {quickViewProduct.id}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded border border-blue-900">{quickViewProduct.category}</span>
                  {quickViewProduct.subcategory && <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">{quickViewProduct.subcategory}</span>}
                </div>

                <div className="flex items-baseline gap-3 border-b border-gray-800 pb-4">
                  <span className="text-3xl font-bold text-white">{quickViewProduct.salePrice || quickViewProduct.price}</span>
                  {quickViewProduct.salePrice && quickViewProduct.salePrice !== quickViewProduct.price && (
                    <span className="text-gray-500 line-through">{quickViewProduct.price}</span>
                  )}
                  {quickViewProduct.discount && <span className="text-red-400 font-bold ml-auto">{quickViewProduct.discount} OFF</span>}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Inventory</h4>
                  <div className="flex justify-between text-sm p-3 bg-gray-800 rounded">
                    <span className={quickViewProduct.stockQuantity > 0 ? "text-green-400" : "text-red-400"}>
                      {quickViewProduct.stockQuantity > 0 ? `In Stock (${quickViewProduct.stockQuantity})` : "Out of Stock"}
                    </span>
                    <span className="text-gray-400">Status: {quickViewProduct.status || 'Active'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 ? (
                      quickViewProduct.sizes.map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded text-sm">{s}</span>
                      ))
                    ) : <span className="text-gray-500 italic">No sizes specified</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">Description</h4>
                  <p className="text-gray-400 text-sm leading-relaxed max-h-32 overflow-y-auto pr-2">
                    {quickViewProduct.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => { setQuickViewProduct(null); onEdit && onEdit(quickViewProduct); }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> Edit Product
                  </button>
                  <button
                    onClick={() => { setQuickViewProduct(null); handleDuplicate(quickViewProduct); }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2 border border-gray-700"
                  >
                    <Copy size={16} /> Duplicate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Edit Modal */}
      {editingCategoryProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingCategoryProduct(null)}>
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Edit Category</h3>
            <p className="text-gray-400 text-sm mb-4">Product: <span className="text-white">{editingCategoryProduct.title}</span></p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Main Category</label>
                <select
                  className="w-full bg-black border border-gray-700 text-white p-2 rounded"
                  onChange={(e) => {
                    const cat = dynamicCategories.find(c => c.value === e.target.value);
                    setSelectedSuperCat(cat || null);
                    setSelectedChildCat(null); // Reset child
                  }}
                  value={selectedSuperCat?.value || ''}
                >
                  <option value="">Select Category</option>
                  {dynamicCategories.map(c => <option key={c.id} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {selectedSuperCat && selectedSuperCat.children && selectedSuperCat.children.length > 0 && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Subcategory</label>
                  <select
                    className="w-full bg-black border border-gray-700 text-white p-2 rounded"
                    onChange={(e) => {
                      const cat = selectedSuperCat.children?.find(c => c.value === e.target.value);
                      setSelectedChildCat(cat || null);
                    }}
                    value={selectedChildCat?.value || ''}
                  >
                    <option value="">Select Subcategory</option>
                    {selectedSuperCat.children.map(c => <option key={c.id} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={async () => {
                    if (selectedSuperCat) {
                      // CATEGORY MAPPING LOGIC (Copied from AddProductForm to ensure DB Enum match)
                      const CATEGORY_ENUM_MAP: Record<string, string> = {
                        "All Boy's Wear": 'KIDS WEAR',
                        "Boy's Wear": 'KIDS WEAR',
                        "Girl's Wear": 'KIDS WEAR',
                        "Men's Wear": 'MENS WEAR',
                        "Suit Set": 'SUIT SET',
                        "Western Wear": 'WESTERN WEAR',
                        "Co-ord Set": 'CO-ORD SET',
                        "Kid's Wear": 'KIDS WEAR',
                        "Indo-Western": 'INDO-WESTERN',
                        "all boy's wear": 'KIDS WEAR',
                        "boy's wear": 'KIDS WEAR',
                        "girl's wear": 'KIDS WEAR',
                        "men's wear": 'MENS WEAR',
                        // NEW MAPPINGS FOR WOMEN'S WEAR
                        "Women's Wear": 'WESTERN WEAR',
                        "Womens Wear": 'WESTERN WEAR',
                        "women's wear": 'WESTERN WEAR',
                      };

                      const cleanCategory = selectedSuperCat.value?.trim() || '';
                      const mappedCategory = CATEGORY_ENUM_MAP[cleanCategory] || CATEGORY_ENUM_MAP[cleanCategory.toLowerCase()] || cleanCategory;

                      const updated = {
                        ...editingCategoryProduct,
                        category: mappedCategory,
                        subcategory: selectedChildCat?.value || ''
                      };

                      const success = await updateExistingProduct(updated);
                      if (success) {
                        alert("Category Updated!");
                        setEditingCategoryProduct(null);
                        refreshProducts();
                      }
                    } else {
                      alert("Please select a main category");
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold"
                >
                  Save
                </button>
                <button onClick={() => setEditingCategoryProduct(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProductsSection;