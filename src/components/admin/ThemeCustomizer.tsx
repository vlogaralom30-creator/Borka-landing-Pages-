import React, { useState } from 'react';
import { StoreConfig, ThemePreset } from '../../types';
import { THEMES } from '../common/ThemeConfig';

interface ThemeCustomizerProps {
  config: StoreConfig;
  onSave: (updatedConfig: Partial<StoreConfig>) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ config, onSave }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(config.theme);
  const [brandName, setBrandName] = useState(config.brandName);
  const [brandTagline, setBrandTagline] = useState(config.brandTagline);
  const [announcement, setAnnouncement] = useState(config.announcement);

  const [insideDhaka, setInsideDhaka] = useState(config.delivery.insideDhaka);
  const [outsideDhaka, setOutsideDhaka] = useState(config.delivery.outsideDhaka);

  const [whatsappNumber, setWhatsappNumber] = useState(config.contact.whatsappNumber);
  const [phone, setPhone] = useState(config.contact.phone);
  const [messengerUrl, setMessengerUrl] = useState(config.contact.messengerUrl);

  const [agencyName, setAgencyName] = useState(config.agencyBranding.agencyName || 'Naxxivo');
  const [creatorName, setCreatorName] = useState(config.agencyBranding.creatorName || 'Rony Ahammad');
  const [websiteUrl, setWebsiteUrl] = useState(config.agencyBranding.websiteUrl || 'https://naxxivo.online');
  const [agencyContact, setAgencyContact] = useState(config.agencyBranding.contactNumber);
  const [agencyEnabled, setAgencyEnabled] = useState(config.agencyBranding.enabled);

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    onSave({
      theme: selectedTheme,
      brandName,
      brandTagline,
      announcement,
      delivery: {
        insideDhaka: Number(insideDhaka),
        outsideDhaka: Number(outsideDhaka)
      },
      contact: {
        whatsappNumber,
        phone,
        messengerUrl
      },
      agencyBranding: {
        agencyName,
        creatorName,
        websiteUrl,
        contactNumber: agencyContact,
        enabled: agencyEnabled
      }
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top action save */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm sticky top-16 z-20">
        <div>
          <h3 className="text-base font-bold text-neutral-900">থিম ও ব্র্যান্ডিং কাস্টমাইজেশন</h3>
          <p className="text-xs text-neutral-500">আপনার ব্র্যান্ড অনুযায়ী ডিজাইন ও তথ্য সাজিয়ে নিন</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <span>💾 সেটিংস সেভ করুন</span>
        </button>
      </div>

      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold">
          <span>✓</span> সেটিংস সফলভাবে আপডেট হয়েছে!
        </div>
      )}

      {/* 1. Theme Presets */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ১. প্রিমিয়াম ডিজাইন থিম নির্বাচন করুন
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Object.values(THEMES).map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'border-neutral-900 bg-neutral-50 shadow-md ring-2 ring-neutral-900/10' : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-900">{theme.name}</span>
                  {isSelected && <span className="text-neutral-900 font-bold text-sm">✓</span>}
                </div>

                {/* Color swatches preview */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: theme.bgCanvas }} title="Canvas Background" />
                  <span className="w-5 h-5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: theme.accentText }} title="Accent Color" />
                  <span className="w-5 h-5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: theme.cardBorder }} title="Border Tone" />
                </div>

                <span className="inline-block text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                  {theme.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Identity */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ২. ব্র্যান্ড পরিচিতি ও নোটিশ বার
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              ব্র্যান্ড নাম (যেমন: HAUT MODESTY / AARONG)
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              ট্যাগলাইন / সাব-হেডিং
            </label>
            <input
              type="text"
              value={brandTagline}
              onChange={(e) => setBrandTagline(e.target.value)}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              টপ অ্যানাউন্সমেন্ট বার টেক্সট
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Delivery Charges */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ৩. ডেলিভারি চার্জ নির্ধারণ (টাকা)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              ঢাকা সিটির ভিতরে ডেলিভারি চার্জ (টাকা)
            </label>
            <input
              type="number"
              value={insideDhaka}
              onChange={(e) => setInsideDhaka(Number(e.target.value))}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              ঢাকা সিটির বাইরে ডেলিভারি চার্জ (টাকা)
            </label>
            <input
              type="number"
              value={outsideDhaka}
              onChange={(e) => setOutsideDhaka(Number(e.target.value))}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* 4. Contact Numbers */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ৪. কন্টাক্ট ও সোশ্যাল লিংক
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              WhatsApp নম্বর (যেমন 8801868278051)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              সরাসরি কল নম্বর (যেমন 01868278051)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Facebook Messenger URL (যেমন https://m.me/yourpage)
            </label>
            <input
              type="text"
              value={messengerUrl}
              onChange={(e) => setMessengerUrl(e.target.value)}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 5. Agency / Reseller White-label Branding */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div>
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              ৫. এজেন্সি হোয়াইট-লেবেল ফুটার (রিসেল ফিচার)
            </h4>
            <p className="text-xs text-neutral-500">
              আপনি যদি এই ওয়েবসাইটটি অন্য সেলারদের কাছে বিক্রি করতে চান, আপনার এজেন্সির ক্রেডিট শো করতে পারবেন।
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agencyEnabled}
              onChange={(e) => setAgencyEnabled(e.target.checked)}
              className="w-5 h-5 rounded accent-neutral-900 cursor-pointer"
            />
            <span className="text-xs font-bold text-neutral-800">সক্রিয়</span>
          </label>
        </div>

        {agencyEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                আপনার এজেন্সির নাম
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                এজেন্সি কন্টাক্ট ইনফো (WhatsApp)
              </label>
              <input
                type="text"
                value={agencyContact}
                onChange={(e) => setAgencyContact(e.target.value)}
                className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
