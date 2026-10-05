import React from 'react';
import { Order, StoreConfig } from '../../types';
import { formatTaka } from '../../utils/bangla';

interface SuccessModalProps {
  order: Order | null;
  config: StoreConfig;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ order, config, onClose }) => {
  if (!order) return null;

  const waMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি একটি নতুন অর্ডার করেছি।\nঅর্ডার আইডি: ${order.id}\nনাম: ${order.customer_name}\nফোন: ${order.customer_phone}\nআইটেম: ${order.variant_name} (সাইজ: ${order.size})\nহিজাব: ${order.include_hijab ? 'হ্যাঁ' : 'না'}\nঠিকানা: ${order.customer_address}\nসর্বমোট: ${order.total_amount} ৳ (ক্যাশ অন ডেলিভারি)`
  );

  const whatsappUrl = `https://wa.me/${config.contact.whatsappNumber}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center border border-neutral-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
          ✓
        </div>

        <span className="text-xs font-bold text-[#8B6B4A] uppercase tracking-wider">
          অর্ডার সফল হয়েছে!
        </span>
        <h3 className="text-xl font-bold text-neutral-900 mt-1">
          ধন্যবাদ, আপনার অর্ডারটি গ্রহণ করা হয়েছে
        </h3>
        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
          আমাদের প্রতিনিধি খুব শীঘ্রই আপনার দেওয়া নম্বরে কল করে অর্ডারটি কনফার্ম করবেন।
        </p>

        {/* Order Receipt Breakdown */}
        <div className="mt-4 text-left bg-[#FAF7F2] p-4 rounded-2xl border border-neutral-200 text-xs space-y-1.5">
          <div className="flex justify-between font-bold text-neutral-900 border-b pb-1.5 mb-1.5">
            <span>অর্ডার নম্বর:</span>
            <span className="font-mono text-[#8B6B4A]">{order.id}</span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>নাম:</span>
            <span className="font-medium text-neutral-900">{order.customer_name}</span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>ফোন:</span>
            <span className="font-medium text-neutral-900 font-sans">{order.customer_phone}</span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>পোশাক:</span>
            <span className="font-medium text-neutral-900">{order.variant_name} (সাইজ: {order.size})</span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>নুড হিজাব:</span>
            <span className="font-medium text-neutral-900">
              {order.include_hijab ? `হ্যাঁ (+${formatTaka(order.hijab_price)})` : 'না'}
            </span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>ডেলিভারি এরিয়া:</span>
            <span className="font-medium text-neutral-900">
              {order.delivery_area === 'inside' ? 'ঢাকা সিটির ভিতরে' : 'ঢাকা সিটির বাইরে'} ({formatTaka(order.delivery_charge)})
            </span>
          </div>
          <div className="flex justify-between font-bold text-neutral-900 pt-1.5 border-t text-sm">
            <span>সর্বমোট বিল (COD):</span>
            <span className="text-emerald-700 font-bold">{formatTaka(order.total_amount)}</span>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1eb956] transition-colors"
          >
            <span>💬 হোয়াটসঅ্যাপে দ্রুত কনফার্ম করুন</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-[#0B0B0B] text-white font-bold text-xs hover:bg-neutral-800 transition-colors"
          >
            ঠিক আছে
          </button>
        </div>
      </div>
    </div>
  );
};
