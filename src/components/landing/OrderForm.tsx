import React, { useState } from 'react';
import { StoreConfig, ProductVariant, Order } from '../../types';
import { ThemeStyles } from '../common/ThemeConfig';
import { toBanglaDigits, toEnglishDigits, formatTaka, validateBDPhoneNumber } from '../../utils/bangla';

interface OrderFormProps {
  config: StoreConfig;
  theme: ThemeStyles;
  onOrderSuccess: (order: Order) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  config,
  theme,
  onOrderSuccess
}) => {
  const { product, delivery } = config;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      name: 'ডিফল্ট ভ্যারিয়েন্ট',
      code: '1005',
      image: '',
      price: product.basePrice,
      oldPrice: product.oldPrice
    }
  );

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0] || '৫০'
  );

  const [includeHijab, setIncludeHijab] = useState<boolean>(false);
  const [deliveryArea, setDeliveryArea] = useState<'outside' | 'inside'>('outside');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const [phoneError, setPhoneError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live calculations
  const basePrice = selectedVariant.price || product.basePrice;
  const hijabCost = includeHijab ? product.hijabPrice : 0;
  const deliveryCost = deliveryArea === 'inside' ? delivery.insideDhaka : delivery.outsideDhaka;
  const totalAmount = basePrice + hijabCost + deliveryCost;

  // Phone input handling with auto-conversion
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const englishDigits = toEnglishDigits(raw).replace(/\D/g, '').slice(0, 11);
    setCustomerPhone(englishDigits);

    if (englishDigits.length === 11) {
      const { isValid } = validateBDPhoneNumber(englishDigits);
      if (isValid) {
        setPhoneError('');
      } else {
        setPhoneError('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      }
    } else if (englishDigits.length > 0) {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = customerName.trim();
    const trimmedAddress = customerAddress.trim();
    const { isValid: isPhoneValid, formatted: formattedPhone } = validateBDPhoneNumber(customerPhone);

    if (!trimmedName) {
      setErrorMessage('দয়া করে আপনার সম্পূর্ণ নাম লিখুন।');
      return;
    }

    if (!isPhoneValid) {
      setErrorMessage('দয়া করে একটি সঠিক ১১ সংখ্যার মোবাইল নম্বর লিখুন।');
      setPhoneError('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন');
      return;
    }

    if (!trimmedAddress || trimmedAddress.length < 5) {
      setErrorMessage('দয়া করে আপনার বিস্তারিত ডেলিভারি ঠিকানা লিখুন (জেলা, থানা, বাসা নং)।');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      created_at: new Date().toISOString(),
      customer_name: trimmedName,
      customer_phone: formattedPhone,
      customer_address: trimmedAddress,
      customer_note: customerNote.trim() || undefined,
      variant_id: selectedVariant.id,
      variant_name: selectedVariant.name,
      variant_code: selectedVariant.code,
      size: selectedSize,
      include_hijab: includeHijab,
      hijab_price: hijabCost,
      product_price: basePrice,
      delivery_area: deliveryArea,
      delivery_charge: deliveryCost,
      total_amount: totalAmount,
      payment_method: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)',
      status: 'pending'
    };

    // Simulate network latency for smooth UX
    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <section
      id="orderSection"
      className="mt-8 rounded-3xl p-5 md:p-6 border-2 shadow-sm scroll-mt-16 transition-colors"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: `${theme.accentBorder}60`
      }}
    >
      <div className="text-center pb-4 border-b" style={{ borderColor: theme.cardBorder }}>
        <span
          className="inline-block text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1"
          style={{ backgroundColor: theme.primaryBtn.includes('bg-') ? undefined : '#0B0B0B' }}
        >
          অর্ডার বুকিং ফরম
        </span>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: theme.priceColor }}>
          পছন্দের পণ্যটি সিলেক্ট করুন
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          সঠিক কালার ও সাইজ বাছাই করে ফরমটি পূরণ করুন
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* 1. COLOR / VARIANT SELECTION */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
            ১. পছন্দের কালার ভ্যারিয়েন্ট বেছে নিন <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant.id === variant.id;
              return (
                <div
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className="relative p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3"
                  style={{
                    borderColor: isSelected ? theme.accentBorder : theme.cardBorder,
                    backgroundColor: isSelected ? theme.accentBg : '#FFFFFF',
                    boxShadow: isSelected ? theme.accentGlow : 'none'
                  }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <img
                      src={variant.image || 'https://i.ibb.co.com/Kp9mX3Tc/file-00000000d9e88211bf110a51ec7121c9.png'}
                      alt={variant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-bold text-neutral-900 truncate">
                        {variant.name}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {variant.code}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold" style={{ color: theme.priceColor }}>
                        {formatTaka(variant.price)}
                      </span>
                      {variant.oldPrice > variant.price && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatTaka(variant.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{
                      borderColor: isSelected ? theme.accentBorder : '#D4D4D4',
                      backgroundColor: isSelected ? theme.accentBorder : 'transparent'
                    }}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. SIZE SELECTOR CHIPS */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
            ২. আপনার বোরকার সাইজ নির্বাচন করুন <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className="py-2.5 px-2 rounded-xl border-2 text-xs md:text-sm font-bold transition-all text-center"
                  style={{
                    borderColor: isSelected ? theme.accentBorder : theme.cardBorder,
                    backgroundColor: isSelected ? theme.accentBorder : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#171717'
                  }}
                >
                  সাইজ {size}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[11px] text-neutral-500 mt-2 px-1">
            <span>দৈর্ঘ্য সাইজ: {product.sizes.join(', ')} ইঞ্চি</span>
            <span style={{ color: theme.accentText }} className="font-semibold">
              বডি সাইজ ফ্রি (৩২-৪৪)
            </span>
          </div>
        </div>

        {/* 3. HIJAB ADDON TOGGLE */}
        <div
          className="p-3.5 rounded-2xl border transition-colors cursor-pointer"
          style={{
            backgroundColor: theme.accentBg,
            borderColor: includeHijab ? theme.accentBorder : theme.cardBorder
          }}
          onClick={() => setIncludeHijab(!includeHijab)}
        >
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={includeHijab}
                onChange={(e) => setIncludeHijab(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer"
                style={{ accentColor: theme.accentBorder }}
              />
              <div>
                <span className="text-xs md:text-sm font-bold text-neutral-900 block">
                  {product.hijabTitle}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {product.hijabSubtitle}
                </span>
              </div>
            </div>
            <span className="text-xs md:text-sm font-bold whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
              +{toBanglaDigits(product.hijabPrice)} ৳
            </span>
          </label>
        </div>

        {/* 4. CUSTOMER DETAILS */}
        <div className="pt-3 border-t" style={{ borderColor: theme.cardBorder }}>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
            ৩. ডেলিভারি তথ্য প্রদান করুন
          </label>

          <div className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                আপনার নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-400"
                style={{ borderColor: theme.cardBorder }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                মোবাইল নম্বর <span className="text-red-500">*</span>
                <span className="text-[11px] text-neutral-400 font-normal ml-1">
                  (১১ সংখ্যার নম্বর, যেমন 017xxxxxxxx)
                </span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  placeholder="আপনার ১১ সংখ্যার ফোন নম্বর লিখুন"
                  maxLength={11}
                  required
                  className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-400 font-sans"
                  style={{ borderColor: phoneError ? '#EF4444' : theme.cardBorder }}
                />
                {customerPhone.length === 11 && !phoneError && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">
                    ✓
                  </span>
                )}
              </div>
              {phoneError && (
                <p className="text-[11px] text-red-600 mt-1">{phoneError}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                <span className="text-[11px] text-neutral-400 font-normal ml-1">
                  (জেলা, থানা, রোড/গ্রাম ও বাসার নম্বর)
                </span>
              </label>
              <textarea
                rows={3}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                required
                className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-400 resize-none"
                style={{ borderColor: theme.cardBorder }}
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                অতিরিক্ত নোট <span className="text-neutral-400 text-[11px] font-normal">(ঐচ্ছিক)</span>
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="কিছু জানাতে চাইলে এখানে লিখুন"
                className="w-full px-4 py-2.5 text-sm bg-[#FAF7F2] border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-400"
                style={{ borderColor: theme.cardBorder }}
              />
            </div>
          </div>
        </div>

        {/* 5. DELIVERY AREA */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
            ৪. ডেলিভারি এরিয়া নির্বাচন করুন <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label
              onClick={() => setDeliveryArea('outside')}
              className="relative flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all"
              style={{
                borderColor: deliveryArea === 'outside' ? theme.accentBorder : theme.cardBorder,
                backgroundColor: deliveryArea === 'outside' ? theme.accentBg : '#FFFFFF'
              }}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="deliveryArea"
                  checked={deliveryArea === 'outside'}
                  onChange={() => setDeliveryArea('outside')}
                  className="w-4 h-4"
                  style={{ accentColor: theme.accentBorder }}
                />
                <span className="text-xs md:text-sm font-semibold text-neutral-900">
                  ঢাকা সিটির বাইরে
                </span>
              </div>
              <span className="text-xs md:text-sm font-bold text-neutral-700">
                {formatTaka(delivery.outsideDhaka)}
              </span>
            </label>

            <label
              onClick={() => setDeliveryArea('inside')}
              className="relative flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all"
              style={{
                borderColor: deliveryArea === 'inside' ? theme.accentBorder : theme.cardBorder,
                backgroundColor: deliveryArea === 'inside' ? theme.accentBg : '#FFFFFF'
              }}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="deliveryArea"
                  checked={deliveryArea === 'inside'}
                  onChange={() => setDeliveryArea('inside')}
                  className="w-4 h-4"
                  style={{ accentColor: theme.accentBorder }}
                />
                <span className="text-xs md:text-sm font-semibold text-neutral-900">
                  ঢাকা সিটির ভিতরে
                </span>
              </div>
              <span className="text-xs md:text-sm font-bold text-neutral-700">
                {formatTaka(delivery.insideDhaka)}
              </span>
            </label>
          </div>
        </div>

        {/* 6. LIVE ORDER SUMMARY */}
        <div
          className="rounded-2xl p-4 border"
          style={{ backgroundColor: theme.accentBg, borderColor: theme.cardBorder }}
        >
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span>🛒</span>
            <span>অর্ডার সামারি</span>
          </h4>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex justify-between text-neutral-700">
              <span>নির্বাচিত পোশাক:</span>
              <span className="font-semibold text-right max-w-[200px] truncate text-neutral-900">
                {selectedVariant.name} (সাইজ: {selectedSize})
              </span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>পোশাকের মূল্য:</span>
              <span className="font-semibold text-neutral-900">
                {formatTaka(basePrice)}
              </span>
            </div>
            <div className={`flex justify-between ${includeHijab ? 'text-neutral-700' : 'text-neutral-400'}`}>
              <span>নুড হিজাব:</span>
              <span className="font-semibold">
                +{toBanglaDigits(hijabCost)} ৳
              </span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-semibold text-neutral-900">
                {formatTaka(deliveryCost)}
              </span>
            </div>
            <div className="pt-2.5 border-t flex justify-between items-baseline font-bold text-sm md:text-base" style={{ borderColor: `${theme.cardBorder}80` }}>
              <span className="text-neutral-900">সর্বমোট প্রদেয় মূল্য:</span>
              <span className="text-emerald-700 text-lg md:text-xl font-display font-extrabold">
                {formatTaka(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-shine w-full py-4 px-6 rounded-2xl font-bold text-base md:text-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${theme.primaryBtn} ${theme.primaryBtnHover}`}
        >
          {isSubmitting ? (
            <>
              <span>অর্ডার প্রসেসিং হচ্ছে...</span>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </>
          ) : (
            <span>অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)</span>
          )}
        </button>
      </form>
    </section>
  );
};
