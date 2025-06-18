import React, { useState } from 'react';

const mockOrders = [
  {
    id: 'ORD-2023-001',
    productType: 'Kurti',
    productName: 'Floral Print Kurti',
    qty: 2,
    price: 1998,
    customer: 'Priya Sharma',
    date: '2023-09-20',
    status: 'Delivered',
  },
  {
    id: 'ORD-2023-002',
    productType: 'Saree',
    productName: 'Embroidered Saree - Maroon',
    qty: 1,
    price: 2999,
    customer: 'Rahul Patel',
    date: '2023-09-18',
    status: 'Pending to Ship',
  },
  {
    id: 'ORD-2023-003',
    productType: 'Night Suit',
    productName: 'Cotton Night Suit Set',
    qty: 3,
    price: 5397,
    customer: 'Neha Singh',
    date: '2023-09-15',
    status: 'Shipped',
  },
  {
    id: 'ORD-2023-004',
    productType: 'Kurti',
    productName: 'Blue Printed Kurti',
    qty: 1,
    price: 999,
    customer: 'Amit Kumar',
    date: '2023-09-10',
    status: 'Returned',
  },
  {
    id: 'ORD-2023-005',
    productType: 'Dress',
    productName: 'Red Party Dress',
    qty: 1,
    price: 2499,
    customer: 'Sneha Verma',
    date: '2023-09-08',
    status: 'Cancelled',
  },
  {
    id: 'ORD-2023-006',
    productType: 'Saree',
    productName: 'Silk Saree',
    qty: 1,
    price: 3999,
    customer: 'Rohit Mehra',
    date: '2023-09-05',
    status: 'Delivered',
  },
];

const statusOptions = ['All Orders', 'Pending to Ship', 'Shipped', 'Delivered', 'Returned', 'Cancelled'];
const dateOptions = ['All Time', 'Last 7 Days', 'Last 30 Days'];

const statusColors: Record<string, string> = {
  'Delivered': 'bg-green-600',
  'Pending to Ship': 'bg-yellow-500',
  'Shipped': 'bg-blue-600',
  'Returned': 'bg-red-600',
  'Cancelled': 'bg-gray-600',
};

const OrdersSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Orders');
  const [date, setDate] = useState('All Time');

  // Filtered orders (basic logic)
  let filtered = mockOrders.filter((o) =>
    (status === 'All Orders' || o.status === status) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase()))
  );

  // Summary counts
  const total = mockOrders.length;
  const pending = mockOrders.filter(o => o.status === 'Pending to Ship').length;
  const delivered = mockOrders.filter(o => o.status === 'Delivered').length;
  const returned = mockOrders.filter(o => o.status === 'Returned' || o.status === 'Cancelled').length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-silver">Orders</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Order ID, Customer Name, Product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] p-2 rounded bg-gray-900 text-white border border-gray-700"
        />
        <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-700">
          {statusOptions.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={date} onChange={e => setDate(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-700">
          {dateOptions.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
          <div className="text-xs text-gray-400 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-white">{total}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
          <div className="text-xs text-gray-400 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-400">{pending}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
          <div className="text-xs text-gray-400 mb-1">Delivered</div>
          <div className="text-2xl font-bold text-green-400">{delivered}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
          <div className="text-xs text-gray-400 mb-1">Returned/Cancelled</div>
          <div className="text-2xl font-bold text-red-400">{returned}</div>
        </div>
      </div>
      <div className="space-y-4">
        {filtered.map((o) => (
          <div key={o.id} className="bg-gray-900 rounded-lg border border-gray-800 flex flex-col md:flex-row items-center md:items-stretch p-4 gap-4">
            <div className="flex flex-col items-center md:items-start w-24 min-w-[80px]">
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded mb-2">{o.productType}</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white text-lg mb-1">{o.productName}</div>
              <div className="text-xs text-gray-400 mb-1">{o.id}</div>
              <div className="text-xs text-gray-400 mb-1">Qty: {o.qty} • ₹{o.price.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mb-1">Customer: {o.customer}</div>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[120px]">
              <div className="text-xs text-gray-400 mb-1">{o.date}</div>
              <div className={`text-xs text-white px-2 py-1 rounded ${statusColors[o.status] || 'bg-gray-600'}`}>{o.status}</div>
              {o.status === 'Pending to Ship' && (
                <div className="flex gap-2 mt-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Mark Shipped</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-xs">Cancel</button>
                </div>
              )}
              <button className="text-blue-400 underline text-xs mt-2">View Details</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default OrdersSection; 