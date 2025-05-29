"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Mock order data - in a real app this would come from your database
const MOCK_ORDERS = [
  {
    id: 'ORD-2023-001',
    customerName: 'Priya Sharma',
    productId: 1,
    productName: 'Floral Print Kurti',
    productImage: 'https://placehold.co/300x400/gray/white?text=Kurti',
    quantity: 2,
    totalAmount: '₹1,998',
    orderDate: '2023-09-20',
    status: 'delivered',
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, Mumbai, Maharashtra, 400001'
  },
  {
    id: 'ORD-2023-002',
    customerName: 'Rahul Patel',
    productId: 3,
    productName: 'Embroidered Saree - Maroon',
    productImage: 'https://placehold.co/300x400/gray/white?text=Saree',
    quantity: 1,
    totalAmount: '₹2,999',
    orderDate: '2023-09-18',
    status: 'pending',
    paymentMethod: 'UPI',
    shippingAddress: '456 Park Avenue, Delhi, 110001'
  },
  {
    id: 'ORD-2023-003',
    customerName: 'Neha Singh',
    productId: 2,
    productName: 'Cotton Night Suit Set',
    productImage: 'https://placehold.co/300x400/gray/white?text=Night+Suit',
    quantity: 3,
    totalAmount: '₹5,397',
    orderDate: '2023-09-15',
    status: 'shipped',
    paymentMethod: 'Cash on Delivery',
    shippingAddress: '789 Beach Road, Chennai, Tamil Nadu, 600001'
  },
  {
    id: 'ORD-2023-004',
    customerName: 'Amit Verma',
    productId: 5,
    productName: 'Formal Co-ord Set',
    productImage: 'https://placehold.co/300x400/gray/white?text=Co-ord+Set',
    quantity: 1,
    totalAmount: '₹1,999',
    orderDate: '2023-09-12',
    status: 'returned',
    paymentMethod: 'Debit Card',
    shippingAddress: '101 Hill Top, Pune, Maharashtra, 411001',
    returnReason: 'Size too small'
  },
  {
    id: 'ORD-2023-005',
    customerName: 'Sneha Gupta',
    productId: 4,
    productName: 'Girls Casual Frock',
    productImage: 'https://placehold.co/300x400/gray/white?text=Frock',
    quantity: 2,
    totalAmount: '₹1,398',
    orderDate: '2023-09-10',
    status: 'delivered',
    paymentMethod: 'UPI',
    shippingAddress: '234 Lake View, Bangalore, Karnataka, 560001'
  },
  {
    id: 'ORD-2023-006',
    customerName: 'Rajesh Kumar',
    productId: 6,
    productName: 'Black Cotton Pajama',
    productImage: 'https://placehold.co/300x400/gray/white?text=Pajama',
    quantity: 2,
    totalAmount: '₹1,398',
    orderDate: '2023-09-05',
    status: 'cancelled',
    paymentMethod: 'Credit Card',
    shippingAddress: '567 River Road, Kolkata, West Bengal, 700001',
    cancellationReason: 'Changed mind'
  }
];

// Order statuses with colors and labels
const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders', color: 'gray' },
  { value: 'pending', label: 'Pending to Ship', color: 'yellow' },
  { value: 'shipped', label: 'Shipped', color: 'blue' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'returned', label: 'Returned', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' }
];

