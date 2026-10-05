import React, { useState, useEffect, useRef } from 'react';
import { StoreConfig, Order } from '../../types';
import { THEMES } from '../common/ThemeConfig';
import { ProductGallery } from './ProductGallery';
import { OrderForm } from './OrderForm';
import { SuccessModal } from './SuccessModal';
import { toBanglaDigits } from '../../utils/bangla';

interface LandingPageProps {
  config: StoreConfig;
  onPlaceOrder: (order: Order) => void;
  onNavigateToAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  config,
  onPlaceOrder,
  onNavigateToAdmin
}) => {
  const theme = THEMES[config.theme] || THEMES['luxury-gold'];
  const { product } = config;

  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Countdown timer with localStorage persistence
  const [mins, setMins] = useState('২৯');
  const [secs, setSecs] = useState('৫৮');

  const heroCtaRef = useRef<HTMLAnchorElement>(null);
  const orderSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const STORAGE_KEY = 'naxxivo_abaya_offer_expiry';
    const DURATION_MS = (config.product.countdownMinutes || 30) * 60 * 1000;

    let expiry = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!expiry || parseInt(expiry, 10) <= now) {
      expiry = (now + DURATION_MS).toString();
      localStorage.setItem(STORAGE_KEY, expiry);
    }

    const interval = setInterval(() => {
      const currentExpiry = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
      let diff = currentExpiry - Date.now();

      if (diff <= 0) {
        const nextExpiry = Date.now() + DURATION_MS;
        localStorage.setItem(STORAGE_KEY, nextExpiry.toString());
        diff = DURATION_MS;
      }

      const totalSecs = Math.floor(diff / 1000);
      const m = Math.floor(totalSecs / 60);
      const s = totalSecs % 60;

      setMins(toBanglaDigits(m.toString().padStart(2, '0')));
      setSecs(toBanglaDigits(s.toString().padStart(2, '0')));
    }, 1000);

    return () => clearInterval(interval);
  }, [config.product.countdownMinutes]);

  // Scroll listener for sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('heroOrderCta');
      const orderEl = document.getElementById('orderSection');

      if (!heroEl || !orderEl) return;

      const heroRect = heroEl.getBoundingClientRect();
      const orderRect = orderEl.getBoundingClientRect();

      const pastHero = heroRect.bottom < 0;
      const inOrder = orderRect.top < window.innerHeight && orderRect.bottom > 0;

      if (pastHero && !inOrder) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderComplete = (order: Order) => {
    onPlaceOrder(order);
    setRecentOrder(order);
  };

  const whatsappLink = `https://wa.me/${config.contact.whatsappNumber}?text=${encodeURIComponent(
    'আসসালামু আলাইকুম, আমি কোট স্টাইল আবায়া বোরকা সম্পর্কে বিস্তারিত জানতে চাই।'
  )}`;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.bgCanvas }}
    >
      {/* ==================== 1. ANNOUNCEMENT BAR (Clean for buyers, no admin buttons) ==================== */}
      <header className="sticky top-0 z-40 bg-[#0B0B0B] text-white border-b border-neutral-800">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-center text-xs tracking-wide">
          <div className="flex items-center gap-1.5 font-medium">
            <span>{config.announcement}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-xl mx-auto px-4 pt-3 pb-36 md:pt-6">
        {/* BRAND WORDMARK */}
        <div className="text-center py-2 mb-2">
          <span
            className="font-display tracking-[0.2em] text-xs font-semibold uppercase"
            style={{ color: theme.accentText }}
          >
            {config.brandName}
          </span>
          <h1
            className="text-lg md:text-xl font-bold tracking-tight mt-0.5"
            style={{ color: theme.priceColor }}
          >
            {config.brandTagline}
          </h1>
        </div>

        {/* ==================== 2. PRODUCT GALLERY ==================== */}
        <ProductGallery
          images={product.galleryImages}
          discountText={product.discountText}
          theme={theme}
        />

        {/* ==================== 3. PRICE BLOCK ==================== */}
        <section
          className="mt-4 rounded-2xl p-4 border shadow-sm"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                ধামাকা অফার মূল্য
              </span>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span
                  className="text-3xl md:text-4xl font-extrabold font-display tracking-tight"
                  style={{ color: theme.priceColor }}
                >
                  {toBanglaDigits(product.basePrice)}{' '}
                  <span className="text-2xl font-bold font-sans">৳</span>
                </span>
                {product.oldPrice > product.basePrice && (
                  <span className="text-base md:text-lg text-neutral-400 line-through font-semibold">
                    {toBanglaDigits(product.oldPrice)} ৳
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span
                className="inline-block text-xs font-bold px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.accentText,
                  borderColor: theme.accentBorder
                }}
              >
                {toBanglaDigits(product.oldPrice - product.basePrice)} ৳ সাশ্রয় ({product.discountText})
              </span>
              <p className="text-[11px] text-neutral-500 mt-1">ক্যাশ অন ডেলিভারি সুবিধা</p>
            </div>
          </div>
        </section>

        {/* ==================== 4. PRIMARY CTA BUTTON ==================== */}
        <section className="mt-3.5">
          <a
            href="#orderSection"
            id="heroOrderCta"
            ref={heroCtaRef}
            className={`btn-shine w-full block text-center py-4 px-6 rounded-2xl font-bold text-lg md:text-xl shadow-md transition-all active:scale-[0.99] ${theme.primaryBtn} ${theme.primaryBtnHover}`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>অর্ডার করতে এখানে ক্লিক করুন</span>
              <svg className="w-5 h-5 inline-block animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </a>
        </section>

        {/* ==================== 5. URGENCY STRIP ==================== */}
        <section className="mt-3 bg-[#FFF5F5] rounded-2xl p-3.5 border border-[#FED7D7]">
          <div className="flex items-center justify-between text-xs font-bold text-[#9B1C1C]">
            <div className="flex items-center gap-1.5">
              <span className="text-base animate-pulse">🔥</span>
              <span>স্টকে মাত্র <span className="font-bold underline text-sm">{toBanglaDigits(product.stockRemaining)}</span> পিস বাকি!</span>
            </div>
            <span className="text-[11px] font-semibold text-neutral-600">দ্রুত অর্ডার করুন</span>
          </div>
          <div className="w-full bg-[#FED7D7] h-2 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#9B1C1C] to-[#E53E3E] h-full rounded-full" style={{ width: '28%' }} />
          </div>
        </section>

        {/* ==================== 6. SOCIAL PROOF ==================== */}
        <section
          className="mt-3 rounded-2xl p-3 border flex items-center justify-between shadow-sm"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          <div className="flex items-center gap-2">
            <div className="flex text-[#B8975A]">★★★★★</div>
            <span className="text-xs font-bold text-neutral-800">255+ কাস্টমার সন্তুষ্ট</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>১০০% অথেনটিক কোয়ালিটি</span>
          </div>
        </section>

        {/* ==================== 7. OFFER COUNTDOWN ==================== */}
        <section
          className={`mt-3.5 bg-gradient-to-br ${theme.countdownBg} text-white rounded-3xl p-4 border shadow-md`}
          style={{ borderColor: `${theme.accentBorder}40` }}
        >
          <div className="text-center mb-3">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.accentText }}
            >
              সীমিত সময়ের ধামাকা অফার
            </span>
            <h3 className="text-base md:text-lg font-bold text-white mt-0.5">
              অফারটি {toBanglaDigits(product.countdownMinutes)} মিনিটের জন্য!
            </h3>
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="flex flex-col items-center">
              <div
                className="bg-black/50 border text-white font-display font-bold text-2xl md:text-3xl w-14 h-14 rounded-xl flex items-center justify-center shadow-inner"
                style={{ borderColor: `${theme.accentBorder}60` }}
              >
                {mins}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 font-medium">মিনিট</span>
            </div>
            <span className="text-2xl font-bold -mt-4" style={{ color: theme.accentText }}>:</span>
            <div className="flex flex-col items-center">
              <div
                className="bg-black/50 border font-display font-bold text-2xl md:text-3xl w-14 h-14 rounded-xl flex items-center justify-center shadow-inner"
                style={{
                  borderColor: `${theme.accentBorder}60`,
                  color: theme.accentText
                }}
              >
                {secs}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 font-medium">সেকেন্ড</span>
            </div>
          </div>
        </section>

        {/* ==================== 8. FEATURES SECTION ==================== */}
        <section
          className="mt-6 rounded-3xl p-5 border shadow-sm"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          <div className="text-center pb-3 border-b" style={{ borderColor: theme.cardBorder }}>
            <span
              className="text-xs font-bold tracking-wider uppercase"
              style={{ color: theme.accentText }}
            >
              কেন আমাদেরটি সেরা?
            </span>
            <h2 className="text-lg md:text-xl font-bold text-neutral-900 mt-1">
              আমাদের বোরকার বৈশিষ্ট্য
            </h2>
          </div>

          <ul className="mt-4 space-y-3.5 text-sm text-neutral-800">
            {product.features.map((feature, idx) => {
              const isNote = feature.includes('নোট:') || feature.includes('হিজাব');
              if (isNote) {
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl border"
                    style={{ backgroundColor: theme.accentBg, borderColor: theme.cardBorder }}
                  >
                    <div
                      className="w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs"
                      style={{ backgroundColor: theme.accentText }}
                    >
                      ★
                    </div>
                    <div className="text-xs leading-relaxed text-neutral-700">
                      <strong className="text-neutral-900 font-bold block mb-0.5">বিশেষ নোট:</strong>
                      {feature}
                    </div>
                  </li>
                );
              }
              return (
                <li key={idx} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border font-bold text-xs"
                    style={{
                      backgroundColor: theme.accentBg,
                      color: theme.accentText,
                      borderColor: theme.accentBorder
                    }}
                  >
                    ✓
                  </div>
                  <span className="font-medium text-neutral-900">{feature}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ==================== 9. RETURN POLICY BOX ==================== */}
        <section className="mt-4 bg-[#F8FAFC] rounded-2xl p-4 border border-[#CBD5E1] shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                নিরাপদ ও সহজ রিটার্ন পলিসি
              </h4>
              <p className="text-xs md:text-sm text-neutral-700 mt-1 leading-relaxed">
                {product.returnPolicy}
              </p>
            </div>
          </div>
        </section>

        {/* ==================== 10. CUSTOMER REVIEWS ==================== */}
        <section className="mt-7">
          <div className="text-center mb-3">
            <h3 className="text-lg md:text-xl font-bold text-neutral-900">
              ⭐ Customer Reviews ⭐
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">আমাদের সম্মানিত ক্রেতাদের মতামত</p>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 pt-1 px-1 snap-x snap-mandatory">
            {config.reviews.map((rev) => (
              <div
                key={rev.id}
                className="min-w-[260px] max-w-[280px] p-4 rounded-2xl border shadow-sm flex flex-col justify-between shrink-0 snap-start"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-[#B8975A] text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span>✓</span> ভেরিফাইড ক্রেতা
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                    "{rev.text}"
                  </p>
                </div>
                <div
                  className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px]"
                  style={{ borderColor: theme.cardBorder }}
                >
                  <div>
                    <span className="font-bold text-neutral-900 block">{rev.name}</span>
                    <span className="text-neutral-500">{rev.city}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 11. PRODUCT SELECTION & ORDER FORM ==================== */}
        <div ref={orderSectionRef}>
          <OrderForm
            config={config}
            theme={theme}
            onOrderSuccess={handleOrderComplete}
          />
        </div>

        {/* ==================== 13. FOOTER (With Creator & Company Credits) ==================== */}
        <footer className="mt-12 text-center text-xs text-neutral-500 space-y-2 pb-16">
          <div className="flex items-center justify-center gap-2 text-neutral-400">
            <span className="w-8 h-[1px] bg-neutral-300" />
            <span
              className="text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: theme.accentText }}
            >
              100% Quality Guaranteed
            </span>
            <span className="w-8 h-[1px] bg-neutral-300" />
          </div>

          {/* Store Owner Contact */}
          <p className="font-medium text-neutral-700">
            {config.brandName} · সারা বাংলাদেশে দ্রুততম হোম ডেলিভারি
          </p>
          <p className="text-[11px]">
            হেল্পলাইন:{' '}
            <a
              href={`tel:${config.contact.phone}`}
              className="underline font-semibold hover:opacity-80"
            >
              {config.contact.phone}
            </a>
          </p>

          <p className="text-[10px] text-neutral-400 pt-1">
            প্রোডাক্ট হাতে পেয়ে চেক করে মূল্য পরিশোধ করার সুবিধা রয়েছে।
          </p>

          {/* Discreet Company & Creator Credit with Secret Admin Access Trigger */}
          <div className="pt-6 mt-6 border-t border-neutral-200/60 text-[10px] text-neutral-400 flex flex-col items-center gap-1">
            <p>
              Developed by{' '}
              <a
                href="https://naxxivo.online"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-neutral-500 hover:text-black transition-colors"
              >
                Naxxivo
              </a>
              {' '}· Creator: <strong>Rony Ahammad</strong>
            </p>
            <p className="flex items-center gap-1">
              <a
                href="https://naxxivo.online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                naxxivo.online
              </a>
              <span>·</span>
              {/* Subtle admin access point for store owner */}
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Admin Area"
              >
                Admin Area
              </button>
            </p>
          </div>
        </footer>
      </main>

      {/* ==================== STICKY BOTTOM BAR (MOBILE) ==================== */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 py-2.5 px-4 transform transition-transform duration-300 shadow-lg md:max-w-xl md:left-1/2 md:-translate-x-1/2 md:rounded-t-2xl backdrop-blur-md ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderTop: `1px solid ${theme.cardBorder}`
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase text-neutral-500 block font-semibold">ধামাকা অফার</span>
            <span className="text-xl font-bold font-display" style={{ color: theme.priceColor }}>
              {toBanglaDigits(product.basePrice)} <span className="text-base font-sans font-semibold">৳</span>
            </span>
            {product.oldPrice > product.basePrice && (
              <span className="text-xs text-neutral-400 line-through ml-1 font-sans">
                {toBanglaDigits(product.oldPrice)}৳
              </span>
            )}
          </div>
          <a
            href="#orderSection"
            className={`btn-shine px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center gap-1.5 ${theme.primaryBtn} ${theme.primaryBtnHover}`}
          >
            <span>অর্ডার করুন</span>
            <span>👉</span>
          </a>
        </div>
      </div>

      {/* ==================== FLOATING ACTION BUTTONS ==================== */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2.5 items-end">
        {config.contact.messengerUrl && (
          <a
            href={config.contact.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Messenger"
            className="w-11 h-11 rounded-full bg-[#0084FF] text-white shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/20"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.517 3.735 7.185V22l3.419-1.875c.91.252 1.877.388 2.846.388 5.523 0 10-4.145 10-9.255C22 6.145 17.523 2 12 2zm1.066 12.443l-2.613-2.787-5.097 2.787 5.607-5.952 2.678 2.787 5.032-2.787-5.607 5.952z" />
            </svg>
          </a>
        )}

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="pulse-subtle w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-white"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2C6.505 2 2.012 6.49 2.012 12.015c0 1.95.56 3.774 1.528 5.318L2 22.02l4.832-1.503a9.98 9.98 0 005.199 1.488h.005c5.524 0 10.017-4.49 10.017-10.016 0-5.525-4.493-10.015-10.022-10.015zm5.836 14.154c-.244.686-1.42 1.31-1.956 1.396-.516.082-1.189.117-3.874-.993-3.23-1.334-5.308-4.62-5.468-4.835-.16-.215-1.303-1.733-1.303-3.305 0-1.572.822-2.345 1.114-2.665.292-.32.637-.4.85-.4.212 0 .424.002.61.011.196.01.458-.075.717.546.265.637.901 2.203.98 2.363.08.16.133.348.026.562-.106.214-.16.348-.318.535-.16.187-.336.417-.48.56-.16.16-.327.333-.14.654.186.32.828 1.368 1.776 2.212 1.22 1.085 2.247 1.422 2.566 1.582.319.16.505.134.69-.08.187-.214.797-.932 1.01-1.253.212-.32.424-.267.716-.16.292.107 1.858.877 2.176 1.037.319.16.531.24.61.373.08.133.08.77-.164 1.456z" />
          </svg>
        </a>
      </div>

      {/* Success Modal */}
      <SuccessModal
        order={recentOrder}
        config={config}
        onClose={() => setRecentOrder(null)}
      />
    </div>
  );
};
