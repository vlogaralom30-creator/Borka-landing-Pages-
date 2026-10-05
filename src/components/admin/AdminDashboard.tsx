import React, { useState } from 'react';
import { StoreConfig, Order, OrderStatus, CustomerReview, AdminUser, DatabaseMode } from '../../types';
import { OrdersManager } from './OrdersManager';
import { ProductEditor } from './ProductEditor';
import { ThemeCustomizer } from './ThemeCustomizer';
import { SupabaseSettings } from './SupabaseSettings';
import { ReviewsManager } from './ReviewsManager';
import { resetDemoData } from '../../utils/storage';

interface AdminDashboardProps {
  config: StoreConfig;
  orders: Order[];
  mode: DatabaseMode;
  currentUser: AdminUser;
  onSaveConfig: (newConfig: StoreConfig) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onRefreshData: () => void;
  onSwitchToStorefront: () => void;
  onLogout: () => void;
}

type AdminTab = 'orders' | 'product' | 'theme' | 'reviews' | 'supabase';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  orders,
  mode,
  currentUser,
  onSaveConfig,
  onUpdateOrderStatus,
  onDeleteOrder,
  onRefreshData,
  onSwitchToStorefront,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [resetToast, setResetToast] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const isDemo = mode === 'demo-local';

  const handleProductUpdate = (updatedProduct: StoreConfig['product']) => {
    onSaveConfig({
      ...config,
      product: updatedProduct
    });
  };

  const handleThemeUpdate = (updatedFields: Partial<StoreConfig>) => {
    onSaveConfig({
      ...config,
      ...updatedFields
    });
  };

  const handleReviewsUpdate = (updatedReviews: CustomerReview[]) => {
    onSaveConfig({
      ...config,
      reviews: updatedReviews
    });
  };

  const handleResetDemo = () => {
    if (confirm('আপনি কি ডেমো ডাটা রিসেট করে ডিফল্ট সেটিংসে ফিরে যেতে চান?')) {
      resetDemoData();
      onRefreshData();
      setResetToast(true);
      setTimeout(() => setResetToast(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-neutral-900 pb-20">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm md:text-base text-neutral-900">
                  {config.brandName} ড্যাশবোর্ড
                </span>

                {/* Mode Indicator Badge */}
                {isDemo ? (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>🌟</span> ডেমো মোড (Local)
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>⚡</span> ক্লাউড সিঙ্কড (Supabase)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">
                লগইন ইউজার: <strong className="text-neutral-800">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset Demo Data Button (Only in demo mode) */}
            {isDemo && (
              <button
                type="button"
                onClick={handleResetDemo}
                className="hidden sm:flex text-xs text-neutral-700 hover:text-neutral-900 font-semibold border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 px-3 py-2 rounded-xl transition-all items-center gap-1"
                title="রিসেট ডেমো ডাটা"
              >
                <span>🔄 ডেমো রিসেট</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSwitchToStorefront}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs md:text-sm px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>👁️ লাইভ স্টোর</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="text-neutral-500 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors text-xs font-bold border border-transparent hover:border-rose-200"
              title="লগআউট"
            >
              🚪
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-3.5 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <span>📦 অর্ডারসমূহ</span>
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('product')}
            className={`py-2.5 px-3.5 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'product'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            👗 প্রোডাক্ট ও অফার
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`py-2.5 px-3.5 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            🎨 থিম ও কাস্টমাইজ
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-2.5 px-3.5 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            ⭐ কাস্টমার রিভিউ
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`py-2.5 px-3.5 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            ⚡ Supabase ডাটাবেস
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {resetToast && (
          <div className="mb-4 bg-amber-500 text-white p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md">
            <span>✓ ডেমো ডাটা সফলভাবে ডিফল্ট সেটিংসে রিসেট হয়েছে!</span>
          </div>
        )}

        {activeTab === 'orders' && (
          <OrdersManager
            orders={orders}
            onUpdateStatus={onUpdateOrderStatus}
            onDeleteOrder={onDeleteOrder}
          />
        )}

        {activeTab === 'product' && (
          <ProductEditor
            config={config}
            onSave={handleProductUpdate}
          />
        )}

        {activeTab === 'theme' && (
          <ThemeCustomizer
            config={config}
            onSave={handleThemeUpdate}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsManager
            reviews={config.reviews}
            onSave={handleReviewsUpdate}
          />
        )}

        {activeTab === 'supabase' && (
          <SupabaseSettings
            onRefreshData={onRefreshData}
          />
        )}
      </main>

      {/* Agency Footer Credit */}
      <footer className="mt-16 text-center text-xs text-neutral-400 py-6 border-t border-neutral-200">
        <p className="font-semibold text-neutral-600">
          Developed by Naxxivo · Creator: Rony Ahammad
        </p>
        <p className="text-[11px] mt-0.5">
          Official Site:{' '}
          <a
            href="https://naxxivo.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-700 hover:text-black font-semibold underline"
          >
            naxxivo.online
          </a>
        </p>
      </footer>
    </div>
  );
};
