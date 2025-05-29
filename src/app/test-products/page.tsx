"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '../../contexts/ProductContext';
import { Product } from '../../utils/productUtils';

export default function TestProductsPage() {
  const { 
    products,
    isLoading, 
    saveNewProduct, 
    updateStatus,
    updateStock,
    removeProduct,
    refreshProducts 
  } = useProducts();
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Create a test product
  const createTestProduct = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const newProduct: Omit<Product, 'id'> = {
      title: `Test Product ${randomId}`,
      category: 'tshirt-top',
      subcategory: 'tshirt',
      price: '₹1,499',
      salePrice: '₹999',
      discount: '33% OFF',
      imageUrl: 'https://placehold.co/300x400/gray/white?text=Test',
      stockQuantity: 10,
      viewCount: 0,
      cartCount: 0,
      purchaseCount: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    
    saveNewProduct(newProduct);
  };
  
  // Filter products
  const filteredProducts = products.filter(product => {
    if (statusFilter !== 'all' && product.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-custom-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-silver">Product Testing Page</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <h2 className="text-xl mb-4">Product Management</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button 
              onClick={createTestProduct}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Create Test Product
            </button>
            
            <button 
              onClick={refreshProducts}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Refresh Products
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block mb-2 text-sm">Filter by Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm">Filter by Category</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="all">All Categories</option>
                <option value="tshirt-top">T-Shirts & Top Wear</option>
                <option value="night-bottoms">Night Bottoms</option>
                <option value="girls-wear">Girls Wear</option>
                <option value="co-ord-sets">Co-ord Sets</option>
                <option value="sarees">Sarees</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl mb-4">Product List ({filteredProducts.length})</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-silver"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-gray-700">
                      <td className="px-4 py-2">{product.id}</td>
                      <td className="px-4 py-2">
                        <div className="relative h-12 w-12">
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">{product.title}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">{product.salePrice}</td>
                      <td className="px-4 py-2">{product.stockQuantity}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.status === 'active' ? 'bg-green-600' :
                          product.status === 'inactive' ? 'bg-yellow-600' :
                          'bg-gray-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateStock(product.id, product.stockQuantity + 1)}
                            className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                          >
                            +Stock
                          </button>
                          
                          <button 
                            onClick={() => updateStatus(
                              product.id, 
                              product.status === 'active' ? 'inactive' : 'active'
                            )}
                            className="text-xs px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
                          >
                            Toggle
                          </button>
                          
                          <button 
                            onClick={() => removeProduct(product.id)}
                            className="text-xs px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>No products found matching your filters.</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex gap-4">
          <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white">
            Back to Home
          </Link>
          <Link href="/tshirt-top" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
            View T-shirt Category
          </Link>
          <Link href="/admin/dashboard" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 