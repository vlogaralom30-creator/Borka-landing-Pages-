import React, { useState } from 'react';
import {
  getSavedSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
  getSupabaseSqlSchema
} from '../../utils/supabase';

interface SupabaseSettingsProps {
  onRefreshData: () => void;
}

export const SupabaseSettings: React.FC<SupabaseSettingsProps> = ({ onRefreshData }) => {
  const currentCreds = getSavedSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);

  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const isConfigured = Boolean(currentCreds.url && currentCreds.anonKey);

  const handleTestAndSave = async () => {
    setTesting(true);
    setStatusMessage(null);

    const result = await testSupabaseConnection(url.trim(), anonKey.trim());
    setTesting(false);

    if (result.success) {
      saveSupabaseCredentials(url.trim(), anonKey.trim());
      setStatusMessage({ success: true, text: result.message });
      onRefreshData();
    } else {
      setStatusMessage({ success: false, text: result.message });
    }
  };

  const handleClear = () => {
    if (confirm('সুপাবেস ক্রেডেনশিয়াল মুছে লোকাল স্টোরেজে ফিরে যেতে চান?')) {
      saveSupabaseCredentials('', '');
      setUrl('');
      setAnonKey('');
      setStatusMessage({ success: true, text: 'ক্রেডেনশিয়াল রিমুভ করা হয়েছে। এখন লোকাল স্টোরেজ ব্যবহার হচ্ছে।' });
      onRefreshData();
    }
  };

  const copySqlToClipboard = () => {
    const sql = getSupabaseSqlSchema();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-900">Supabase ক্লাউড ডাটাবেস ইন্টিগ্রেশন</h3>
            {isConfigured ? (
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                ● ক্লাউড কানেক্টেড
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                ● লোকাল স্টোরেজ মোড
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            সুপাবেস (Supabase PostgreSQL) যুক্ত করলে সব অর্ডার রিয়েলটাইমে ক্লাউডে সেভ হবে এবং একাধিক ডিভাইস থেকে অ্যাক্সেস করা যাবে। আপনি ক্লায়েন্টকে বিক্রি করার সময় শুধু তার Supabase লিংক বসিয়ে দিলেই হবে!
          </p>
        </div>

        {isConfigured && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold border border-rose-200 bg-rose-50 px-3 py-2 rounded-xl transition-all"
          >
            ডিসকানেক্ট করুন
          </button>
        )}
      </div>

      {/* 2. Credentials Form */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          Supabase প্রজেক্ট সেটিংস
        </h4>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Project URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzabcdefg.supabase.co"
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-mono"
            />
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              (Supabase Dashboard → Project Settings → API → Project URL)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Anon Public API Key <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-mono"
            />
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              (Supabase Dashboard → Project Settings → API → Project API keys → anon public)
            </span>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-bold border ${
              statusMessage.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {statusMessage.success ? '✓' : '⚠️'} {statusMessage.text}
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleTestAndSave}
            disabled={testing || !url.trim() || !anonKey.trim()}
            className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {testing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>কানেকশন ভেরিফাই হচ্ছে...</span>
              </>
            ) : (
              <span>⚡ কানেকশন টেস্ট ও সেভ করুন</span>
            )}
          </button>
        </div>
      </div>

      {/* 3. SQL Setup Script Generator */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div>
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Supabase SQL মাইগ্রেশন কোড (১ ক্লিকে রেডি)
            </h4>
            <p className="text-xs text-neutral-500">
              Supabase Dashboard এর SQL Editor এ গিয়ে এই স্ক্রিপ্টটি রান করলেই সব টেবিল ও পারমিশন স্বয়ংক্রিয়ভাবে তৈরি হয়ে যাবে।
            </p>
          </div>
          <button
            type="button"
            onClick={copySqlToClipboard}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
          >
            {copiedSql ? '✓ কপি করা হয়েছে!' : '📋 SQL কপি করুন'}
          </button>
        </div>

        <pre className="bg-[#111827] text-emerald-400 p-4 rounded-xl text-[11px] md:text-xs overflow-x-auto font-mono max-h-72 border border-neutral-800 leading-relaxed">
          {getSupabaseSqlSchema()}
        </pre>
      </div>
    </div>
  );
};
