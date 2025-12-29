import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_events?: any[];
  courier_info?: any;
  payment_info?: any;
  shipping_address?: any;
}

const statusOptions = ['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const dateOptions = ['All Time', 'Last 7 Days', 'Last 30 Days'];

const statusColors: Record<string, string> = {
  'Delivered': 'bg-green-600',
  'Pending': 'bg-yellow-500',
  'Processing': 'bg-blue-500',
  'Shipped': 'bg-blue-600',
  'Returned': 'bg-red-600',
  'Cancelled': 'bg-gray-600',
};

const OrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Orders');
  const [date, setDate] = useState('All Time');

  // Expanded Order State for Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Realtime subscription
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    // Also add a tracking event for this status change
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const newEvent = {
      status: newStatus.toLowerCase().replace(' ', '_'),
      label: `Order ${newStatus}`,
      message: `Order status updated to ${newStatus}`,
      location: 'Admin Panel',
      timestamp: new Date().toISOString(),
      source: 'admin'
    };

    // Cast tracking_events to array (in case it comes as jsonb/object from DB, typical JS quirk with supabase types)
    const currentEvents = Array.isArray(order.tracking_events) ? order.tracking_events : [];
    const updatedEvents = [...currentEvents, newEvent];

    const { error } = await supabase.from('orders').update({
      status: newStatus,
      tracking_events: updatedEvents
    }).eq('id', id);

    if (error) {
      alert("Failed to update status");
    } else {
      // Local update optimization could be here, but fetchOrders via realtime or manual refresh handles it
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, tracking_events: updatedEvents as any });
      }
    }
  };

  const updateCourierInfo = async (id: string, courierName: string, trackingNumber: string, trackingUrl: string) => {
    const { error } = await supabase.from('orders').update({
      courier_info: {
        name: courierName,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl
      }
    }).eq('id', id);

    if (error) alert("Failed to update courier info");
    else {
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        const updated = { ...selectedOrder, courier_info: { name: courierName, tracking_number: trackingNumber, tracking_url: trackingUrl } };
        setSelectedOrder(updated);
      }
    }
  };


  // Filtered orders
  let filtered = orders.filter((o) =>
    (status === 'All Orders' || o.status === status) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()))
  );

  // Summary counts
  const total = orders.length;
  const pending = orders.filter(o => o.status === 'Pending').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const returned = orders.filter(o => o.status === 'Returned' || o.status === 'Cancelled').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-silver">Orders</h1>
        <button onClick={fetchOrders} className="text-sm text-silver underline">Refresh</button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Order ID, Customer Name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] p-2 rounded bg-gray-900 text-white border border-gray-700"
        />
        <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-700">
          {statusOptions.map(s => <option key={s}>{s}</option>)}
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
          <div className="text-xs text-gray-400 mb-1">Cancelled</div>
          <div className="text-2xl font-bold text-red-400">{returned}</div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-8 bg-gray-900 rounded">No orders found.</div>
        ) : (
          filtered.map((o) => (
            <div key={o.id} className="bg-gray-900 rounded-lg border border-gray-800 flex flex-col md:flex-row items-center md:items-stretch p-4 gap-4">
              <div className="flex flex-col items-center md:items-start w-24 min-w-[80px]">
                <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded mb-2">Order</span>
              </div>
              <div className="flex-1 cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors" onClick={() => setSelectedOrder(o as unknown as Order)}>
                <div className="font-semibold text-white text-lg mb-1">{o.customer_name} <span className="text-xs text-blue-400 ml-2">(Click to View Details)</span></div>
                <div className="text-xs text-gray-400 mb-1">ID: {o.id}</div>
                <div className="text-xs text-gray-400 mb-1">Total: ₹{o.total_amount?.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mb-1">Email: {o.customer_email}</div>
                {/* Courier Preview */}
                {o.courier_info?.name && o.courier_info.name !== "Not Assigned" && (
                  <div className="text-xs text-green-400 mt-1">🚚 {o.courier_info.name} ({o.courier_info.tracking_number || 'No #'})</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 min-w-[120px]">
                <div className="text-xs text-gray-400 mb-1">{new Date(o.created_at).toLocaleDateString()}</div>
                <div className={`text-xs text-white px-2 py-1 rounded ${statusColors[o.status] || 'bg-gray-600'}`}>{o.status}</div>

                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                  className="bg-gray-800 text-xs text-white border border-gray-700 rounded p-1 mt-2"
                >
                  {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white">Order Details: {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Customer</label>
                  <div className="text-white">{selectedOrder.customer_name}</div>
                  <div className="text-sm text-gray-400">{selectedOrder.customer_email}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Amount</label>
                  <div className="text-white text-xl">₹{selectedOrder.total_amount?.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 capitalize">{selectedOrder.payment_info?.method || 'Method N/A'} - {selectedOrder.payment_info?.status || 'Status N/A'}</div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="bg-gray-800 p-3 rounded">
                  <h3 className="text-sm font-bold text-gray-300 mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-400">
                    {selectedOrder.shipping_address.name}<br />
                    {selectedOrder.shipping_address.address}, {selectedOrder.shipping_address.city}<br />
                    {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}<br />
                    {selectedOrder.shipping_address.phone}
                  </div>
                </div>
              )}

              {/* Courier Management */}
              <div className="bg-gray-800 p-3 rounded border border-gray-700">
                <h3 className="text-sm font-bold text-gray-300 mb-3">Courier / Shipping</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Carrier Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 border border-gray-600 rounded p-1 text-sm text-white"
                      defaultValue={selectedOrder.courier_info?.name || ''}
                      id="courierName"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Tracking Number</label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 border border-gray-600 rounded p-1 text-sm text-white"
                      defaultValue={selectedOrder.courier_info?.tracking_number || ''}
                      id="trackingNumber"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500 block mb-1">Tracking URL</label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 border border-gray-600 rounded p-1 text-sm text-white"
                      defaultValue={selectedOrder.courier_info?.tracking_url || ''}
                      id="trackingUrl"
                    />
                  </div>
                </div>
                <button
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded w-full"
                  onClick={() => {
                    const name = (document.getElementById('courierName') as HTMLInputElement).value;
                    const num = (document.getElementById('trackingNumber') as HTMLInputElement).value;
                    const url = (document.getElementById('trackingUrl') as HTMLInputElement).value;
                    updateCourierInfo(selectedOrder.id, name, num, url);
                  }}
                >
                  Update Courier Details
                </button>
              </div>

              {/* Timeline */}
              <div className="bg-gray-800 p-3 rounded">
                <h3 className="text-sm font-bold text-gray-300 mb-3">Tracking Timeline</h3>
                <div className="space-y-4 border-l-2 border-gray-600 ml-2 pl-4 relative">
                  {/* Events list */}
                  {(selectedOrder.tracking_events && Array.isArray(selectedOrder.tracking_events)) ?
                    selectedOrder.tracking_events.map((evt, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-800"></div>
                        <div className="text-sm text-white font-medium">{evt.label} <span className="text-xs text-gray-500 ml-2">{new Date(evt.timestamp).toLocaleString()}</span></div>
                        <div className="text-xs text-gray-400 mt-1">{evt.message}</div>
                        {evt.location && <div className="text-xs text-gray-500 mt-1">📍 {evt.location}</div>}
                      </div>
                    ))
                    : <div className="text-xs text-gray-500">No events yet. change status to generate events.</div>}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersSection; 