import React, { useState } from 'react';
import { CustomerReview } from '../../types';

interface ReviewsManagerProps {
  reviews: CustomerReview[];
  onSave: (reviews: CustomerReview[]) => void;
}

export const ReviewsManager: React.FC<ReviewsManagerProps> = ({ reviews, onSave }) => {
  const [list, setList] = useState<CustomerReview[]>(reviews);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [date, setDate] = useState('আজকের রিভিউ');

  const [savedToast, setSavedToast] = useState(false);

  const handleAdd = () => {
    if (!name.trim() || !text.trim()) {
      alert('নাম এবং রিভিউ টেক্সট লিখুন');
      return;
    }
    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      city: city.trim() || 'বাংলাদেশ',
      rating,
      text: text.trim(),
      date: date.trim() || 'সম্প্রতি'
    };

    const nextList = [newRev, ...list];
    setList(nextList);
    onSave(nextList);

    setName('');
    setCity('');
    setText('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleRemove = (id: string) => {
    if (list.length <= 1) {
      alert('কমপক্ষে একটি রিভিউ রাখা ভালো');
      return;
    }
    const nextList = list.filter((r) => r.id !== id);
    setList(nextList);
    onSave(nextList);
  };

  return (
    <div className="space-y-6">
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold">
          <span>✓</span> রিভিউ তালিকা আপডেট হয়েছে!
        </div>
      )}

      {/* Add New Review */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          নতুন কাস্টমার রিভিউ যুক্ত করুন
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-neutral-600 font-semibold mb-1">কাস্টমার নাম *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: নুসরাত জাহান"
              className="w-full p-2.5 border border-neutral-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-neutral-600 font-semibold mb-1">শহর / এলাকা</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="যেমন: গুলশান, ঢাকা"
              className="w-full p-2.5 border border-neutral-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-neutral-600 font-semibold mb-1">তারিখ / সময়</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="যেমন: ২ দিন আগে"
              className="w-full p-2.5 border border-neutral-300 rounded-xl"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-neutral-600 font-semibold mb-1">রিভিউ মতামত *</label>
            <textarea
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="কাপড়ের কোয়ালিটি অনেক সুন্দর..."
              className="w-full p-2.5 border border-neutral-300 rounded-xl resize-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          + রিভিউ যোগ করুন
        </button>
      </div>

      {/* Reviews List */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-200">
          বর্তমান রিভিউসমূহ ({list.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col justify-between text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-neutral-900">{rev.name}</span>
                  <span className="text-[#B8975A]">{'★'.repeat(rev.rating)}</span>
                </div>
                <p className="text-neutral-700 leading-relaxed italic">"{rev.text}"</p>
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-neutral-200 text-neutral-400 text-[11px]">
                <span>{rev.city} · {rev.date}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(rev.id)}
                  className="text-rose-600 hover:text-rose-800 font-bold"
                >
                  মুছুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
