import React, { useState } from 'react';
import { AdminUser, DatabaseMode } from '../../types';
import { authenticateWithSupabase } from '../../utils/supabase';

interface AdminLoginProps {
  mode: DatabaseMode;
  onLoginSuccess: (user: AdminUser) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  mode,
  onLoginSuccess,
  onBackToStore
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isDemo = mode === 'demo-local';

  const handleQuickDemoLogin = () => {
    const demoUser: AdminUser = {
      id: 'demo-admin-1',
      email: 'admin@naxxivo.online',
      name: 'Rony Ahammad (Naxxivo Demo)',
      role: 'admin'
    };
    sessionStorage.setItem('naxxivo_admin_session', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isDemo) {
      // In demo mode, accept any non-empty input or default admin
      const trimmedEmail = email.trim();
      const demoUser: AdminUser = {
        id: 'demo-admin-1',
        email: trimmedEmail || 'admin@naxxivo.online',
        name: 'Store Owner',
        role: 'admin'
      };
      sessionStorage.setItem('naxxivo_admin_session', JSON.stringify(demoUser));
      setLoading(false);
      onLoginSuccess(demoUser);
      return;
    }

    // In Supabase Cloud mode: authenticate with real database
    const result = await authenticateWithSupabase(email.trim(), password);
    setLoading(false);

    if (result.success && result.user) {
      sessionStorage.setItem('naxxivo_admin_session', JSON.stringify(result.user));
      onLoginSuccess(result.user);
    } else {
      setErrorMsg(result.error || 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।');
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-4">
      <div className="bg-[#1C1C1C] border border-[#333333] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#B8975A] text-black font-extrabold flex items-center justify-center text-xl mx-auto shadow-md">
            N
          </div>
          <span className="text-[11px] font-mono tracking-[0.2em] text-[#B8975A] uppercase block pt-1">
            NAXXIVO ADMIN
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            স্টোর অ্যাডমিন লগইন
          </h2>
          <p className="text-xs text-neutral-400">
            অর্ডার, প্রোডাক্ট ও থিম কাস্টমাইজেশন প্যানেল
          </p>
        </div>

        {/* Database Mode Banner */}
        <div
          className={`p-3 rounded-2xl text-xs flex items-center justify-between border ${
            isDemo
              ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
              : 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{isDemo ? '🌟' : '⚡'}</span>
            <div>
              <strong className="block font-bold">
                {isDemo ? 'লোকাল ডেমো মোড সক্রিয়' : 'Supabase ক্লাউড কানেক্টেড'}
              </strong>
              <span className="text-[10px] opacity-80">
                {isDemo
                  ? 'সুপাবেস ছাড়াও সম্পূর্ণ ড্যাশবোর্ড টেস্ট করা যাবে'
                  : 'ক্লাউড ডেটাবেস প্রটেকশন চালু রয়েছে'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Demo Login Option */}
        {isDemo && (
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-3 px-4 rounded-xl bg-[#B8975A] hover:bg-[#9E7E43] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <span>⚡ ১-ক্লিকে কুইক ডেমো লগইন</span>
          </button>
        )}

        {isDemo && (
          <div className="flex items-center gap-3 text-neutral-500 text-xs">
            <span className="h-[1px] bg-neutral-800 flex-1" />
            <span>অথবা ম্যানুয়াল লগইন</span>
            <span className="h-[1px] bg-neutral-800 flex-1" />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              অ্যাডমিন ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isDemo ? 'admin@naxxivo.online' : 'আপনার ইমেইল দিন'}
              required={!isDemo}
              className="w-full px-4 py-3 text-xs md:text-sm bg-[#141414] border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8975A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required={!isDemo}
              className="w-full px-4 py-3 text-xs md:text-sm bg-[#141414] border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8975A]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs rounded-xl">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs md:text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>যাচাই হচ্ছে...</span>
            ) : (
              <span>ড্যাশবোর্ডে প্রবেশ করুন →</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <button
            type="button"
            onClick={onBackToStore}
            className="hover:text-white transition-colors"
          >
            ← স্টোরফ্রন্টে ফিরে যান
          </button>
          <a
            href="https://naxxivo.online"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B8975A] transition-colors font-medium text-[11px]"
          >
            Naxxivo.online
          </a>
        </div>
      </div>
    </div>
  );
};
