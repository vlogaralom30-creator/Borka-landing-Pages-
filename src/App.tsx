import React, { useState, useEffect } from 'react';
import { StoreConfig, Order, OrderStatus, AdminUser, DatabaseMode } from './types';
import {
  DEFAULT_STORE_CONFIG,
  loadStoreConfig,
  saveStoreConfig,
  loadOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getDatabaseMode
} from './utils/storage';
import { LandingPage } from './components/landing/LandingPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mode, setMode] = useState<DatabaseMode>('demo-local');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Check URL routes for admin: /admin, /admin/panel, #admin, ?admin=true
  const checkAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    return (
      path.includes('/admin') ||
      path.includes('/panel') ||
      hash.includes('#admin') ||
      search.includes('admin=') ||
      search.includes('admin=true') ||
      search.includes('admin=panel')
    );
  };

  useEffect(() => {
    // Check initial route
    setIsAdminRoute(checkAdminRoute());

    // Check stored admin session
    const savedSession = sessionStorage.getItem('naxxivo_admin_session');
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch (e) {
        sessionStorage.removeItem('naxxivo_admin_session');
      }
    }

    // Listen for hash / popstate changes
    const handleUrlChange = () => {
      setIsAdminRoute(checkAdminRoute());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      setLoading(true);
      const [fetchedConfig, fetchedOrders] = await Promise.all([
        loadStoreConfig(),
        loadOrders()
      ]);
      setConfig(fetchedConfig);
      setOrders(fetchedOrders);
      setMode(getDatabaseMode());
      setLoading(false);
    }
    init();
  }, []);

  // Sync data manually when needed
  const refreshAllData = async () => {
    const [fetchedConfig, fetchedOrders] = await Promise.all([
      loadStoreConfig(),
      loadOrders()
    ]);
    setConfig(fetchedConfig);
    setOrders(fetchedOrders);
    setMode(getDatabaseMode());
  };

  const handlePlaceOrder = async (newOrder: Order) => {
    await createOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
  };

  const handleSaveConfig = async (newConfig: StoreConfig) => {
    setConfig(newConfig);
    await saveStoreConfig(newConfig);
    setMode(getDatabaseMode());
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await updateOrderStatus(orderId, status);
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    await deleteOrder(orderId);
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('naxxivo_admin_session');
    setCurrentUser(null);
    window.location.hash = '';
    setIsAdminRoute(false);
  };

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminRoute(true);
  };

  const navigateToStorefront = () => {
    window.location.hash = '';
    setIsAdminRoute(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-neutral-600 tracking-wide uppercase">
            Naxxivo Store লোডিং হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // Admin Route: Check if user is logged in
  if (isAdminRoute) {
    if (!currentUser) {
      return (
        <AdminLogin
          mode={mode}
          onLoginSuccess={handleLoginSuccess}
          onBackToStore={navigateToStorefront}
        />
      );
    }

    return (
      <AdminDashboard
        config={config}
        orders={orders}
        mode={mode}
        currentUser={currentUser}
        onSaveConfig={handleSaveConfig}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onRefreshData={refreshAllData}
        onSwitchToStorefront={navigateToStorefront}
        onLogout={handleLogout}
      />
    );
  }

  // Normal Customer Storefront (Clean, zero admin buttons for regular visitors)
  return (
    <LandingPage
      config={config}
      onPlaceOrder={handlePlaceOrder}
      onNavigateToAdmin={navigateToAdmin}
    />
  );
}
