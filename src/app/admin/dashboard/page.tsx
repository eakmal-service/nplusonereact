"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AddProductForm from '../../../components/admin/AddProductForm';
import ManageProductsSection from '../../../components/admin/ManageProductsSection';
import OrdersSection from '../../../components/admin/OrdersSection';
import ReviewsSection from '@/components/admin/ReviewsSection';
import CouponsSection from '@/components/admin/CouponsSection';
import ErrorLogsSection from '@/components/admin/ErrorLogsSection';
import ContentManagementSection from '@/components/admin/ContentManagementSection';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('addProduct');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Update the document title
    document.title = 'Admin Dashboard | NPlusOne';

    const handleScroll = () => {
      // If window is scrolled more than 50px, set isScrolled to true
      setIsScrolled(window.scrollY > 50);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setActiveTab('addProduct');
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      {/* Admin Header using homepage header styling */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-black ${isScrolled ? 'shadow-lg' : ''
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - same position as homepage */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="w-44 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 relative">
                  <Image
                    src="/images/NPlusOne logo.svg"
                    alt="NPlusOne Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Empty div to maintain flex spacing */}
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 mt-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:w-64 bg-black p-4 rounded-lg h-fit border border-gray-800">
            <h2 className="text-xl font-bold mb-6 text-silver border-b border-gray-700 pb-2">Dashboard</h2>
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('addProduct')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'addProduct'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('manageProducts')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'manageProducts'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Manage Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'orders'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Orders
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'reviews'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Reviews
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('coupons')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'coupons'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Coupons
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('customers')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'customers'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Customers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'settings'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'content'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Website Content
                  </button>
                </li>
                {/* System Errors Tab */}
                <li>
                  <button
                    onClick={() => setActiveTab('errors')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'errors'
                      ? 'bg-red-900/50 text-red-200 border border-red-900'
                      : 'text-red-400 hover:text-red-200 hover:bg-red-900/20'
                      }`}
                  >
                    System Errors ⚠️
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'addProduct' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-silver">{editingProduct ? 'Edit Product' : 'Add New Product'}</h1>
                <AddProductForm
                  initialData={editingProduct}
                  onCancel={() => {
                    setEditingProduct(null);
                    setActiveTab('manageProducts');
                    window.scrollTo(0, 0);
                  }}
                />
              </div>
            )}

            {activeTab === 'manageProducts' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-silver">Manage Products</h1>
                <ManageProductsSection onEdit={handleEditProduct} />
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-silver">Orders</h1>
                <OrdersSection />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-silver">Reviews</h1>
                <ReviewsSection />
              </div>
            )}

            {activeTab === 'coupons' && (
              <div>
                <CouponsSection />
              </div>
            )}

            {activeTab === 'customers' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-silver">Customers</h1>
                <div className="bg-black p-6 rounded-lg border border-gray-800">
                  <p className="text-gray-400">Customer management functionality will be added here.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-silver">Settings</h1>
                <div className="bg-black p-6 rounded-lg border border-gray-800">
                  <p className="text-gray-400">Settings functionality will be added here.</p>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-silver">Website Content</h1>
                <ContentManagementSection />
              </div>
            )}

            {activeTab === 'errors' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-red-500">System Error Management</h1>
                <ErrorLogsSection />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;