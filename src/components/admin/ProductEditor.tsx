import React, { useState } from 'react';
import { StoreConfig, ProductVariant, GalleryImage } from '../../types';

interface ProductEditorProps {
  config: StoreConfig;
  onSave: (updatedProduct: StoreConfig['product']) => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ config, onSave }) => {
  const [product, setProduct] = useState<StoreConfig['product']>(config.product);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const [savedToast, setSavedToast] = useState(false);

  const handleSaveAll = () => {
    onSave(product);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  // Features handlers
  const addFeature = () => {
    if (!newFeatureText.trim()) return;
    setProduct((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureText.trim()]
    }));
    setNewFeatureText('');
  };

  const removeFeature = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Sizes handlers
  const addSize = () => {
    if (!newSize.trim() || product.sizes.includes(newSize.trim())) return;
    setProduct((prev) => ({
      ...prev,
      sizes: [...prev.sizes, newSize.trim()]
    }));
    setNewSize('');
  };

  const removeSize = (sizeToRemove: string) => {
    if (product.sizes.length <= 1) {
      alert('কমপক্ষে একটি সাইজ থাকা আবশ্যক');
      return;
    }
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove)
    }));
  };

  // Gallery handlers
  const addGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    const newImg: GalleryImage = {
      url: newGalleryUrl.trim(),
      alt: `${product.title} Image`
    };
    setProduct((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, newImg]
    }));
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    if (product.galleryImages.length <= 1) {
      alert('কমপক্ষে একটি ছবি থাকা আবশ্যক');
      return;
    }
    setProduct((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  // Variants handlers
  const updateVariant = (index: number, key: keyof ProductVariant, value: any) => {
    setProduct((prev) => {
      const nextVariants = [...prev.variants];
      nextVariants[index] = { ...nextVariants[index], [key]: value };
      return { ...prev, variants: nextVariants };
    });
  };

  const addVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      name: 'নতুন কালার ভ্যারিয়েন্ট',
      code: 'কোড-1005',
      image: product.galleryImages[0]?.url || 'https://i.ibb.co.com/Kp9mX3Tc/file-00000000d9e88211bf110a51ec7121c9.png',
      price: product.basePrice,
      oldPrice: product.oldPrice
    };
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, newVar]
    }));
  };

  const removeVariant = (id: string) => {
    if (product.variants.length <= 1) {
      alert('কমপক্ষে একটি কালার ভ্যারিয়েন্ট থাকা আবশ্যক');
      return;
    }
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top action save */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm sticky top-16 z-20">
        <div>
          <h3 className="text-base font-bold text-neutral-900">প্রোডাক্ট ও অফার তথ্য পরিবর্তন</h3>
          <p className="text-xs text-neutral-500">পরিবর্তন করার পর অবশ্যই সেভ বাটনে চাপুন</p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <span>💾 পরিবর্তন সেভ করুন</span>
        </button>
      </div>

      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold">
          <span>✓</span> প্রোডাক্টের তথ্য সফলভাবে সেভ হয়েছে!
        </div>
      )}

      {/* 1. Basic Info & Pricing */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ১. বেসিক প্রোডাক্ট ও মূল্য
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              প্রোডাক্ট নাম / শিরোনাম
            </label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              ডিসকাউন্ট ব্যাজ টেক্সট (যেমন: ৩৫% ছাড়)
            </label>
            <input
              type="text"
              value={product.discountText}
              onChange={(e) => setProduct({ ...product, discountText: e.target.value })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              অফার বিক্রয় মূল্য (টাকা)
            </label>
            <input
              type="number"
              value={product.basePrice}
              onChange={(e) => setProduct({ ...product, basePrice: Number(e.target.value) })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              পূর্বের মূল্য / রেগুলার প্রাইস (টাকা)
            </label>
            <input
              type="number"
              value={product.oldPrice}
              onChange={(e) => setProduct({ ...product, oldPrice: Number(e.target.value) })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              স্টক কাউন্ট (কত পিস বাকি)
            </label>
            <input
              type="number"
              value={product.stockRemaining}
              onChange={(e) => setProduct({ ...product, stockRemaining: Number(e.target.value) })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-bold text-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              কাউন্টডাউন টাইমার (মিনিট)
            </label>
            <input
              type="number"
              value={product.countdownMinutes}
              onChange={(e) => setProduct({ ...product, countdownMinutes: Number(e.target.value) })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Hijab Addon Config */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ২. হিজাব অ্যাড-অন কনফিগারেশন
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">হিজাব অপশন শিরোনাম</label>
            <input
              type="text"
              value={product.hijabTitle}
              onChange={(e) => setProduct({ ...product, hijabTitle: e.target.value })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">হিজাব বর্ণনা / সাইজ</label>
            <input
              type="text"
              value={product.hijabSubtitle}
              onChange={(e) => setProduct({ ...product, hijabSubtitle: e.target.value })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">হিজাবের অতিরিক্ত মূল্য (টাকা)</label>
            <input
              type="number"
              value={product.hijabPrice}
              onChange={(e) => setProduct({ ...product, hijabPrice: Number(e.target.value) })}
              className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* 3. Color Variants */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            ৩. কালার ভ্যারিয়েন্টসমূহ ({product.variants.length})
          </h4>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold px-3 py-1.5 rounded-lg border border-neutral-300"
          >
            + নতুন কালার যোগ করুন
          </button>
        </div>

        <div className="space-y-3">
          {product.variants.map((variant, index) => (
            <div
              key={variant.id}
              className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col md:flex-row items-center gap-3"
            >
              <img
                src={variant.image || 'https://i.ibb.co.com/Kp9mX3Tc/file-00000000d9e88211bf110a51ec7121c9.png'}
                alt=""
                className="w-12 h-12 rounded-lg object-cover bg-white border border-neutral-200 shrink-0"
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1 w-full text-xs">
                <div>
                  <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">কালার নাম</label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">প্রোডাক্ট কোড</label>
                  <input
                    type="text"
                    value={variant.code}
                    onChange={(e) => updateVariant(index, 'code', e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">মূল্য (টাকা)</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                    className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">ছবি URL</label>
                  <input
                    type="text"
                    value={variant.image}
                    onChange={(e) => updateVariant(index, 'image', e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeVariant(variant.id)}
                className="text-xs text-rose-600 hover:text-rose-800 p-2 rounded-lg bg-white border border-rose-200"
                title="মুছে ফেলুন"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sizes */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ৪. বোরকার সাইজ অপশন (ইঞ্চি)
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          {product.sizes.map((size) => (
            <div
              key={size}
              className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-800"
            >
              <span>সাইজ {size}</span>
              <button
                type="button"
                onClick={() => removeSize(size)}
                className="text-neutral-400 hover:text-red-500 text-sm ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 max-w-xs">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="নতুন সাইজ (যেমন ৫৮)"
            className="text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-neutral-900 flex-1 focus:outline-none"
          />
          <button
            type="button"
            onClick={addSize}
            className="text-xs bg-neutral-900 text-white font-bold px-3 py-2.5 rounded-xl hover:bg-neutral-800 whitespace-nowrap"
          >
            + যোগ করুন
          </button>
        </div>
      </div>

      {/* 5. Features Section Bullet Points */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ৫. বোরকার বৈশিষ্ট্য (Features List)
        </h4>

        <ul className="space-y-2">
          {product.features.map((feat, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs md:text-sm text-neutral-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 font-bold">{idx + 1}.</span>
                <span>{feat}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1"
              >
                মুছুন
              </button>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <input
            type="text"
            value={newFeatureText}
            onChange={(e) => setNewFeatureText(e.target.value)}
            placeholder="নতুন বৈশিষ্ট্য লিখুন..."
            className="flex-1 text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={addFeature}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-4 py-3 rounded-xl whitespace-nowrap"
          >
            + যোগ করুন
          </button>
        </div>
      </div>

      {/* 6. Return Policy */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ৬. রিটার্ন পলিসি টেক্সট
        </h4>
        <textarea
          rows={2}
          value={product.returnPolicy}
          onChange={(e) => setProduct({ ...product, returnPolicy: e.target.value })}
          className="w-full text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none resize-none"
        />
      </div>

      {/* 7. Gallery Images Manager */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          ৭. গ্যালারি ছবি ({product.galleryImages.length})
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {product.galleryImages.map((img, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-neutral-200 group aspect-[3/4] bg-neutral-100">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(idx)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-md hover:bg-rose-700"
                title="মুছুন"
              >
                ✕
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 truncate text-center">
                ছবি #{idx + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newGalleryUrl}
            onChange={(e) => setNewGalleryUrl(e.target.value)}
            placeholder="নতুন ইমেজের ডিরেক্ট URL পেস্ট করুন..."
            className="flex-1 text-xs md:text-sm p-3 border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={addGalleryImage}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-4 py-3 rounded-xl whitespace-nowrap"
          >
            + ছবি যোগ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
