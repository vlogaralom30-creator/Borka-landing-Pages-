/**
 * Bangla digit and currency helpers
 */

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const BN_MAP: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

export function toBanglaDigits(num: number | string): string {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, (d) => BN_DIGITS[parseInt(d, 10)]);
}

export function toEnglishDigits(str: string): string {
  if (!str) return '';
  return String(str).replace(/[০-৯]/g, (d) => BN_MAP[d] || d);
}

export function formatTaka(num: number | string): string {
  return `${toBanglaDigits(num)} ৳`;
}

export function validateBDPhoneNumber(rawPhone: string): { isValid: boolean; formatted: string } {
  const clean = toEnglishDigits(rawPhone).replace(/\D/g, '').slice(0, 11);
  const isValid = /^01[3-9]\d{8}$/.test(clean);
  return { isValid, formatted: clean };
}
