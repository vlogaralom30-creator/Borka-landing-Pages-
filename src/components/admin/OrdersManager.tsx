import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { formatTaka } from '../../utils/bangla';

interface OrdersManagerProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  onUpdateStatus,
  onDeleteOrder
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customer_name.toLowerCase().includes(q) ||
      order.customer_phone.includes(q) ||
      order.customer_address.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Calculate quick stats
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  // Status color tags
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200">অপেক্ষমাণ (Pending)</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200">কনফার্মড (Confirmed)</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-purple-200">কুরিয়ারে পাঠানো (Shipped)</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">ডেলিভার্ড (Delivered)</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-rose-200">বাতিল (Cancelled)</span>;
      default:
        return null;
    }
  };

  // Export to CSV for courier / spreadsheet
  const exportToCSV = () => {
    if (orders.length === 0) {
      alert('কোনো অর্ডার নেই');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Delivery Address',
      'Variant',
      'Size',
      'Include Hijab',
      'Delivery Area',
      'Total Amount (BDT)',
      'Status',
      'Note'
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.created_at).toLocaleString()}"`,
      `"${o.customer_name}"`,
      `"${o.customer_phone}"`,
      `"${o.customer_address.replace(/"/g, '""')}"`,
      `"${o.variant_name}"`,
      `"${o.size}"`,
      `"${o.include_hijab ? 'Yes' : 'No'}"`,
      `"${o.delivery_area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}"`,
      `"${o.total_amount}"`,
      `"${o.status}"`,
      `"${(o.customer_note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 font-medium block">মোট অর্ডার</span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">{totalOrders}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
          <span className="text-xs text-amber-700 font-medium block">পেন্ডিং অর্ডার</span>
          <span className="text-2xl font-bold text-amber-800 mt-1 block">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
          <span className="text-xs text-blue-700 font-medium block">কনফার্মড</span>
          <span className="text-2xl font-bold text-blue-800 mt-1 block">{confirmedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-xs text-emerald-700 font-medium block">মোট সম্ভাব্য বিক্রি</span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block">{formatTaka(totalRevenue)}</span>
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, ফোন বা অর্ডার ID দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 text-xs md:text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-800"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
            🔍
          </span>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs md:text-sm border border-neutral-300 rounded-xl px-3 py-2.5 bg-white font-medium focus:outline-none"
          >
            <option value="all">সব অর্ডার ({totalOrders})</option>
            <option value="pending">পেন্ডিং ({pendingCount})</option>
            <option value="confirmed">কনফার্মড</option>
            <option value="shipped">কুরিয়ার</option>
            <option value="delivered">ডেলিভার্ড</option>
            <option value="cancelled">বাতিল</option>
          </select>

          <button
            type="button"
            onClick={exportToCSV}
            className="text-xs md:text-sm bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-4 py-2.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>📥 CSV এক্সপোর্ট</span>
          </button>
        </div>
      </div>

      {/* 3. Orders Table / List */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-4xl">📦</span>
            <h4 className="text-base font-bold text-neutral-800 mt-2">এখনো কোনো অর্ডার পাওয়া যায়নি</h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              কাস্টমার যখন ল্যান্ডিং পেজে অর্ডার করবেন, সাথে সাথে এখানে রিয়েল-টাইমে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-[#FAF7F2] border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">আইডি ও সময়</th>
                  <th className="py-3 px-4">কাস্টমার</th>
                  <th className="py-3 px-4">পোশাক ও সাইজ</th>
                  <th className="py-3 px-4">বিল</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredOrders.map((order) => {
                  const dateStr = new Date(order.created_at).toLocaleDateString('bn-BD', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  const waChatUrl = `https://wa.me/88${order.customer_phone.replace(/^0/, '')}?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম ${order.customer_name} আপু/ভাইয়া! আমরা আপনার ${order.id} অর্ডারের বিষয়ে যোগাযোগ করছি। আপনি কি অর্ডারটি কনফার্ম করতে চান?`
                  )}`;

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-neutral-900 block">{order.id}</span>
                        <span className="text-[11px] text-neutral-400">{dateStr}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-neutral-900 block">{order.customer_name}</span>
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="text-xs text-blue-600 hover:underline font-mono"
                        >
                          {order.customer_phone}
                        </a>
                        <p className="text-[11px] text-neutral-500 truncate max-w-[200px]" title={order.customer_address}>
                          {order.customer_address}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-neutral-900 block">
                          {order.variant_name}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          সাইজ: {order.size} {order.include_hijab && '· (+হিজাব)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {formatTaka(order.total_amount)}
                        <span className="block text-[10px] text-neutral-400 font-normal">
                          {order.delivery_area === 'inside' ? 'ঢাকা ভিতরে' : 'ঢাকা বাইরে'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {getStatusBadge(order.status)}
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                            className="block text-[11px] border border-neutral-300 rounded px-1.5 py-0.5 bg-white text-neutral-700 focus:outline-none"
                          >
                            <option value="pending">পেন্ডিং</option>
                            <option value="confirmed">কনফার্মড</option>
                            <option value="shipped">কুরিয়ার</option>
                            <option value="delivered">ডেলিভার্ড</option>
                            <option value="cancelled">বাতিল</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Chat Button */}
                          <a
                            href={waChatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="WhatsApp Chat"
                          >
                            💬
                          </a>

                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                            title="বিস্তারিত দেখুন"
                          >
                            👁️
                          </button>

                          {/* Delete order */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`অর্ডার ${order.id} ডিলিট করতে চান?`)) {
                                onDeleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="ডিলিট"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Single Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-xs text-neutral-500 font-mono block">Order ID</span>
                <h3 className="text-lg font-bold text-neutral-900">{selectedOrder.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-neutral-900 text-xl font-bold w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50">
                <span className="text-neutral-500 block">কাস্টমার নাম</span>
                <span className="font-bold text-neutral-900 text-sm">{selectedOrder.customer_name}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50">
                <span className="text-neutral-500 block">ফোন নম্বর</span>
                <a href={`tel:${selectedOrder.customer_phone}`} className="font-bold text-blue-600 text-sm">
                  {selectedOrder.customer_phone}
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 text-xs">
              <span className="text-neutral-500 block mb-0.5">সম্পূর্ণ ঠিকানা</span>
              <p className="font-medium text-neutral-900 leading-relaxed">{selectedOrder.customer_address}</p>
              {selectedOrder.customer_note && (
                <p className="mt-2 pt-2 border-t border-neutral-200 text-neutral-600">
                  <strong className="text-neutral-900">নোট:</strong> {selectedOrder.customer_note}
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl border border-neutral-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>পোশাক:</span>
                <span className="font-bold">{selectedOrder.variant_name} (সাইজ: {selectedOrder.size})</span>
              </div>
              <div className="flex justify-between">
                <span>নুড হিজাব:</span>
                <span>{selectedOrder.include_hijab ? `হ্যাঁ (+${formatTaka(selectedOrder.hijab_price)})` : 'না'}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি এরিয়া:</span>
                <span>{selectedOrder.delivery_area === 'inside' ? 'ঢাকা ভিতরে' : 'ঢাকা বাইরে'} ({formatTaka(selectedOrder.delivery_charge)})</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-sm text-emerald-700">
                <span>সর্বমোট (ক্যাশ অন ডেলিভারি):</span>
                <span>{formatTaka(selectedOrder.total_amount)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`https://wa.me/88${selectedOrder.customer_phone.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold text-center hover:bg-[#1eb956] transition-colors"
              >
                💬 হোয়াটসঅ্যাপে মেসেজ
              </a>
              <a
                href={`tel:${selectedOrder.customer_phone}`}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold text-center hover:bg-neutral-800 transition-colors"
              >
                📞 কল করুন
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
