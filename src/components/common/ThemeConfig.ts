import { ThemePreset } from '../../types';

export interface ThemeStyles {
  id: ThemePreset;
  name: string;
  badge: string;
  bgCanvas: string;
  cardBg: string;
  cardBorder: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentGlow: string;
  primaryBtn: string;
  primaryBtnHover: string;
  priceColor: string;
  countdownBg: string;
}

export const THEMES: Record<ThemePreset, ThemeStyles> = {
  'luxury-gold': {
    id: 'luxury-gold',
    name: 'Luxury Gold (হাউত গোল্ড)',
    badge: 'স্বর্ণালী আভিজাত্য',
    bgCanvas: '#FAF7F2',
    cardBg: '#FFFFFF',
    cardBorder: '#E8E1D5',
    accentText: '#B8975A',
    accentBg: '#F7F2E7',
    accentBorder: '#B8975A',
    accentGlow: '0 0 20px -3px rgba(184, 151, 90, 0.35)',
    primaryBtn: 'bg-[#0B0B0B] text-white',
    primaryBtnHover: 'hover:bg-[#222222]',
    priceColor: 'text-[#0B0B0B]',
    countdownBg: 'from-[#141414] to-[#0B0B0B]'
  },
  'royal-emerald': {
    id: 'royal-emerald',
    name: 'Royal Emerald (রয়্যাল এমারেল্ড)',
    badge: 'আড়ং স্টাইল অভিজাত',
    bgCanvas: '#F4F8F5',
    cardBg: '#FFFFFF',
    cardBorder: '#D2E3D8',
    accentText: '#0E5A3E',
    accentBg: '#E8F3ED',
    accentBorder: '#0E5A3E',
    accentGlow: '0 0 20px -3px rgba(14, 90, 62, 0.35)',
    primaryBtn: 'bg-[#062418] text-white',
    primaryBtnHover: 'hover:bg-[#0E5A3E]',
    priceColor: 'text-[#062418]',
    countdownBg: 'from-[#062418] to-[#03150E]'
  },
  'rose-velvet': {
    id: 'rose-velvet',
    name: 'Rose Velvet (রোজ ভেলভেট)',
    badge: 'রোমান্টিক ভেলভেট',
    bgCanvas: '#FAF4F6',
    cardBg: '#FFFFFF',
    cardBorder: '#EED9E2',
    accentText: '#9A2C55',
    accentBg: '#F9EBF1',
    accentBorder: '#9A2C55',
    accentGlow: '0 0 20px -3px rgba(154, 44, 85, 0.35)',
    primaryBtn: 'bg-[#290716] text-white',
    primaryBtnHover: 'hover:bg-[#4A102B]',
    priceColor: 'text-[#1F0712]',
    countdownBg: 'from-[#290716] to-[#17030C]'
  },
  'minimal-noir': {
    id: 'minimal-noir',
    name: 'Minimal Noir (মিনিমাল নোয়ার)',
    badge: 'মর্ডান জারা স্টাইল',
    bgCanvas: '#F8F8F8',
    cardBg: '#FFFFFF',
    cardBorder: '#E0E0E0',
    accentText: '#171717',
    accentBg: '#F0F0F0',
    accentBorder: '#171717',
    accentGlow: '0 0 20px -3px rgba(0, 0, 0, 0.25)',
    primaryBtn: 'bg-[#000000] text-white',
    primaryBtnHover: 'hover:bg-[#2B2B2B]',
    priceColor: 'text-[#000000]',
    countdownBg: 'from-[#171717] to-[#000000]'
  }
};
