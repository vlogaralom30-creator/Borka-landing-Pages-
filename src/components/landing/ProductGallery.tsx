import React, { useState, useRef } from 'react';
import { GalleryImage } from '../../types';
import { ThemeStyles } from '../common/ThemeConfig';

interface ProductGalleryProps {
  images: GalleryImage[];
  discountText: string;
  theme: ThemeStyles;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  discountText,
  theme
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const currentImage = images[currentIndex] || images[0] || {
    url: 'https://i.ibb.co.com/Kp9mX3Tc/file-00000000d9e88211bf110a51ec7121c9.png',
    alt: 'Product image'
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    touchStartX.current = null;
  };

  return (
    <>
      <section
        className="relative rounded-3xl p-3 shadow-sm border overflow-hidden"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
      >
        {/* Discount Badge on Top-Left */}
        <div className="absolute top-5 left-5 z-20 bg-gradient-to-r from-[#9B1C1C] to-[#B91C1C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
          <span>🔥</span>
          <span>{discountText}</span>
        </div>

        {/* Main Image Container */}
        <div
          className="relative w-full aspect-[3/4] bg-[#F7F5F0] rounded-2xl overflow-hidden cursor-zoom-in group select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover object-center transition-all duration-300 ease-out"
            loading="eager"
            referrerPolicy="no-referrer"
          />

          {/* Overlaid Navigation Arrows */}
          <button
            type="button"
            aria-label="Previous Image"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 shadow-md flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all border border-black/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next Image"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 shadow-md flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all border border-black/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 opacity-85 pointer-events-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            <span>জুম করুন</span>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 4 Thumbnails Below */}
        <div className="grid grid-cols-4 gap-2.5 mt-3">
          {images.slice(0, 4).map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className="aspect-square rounded-xl overflow-hidden border-2 bg-neutral-100 transition-all duration-200"
                style={{
                  borderColor: isActive ? theme.accentBorder : 'transparent',
                  boxShadow: isActive ? `0 0 0 2px ${theme.accentBorder}40` : 'none',
                  opacity: isActive ? 1 : 0.75
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 text-2xl w-10 h-10 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
