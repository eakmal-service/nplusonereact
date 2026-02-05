import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  tracking_id?: string; // AWB
  created_at: string;
  tracking_events?: any[];
  courier_info?: any;
  payment_info?: any;
  shipping_address?: any;
}

// Workflow Tabs - Adjusted for strict flow
const TABS = ['On Hold', 'Pending', 'Processing', 'Ready to Ship', 'Shipped', 'Cancelled', 'All Orders'];

// DB Status Mapping
const STATUS_MAP: Record<string, string[]> = {
  'On Hold': ['ON_HOLD', 'RTO'], // RTO goes here too for review
  'Pending': ['PENDING'], // New Orders Only
  'Processing': ['PROCESSING'], // Accepted, Ready for Label
  'Ready to Ship': ['READY_TO_SHIP'], // Label Printed
  'Shipped': ['SHIPPED', 'DELIVERED'],
  'Cancelled': ['CANCELLED', 'RETURNED'],
  'All Orders': [] // Special case
};

const OrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();
    return () => { supabase.removeChannel(channel) };
  }, []);

  // Filter Logic
  const filteredOrders = orders.filter(o => {
    // 1. Tab Filter
    let matchesTab = false;
    if (activeTab === 'All Orders') matchesTab = true;
    else {
      const allowedStatuses = STATUS_MAP[activeTab];
      matchesTab = allowedStatuses.includes(o.status);
    }

    // 2. Search Filter
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      (o.tracking_id || '').toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Actions
  const handleStatusUpdate = async (orderId: string, newStatus: string, actionLabel: string) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          trackingEvent: {
            status: newStatus.toLowerCase(),
            label: actionLabel,
            message: `Admin status update: ${newStatus}`,
            timestamp: new Date().toISOString()
          }
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Optimistic Update
      fetchOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrintLabel = async (awb: string, orderId: string) => {
    // Note: If no AWB yet, we might trigger creation, but usually backend does it. 
    // Here we assume "Processing" state implies we need to GENERATE label. 
    // But our label API expects an AWB number? 
    // Wait, the previous logic assumed AWB exists. 
    // If we are in "Processing", we don't have an AWB yet because we disabled auto-ship.
    // So "Print Label" button should actually TRIGGER SHIPMENT CREATION first if AWB is missing.

    // BUT the user said "Action: Admin Prints Label -> Backend API call -> AWB Generate".
    // So this button is actually "Generate & Print Label".

    setActionLoading(true);
    try {
      // We probably need a new API endpoint or modify 'label' route to support "create shipment if missing" logic?
      // OR we just use the 'place-cod' logic but exposed as an admin action?
      // Let's assume we need to trigger shipment creation here.

      // For now, let's assume the user meant we call the label API. 
      // If AWB is missing, we can't print label. 
      // We need a "Generate Label" action.
      // Let's ADD a "Generate Label" button in Processing tab.

      alert("Integrate 'Generate Shipment' API here. For now, assuming you need to generate it manually or via another mechanism.");

      // TODO: This part needs clarification or a specific "Shipment" API. 
      // The user says "iThink/Delhivery API call -> AWB Number generate -> PDF download".
      // This is exactly what createShipment does.
      // I should probably make an endpoint `/api/admin/logistics/create-shipment`

    } catch (e) {
      alert("Failed to print label");
    } finally {
      setActionLoading(false);
    }
  };

  // Actually, I need to implement the "Generate Label" logic properly.
  // The 'label' API just prints existing labels.
  // We need an action to CREATE shipment.

  const handleGenerateLabel = async (orderId: string) => {
    if (!confirm("Generate Shipping Label? This will book the shipment with courier.")) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/logistics/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to generate");

      alert(`Label Generated! AWB: ${data.awb}`);
      fetchOrders(); // Should move to Ready to Ship
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Re-using print label for existing AWBs
  const handleDownloadLabel = async (awb: string) => {
    if (!awb) return alert("No AWB found");
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/logistics/label', {
        method: 'POST',
        body: JSON.stringify({ awb_numbers: [awb] })
      });
      const data = await res.json();
      if (data.data && typeof data.data === 'string' && data.data.startsWith('http')) {
        window.open(data.data, '_blank');
      } else if (data.file_url) {
        window.open(data.file_url, '_blank');
      } else {
        alert("Label PDF URL not found in response:\n" + JSON.stringify(data, null, 2));
      }
    } catch (e) { alert("Error downloading label"); }
    finally { setActionLoading(false); }
  }

  const handlePrintManifest = async (awb: string) => {
    if (!awb) return alert("No AWB Number found!");
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/logistics/manifest', {
        method: 'POST',
        body: JSON.stringify({ awb_numbers: [awb] })
      });
      const data = await res.json();
      console.log("Manifest Response:", data);
      if (data.data) {
        window.open(data.data, '_blank');
      } else {
        alert("Manifest generated details in console.");
      }
    } catch (e) {
      alert("Failed to generate manifest");
    } finally {
      setActionLoading(false);
    }
  };


  const statusOptions = ['Pending', 'Processing', 'Ready to Ship', 'Shipped', 'Delivered', 'Cancelled', 'On Hold', 'RTO'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-silver mb-6">Order Manager</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-2 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Refresh */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Order ID, Name, AWB..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 text-white p-2 rounded"
        />
        <button onClick={fetchOrders} className="text-silver underline text-sm">Refresh</button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? <div className="text-gray-400">Loading...</div> :
          filteredOrders.length === 0 ? <div className="text-gray-500">No orders in {activeTab}</div> :
            filteredOrders.map(order => (
              <div key={order.id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Main Info */}
                <div className="flex-1 cursor-pointer" onClick={() => setSelectedOrder(order as any)}>
                  <div className="flex justify-between">
                    <span className="font-bold text-white text-lg">{order.customer_name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${order.status === 'CANCELLED' ? 'bg-red-900 text-red-200' :
                      order.status === 'SHIPPED' ? 'bg-green-900 text-green-200' :
                        order.status === 'PENDING' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-blue-900 text-blue-200'
                      }`}>{order.status}</span>
                  </div>
                  <div className="text-sm text-gray-400">Order ID: {order.id}</div>
                  <div className="text-sm text-gray-400">AWB: {order.tracking_id || 'Pending'}</div>
                  <div className="text-gray-300 font-bold mt-1">₹{order.total_amount} <span className="text-xs font-normal text-gray-500">({order.payment_info?.method || 'Method N/A'})</span></div>
                </div>

                {/* Quick Actions based on Tab */}
                <div className="flex flex-col gap-2 min-w-[150px]">

                  {/* 1. Pending (New) -> Accept or Hold */}
                  {activeTab === 'Pending' && (
                    <>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'PROCESSING', 'Order Accepted')}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 px-2 rounded font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'ON_HOLD', 'Order Rejected/Review')}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-yellow-500 text-xs py-2 px-2 rounded"
                        >
                          Review
                        </button>
                      </div>
                      <button className="bg-gray-800 text-gray-500 text-xs py-1 px-2 rounded cursor-not-allowed">Print Label (Locked)</button>
                    </>
                  )}

                  {/* 2. Processing (Accepted) -> Print Label (Generate) */}
                  {/* 2. Processing (Accepted) -> Generate or Print Label */}
                  {activeTab === 'Processing' && (
                    <>
                      {order.tracking_id ? (
                        <button
                          onClick={() => handleDownloadLabel(order.tracking_id!)}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs py-2 px-2 rounded font-medium"
                        >
                          Download Label (4x6)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGenerateLabel(order.id)}
                          disabled={actionLoading}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-2 rounded font-medium"
                        >
                          Generate Label
                        </button>
                      )}

                      {order.tracking_id && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'READY_TO_SHIP', 'Marked Ready')}
                          className="bg-green-600 hover:bg-green-500 text-white text-xs py-2 px-2 rounded"
                        >
                          Mark Ready to Ship
                        </button>
                      )}
                    </>
                  )}

                  {/* 3. Ready to Ship (Label Done) -> Manifest & Handover */}
                  {activeTab === 'Ready to Ship' && (
                    <>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadLabel(order.tracking_id!)}
                          disabled={!order.tracking_id}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded"
                        >
                          Reprint Label
                        </button>
                        <button
                          onClick={() => handlePrintManifest(order.tracking_id!)}
                          disabled={!order.tracking_id || actionLoading}
                          className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs py-1 px-2 rounded"
                        >
                          Manifest
                        </button>
                      </div>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'SHIPPED', 'Marked Shipped (Handover)')}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-500 text-white text-xs py-2 px-2 rounded font-medium"
                      >
                        Mark Shipped
                      </button>
                    </>
                  )}

                  {/* 4. On Hold -> Release */}
                  {activeTab === 'On Hold' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'PROCESSING', 'Released from Hold')}
                      className="bg-gray-600 text-white text-xs py-2 px-2 rounded"
                    >
                      Release (Approve)
                    </button>
                  )}
                </div>
              </div>
            ))
        }
      </div>

      {/* Simple Modal Preview */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Details: {selectedOrder.customer_name}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white px-2">X</button>
            </div>
            <div className="space-y-4 text-sm text-gray-300">
              <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
              <p><strong>Phone:</strong> {(selectedOrder.shipping_address as any)?.mobile || (selectedOrder.shipping_address as any)?.phoneNumber || 'N/A'}</p>
              <p><strong>Address:</strong><br />
                {(selectedOrder.shipping_address as any)?.address || 'N/A'}, {(selectedOrder.shipping_address as any)?.city}<br />
                {(selectedOrder.shipping_address as any)?.pincode}
              </p>
              <p><strong>Timeline:</strong></p>
              <div className="max-h-40 overflow-y-auto border border-gray-700 p-2 rounded">
                {selectedOrder.tracking_events?.map((e: any, i) => (
                  <div key={i} className="text-xs mb-2 border-b border-gray-800 pb-1">
                    <span className="text-blue-400">{new Date(e.timestamp).toLocaleString()}</span>: {e.message}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block">Manual Status Override</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value, 'Manual Override')}
                  className="bg-gray-800 text-white text-xs p-1 rounded w-full border border-gray-600"
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {selectedOrder.status !== 'CANCELLED' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'CANCELLED', 'Cancelled by Admin')}
                  className="bg-red-900 hover:bg-red-800 text-red-200 px-4 py-2 rounded text-xs"
                >
                  Cancel
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} className="bg-gray-700 text-white px-4 py-2 rounded text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;