const OrdersSection = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filteredOrders, setFilteredOrders] = useState(MOCK_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Apply filters
  useEffect(() => {
    let result = [...orders];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filter by date
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    if (dateFilter === 'last7days') {
      result = result.filter(order => new Date(order.orderDate) >= sevenDaysAgo);
    } else if (dateFilter === 'last30days') {
      result = result.filter(order => new Date(order.orderDate) >= thirtyDaysAgo);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.productName.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    
    setFilteredOrders(result);
  }, [orders, statusFilter, dateFilter, searchQuery]);

  // Handle order status update
  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusInfo = ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
    const colorClasses = {
      'green': 'bg-green-600 text-white',
      'yellow': 'bg-yellow-500 text-black',
      'blue': 'bg-blue-600 text-white',
      'red': 'bg-red-600 text-white',
      'gray': 'bg-gray-600 text-white'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colorClasses[statusInfo.color as keyof typeof colorClasses]}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="searchOrders" className="block mb-1 text-sm font-medium text-gray-400">
            Search Orders
          </label>
          <input
            type="text"
            id="searchOrders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Order ID, Customer Name, Product..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          />
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
            {ORDER_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Date Filter */}
        <div>
          <label htmlFor="dateFilter" className="block mb-1 text-sm font-medium text-gray-400">
            Filter by Date
          </label>
          <select
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            <option value="all">All Time</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-gray-400 text-sm">Total Orders</h3>
          <p className="text-white text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-gray-400 text-sm">Pending</h3>
          <p className="text-yellow-500 text-2xl font-bold">
            {orders.filter(order => order.status === 'pending').length}
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-gray-400 text-sm">Delivered</h3>
          <p className="text-green-500 text-2xl font-bold">
            {orders.filter(order => order.status === 'delivered').length}
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-gray-400 text-sm">Returned/Cancelled</h3>
          <p className="text-red-500 text-2xl font-bold">
            {orders.filter(order => ['returned', 'cancelled'].includes(order.status)).length}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-800 transition"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={order.productImage}
                        alt={order.productName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="text-silver font-medium">{order.id}</p>
                      <h3 className="text-white text-lg">{order.productName}</h3>
                      <p className="text-sm text-gray-400">Qty: {order.quantity} • {order.totalAmount}</p>
                    </div>
                  </div>
                  
                  {/* Order Meta */}
                  <div className="flex flex-col md:items-end gap-1">
                    <p className="text-gray-400 text-sm">{order.orderDate}</p>
                    <p className="text-gray-300">{order.customerName}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrderDetails(order.id);
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                  </button>
                  
                  {/* Status Update Options */}
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(order.id, 'shipped');
                        }}
                        className="text-sm bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Mark Shipped
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(order.id, 'delivered');
                        }}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {['pending', 'shipped'].includes(order.status) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(order.id, 'cancelled');
                        }}
                        className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Order Details (Expanded) */}
              {expandedOrderId === order.id && (
                <div className="p-4 border-t border-gray-800 bg-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-silver font-medium mb-2">Shipping Address</h4>
                      <p className="text-gray-300">{order.shippingAddress}</p>
                      
                      <h4 className="text-silver font-medium mt-4 mb-2">Payment Method</h4>
                      <p className="text-gray-300">{order.paymentMethod}</p>
                      
                      {(order.status === 'returned' && order.returnReason) && (
                        <>
                          <h4 className="text-silver font-medium mt-4 mb-2">Return Reason</h4>
                          <p className="text-gray-300">{order.returnReason}</p>
                        </>
                      )}
                      
                      {(order.status === 'cancelled' && order.cancellationReason) && (
                        <>
                          <h4 className="text-silver font-medium mt-4 mb-2">Cancellation Reason</h4>
                          <p className="text-gray-300">{order.cancellationReason}</p>
                        </>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-silver font-medium mb-2">Order Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                          <p className="text-gray-300">Order Placed - {order.orderDate}</p>
                        </div>
                        {(order.status === 'shipped' || order.status === 'delivered') && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                            <p className="text-gray-300">Shipped - Processing</p>
                          </div>
                        )}
                        {order.status === 'delivered' && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                            <p className="text-gray-300">Delivered - Completed</p>
                          </div>
                        )}
                        {order.status === 'returned' && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                            <p className="text-gray-300">Returned</p>
                          </div>
                        )}
                        {order.status === 'cancelled' && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                            <p className="text-gray-300">Cancelled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Admin Actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Print Invoice
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                      Contact Customer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p className="text-xl">No orders found matching your filters.</p>
            <button 
              onClick={() => {
                setStatusFilter('all');
                setDateFilter('all');
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

export default OrdersSection; 