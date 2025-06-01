"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '../../contexts/ProductContext';
import { Product } from '../../utils/productUtils';

// Mock product data - in a real app this would come from your database
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Floral Print Kurti',
    category: 'tshirt-top',
    subcategory: 'kurta',
    price: '₹1,499',
    salePrice: '₹999',
    discount: '33% OFF',
    imageUrl: 'https://placehold.co/300x400/gray/white?text=Kurti',
    stockQuantity: 15,
    viewCount: 245,
    cartCount: 32,
    purchaseCount: 18,
    dateAdded: '2023-09-15',
    status: 'active' as const
  },
  {
    id: 2,
    title: 'Cotton Night Suit Set',
    category: 'co-ord-sets',
    subcategory: 'casual',
    price: '₹2,299',
    salePrice: '₹1,799',
    discount: '22% OFF',
    imageUrl: 'https://placehold.co/300x400/gray/white?text=Night+Suit',
    stockQuantity: 8,
    viewCount: 189,
    cartCount: 25,
    purchaseCount: 12,
    dateAdded: '2023-09-10',
    status: 'active' as const
  },
  {
    id: 3,
    title: 'Embroidered Saree - Maroon',
    category: 'sarees',
    subcategory: 'embroidered',
    price: '₹3,999',
    salePrice: '₹2,999',
    discount: '25% OFF',
    imageUrl: 'https://placehold.co/300x400/gray/white?text=Saree',
    stockQuantity: 5,
    viewCount: 320,
    cartCount: 48,
    purchaseCount: 22,
    dateAdded: '2023-09-05',
    status: 'active' as const
  },
  {
    id: 4,
    title: 'Girls Casual Frock',
    category: 'girls-wear',
    subcategory: 'frocks',
    price: '₹899',
    salePrice: '₹699',
    discount: '22% OFF',
    imageUrl: 'https://placehold.co/300x400/gray/white?text=Frock',
    stockQuantity: 20,
    viewCount: 150,
    cartCount: 18,
    purchaseCount: 10,
    dateAdded: '2023-09-20',
    status: 'active' as const
  },
  {
    id: 5,
    title: 'Formal Co-ord Set',
    category: 'co-ord-sets',
    subcategory: 'formal',
    price: '₹2,699',
    salePrice: '₹1,999',
    discount: '26% OFF',
    imageUrl: 'https://placehold.co/300x400/gray/white?text=Co-ord+Set',
    stockQuantity: 0,
    viewCount: 278,
    cartCount: 42,
    purchaseCount: 30,
    dateAdded: '2023-09-01',
    status: 'inactive' as const
  },
  {
    id: 6,
    title: 'Black Cotton Pajama',
    category: 'night-bottoms',
    subcategory: 'pajama',
    price: '₹899',
    salePrice: '₹699',
    discount: '22% OFF',
    imageUrl: 'https://placehold.co/300x400/gray/white?text=Pajama',
    stockQuantity: 12,
    viewCount: 130,
    cartCount: 22,
    purchaseCount: 15,
    dateAdded: '2023-09-12',
    status: 'active' as const
  }
];

// Categories for filtering
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'tshirt-top', label: 'T-Shirts & Top Wear' },
  { value: 'night-bottoms', label: 'Night Pants & Bottom Wear' },
  { value: 'girls-wear', label: 'Child Wear' },
  { value: 'co-ord-sets', label: 'Co-ord Sets' },
  { value: 'ladies-night-dress', label: 'Ladies Night Dress' },
  { value: 'sarees', label: 'Sarees' },
];

const ManageProductsSection = () => {
  const { products, updateStock, updateStatus, isLoading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [stockFilter, setStockFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by stock
    if (stockFilter === 'inStock') {
      result = result.filter(product => product.stockQuantity > 0);
    } else if (stockFilter === 'outOfStock') {
      result = result.filter(product => product.stockQuantity === 0);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(product => product.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case 'priceHigh':
        result.sort((a, b) => parseInt(b.salePrice.replace(/[^0-9]/g, '')) - parseInt(a.salePrice.replace(/[^0-9]/g, '')));
        break;
      case 'priceLow':
        result.sort((a, b) => parseInt(a.salePrice.replace(/[^0-9]/g, '')) - parseInt(b.salePrice.replace(/[^0-9]/g, '')));
        break;
      case 'stockHigh':
        result.sort((a, b) => b.stockQuantity - a.stockQuantity);
        break;
      case 'stockLow':
        result.sort((a, b) => a.stockQuantity - b.stockQuantity);
        break;
      case 'mostViewed':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'mostPurchased':
        result.sort((a, b) => b.purchaseCount - a.purchaseCount);
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, sortOption, stockFilter, searchQuery, statusFilter]);

  // Handle stock quantity changes
  const handleStockChange = (productId: number, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newQuantity = Math.max(0, product.stockQuantity + change);
    updateStock(productId, newQuantity);
  };

  // Handle product status change
  const handleStatusChange = (productId: number, newStatus: 'active' | 'inactive' | 'draft') => {
    updateStatus(productId, newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-silver"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="search" className="block mb-1 text-sm font-medium text-gray-400">
            Search Products
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>
        
        {/* Category Filter */}
        <div>
          <label htmlFor="categoryFilter" className="block mb-1 text-sm font-medium text-gray-400">
            Filter by Category
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            {CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Status Filter */}
        <div>
          <label htmlFor="statusFilter" className="block mb-1 text-sm font-medium text-gray-400">
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        
        {/* Stock Filter */}
        <div>
          <label htmlFor="stockFilter" className="block mb-1 text-sm font-medium text-gray-400">
            Filter by Stock
          </label>
          <select
            id="stockFilter"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            <option value="all">All Products</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
        
        {/* Sorting */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="sortOption" className="block mb-1 text-sm font-medium text-gray-400">
            Sort By
          </label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="stockHigh">Stock: High to Low</option>
            <option value="stockLow">Stock: Low to High</option>
            <option value="mostViewed">Most Viewed</option>
            <option value="mostPurchased">Most Purchased</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            // Fallback image URL and default values
            const imageUrl = product.imageUrl || '/images/placeholder-product.jpg';
            const stockQuantity = product.stockQuantity ?? 0;
            const category = product.category || 'Uncategorized';
            const subcategory = product.subcategory || '';
            const dateAdded = product.dateAdded || new Date().toISOString();
            const salePrice = product.salePrice || '0';
            
            return (
              <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition">
                {/* Product Image */}
                <div className="relative h-48 md:h-64">
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                    {product.discount}
                  </div>
                  {stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">OUT OF STOCK</span>
                    </div>
                  )}
                  {product.status !== 'active' && (
                    <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-medium px-2 py-1 rounded">
                      {product.status.toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-2">{product.title}</h3>
                  <div className="text-sm text-gray-400 mb-2">
                    <p>Category: {category}</p>
                    {subcategory && <p>Subcategory: {subcategory}</p>}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-white">{salePrice}</p>
                      {product.price !== salePrice && (
                        <p className="text-sm text-gray-500 line-through">{product.price}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">Stock: {stockQuantity}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-gray-400">
            <p className="text-xl">No products found matching your filters.</p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSortOption('newest');
                setStockFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProductsSection; 