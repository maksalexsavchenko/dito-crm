import type { LoyaltyBrand } from '@dito/config';
import i18n from '@/i18n';

/** Dates follow the interface language, not the device region. */
function activeLocale(): string {
  return i18n.language === 'en' ? 'en-GB' : 'uk-UA';
}

/** 1234.5 → "1 234,50 ₴" (thin spaces, as used across the CRM). */
export function formatMoney(value: number, currency = '₴'): string {
  const fixed = Math.abs(value) % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return frac ? `${grouped},${frac} ${currency}` : `${grouped} ${currency}`;
}

/** Signed bonus movement: "+120" / "−40". */
export function formatBonusDelta(value: number): string {
  return value >= 0 ? `+${value}` : `−${Math.abs(value)}`;
}

/** "838721340586295" → "838 721 340 586 295", per the brand's card layout. */
export function formatCardNumber(digits: string, brand: LoyaltyBrand): string {
  const size = brand.cardNumber.groupSize;
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += size) {
    groups.push(digits.slice(i, i + size));
  }
  return groups.join(' ');
}

/** "+380671234567" → "+380 67 123 45 67". */
export function formatPhone(e164: string): string {
  const d = e164.replace(/\D/g, '');
  if (d.length !== 12) return e164;
  return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
}

/** Digits typed by the user → E.164, assuming a Ukrainian number. */
export function toE164(input: string): string | null {
  const d = input.replace(/\D/g, '');
  if (d.length === 9) return `+380${d}`;
  if (d.length === 10 && d.startsWith('0')) return `+38${d}`;
  if (d.length === 12 && d.startsWith('380')) return `+${d}`;
  return null;
}

/** ISO timestamp → "12 березня 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(activeLocale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** ISO timestamp → "12 березня, 14:30". */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const day = date.toLocaleDateString(activeLocale(), { day: 'numeric', month: 'long' });
  const time = date.toLocaleTimeString(activeLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${day}, ${time}`;
}

/** Month header for grouped transaction lists → "Березень 2026". */
export function formatMonth(iso: string): string {
  const label = new Date(iso).toLocaleDateString(activeLocale(), {
    month: 'long',
    year: 'numeric',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** "YYYY-MM-DD" → "12.03.1990" for the profile form. */
export function formatBirthDate(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/** "12.03.1990" → "1990-03-12", or null when the date is not valid. */
export function parseBirthDate(input: string): string | null {
  const m = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const date = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getUTCDate() !== Number(dd) || date.getUTCMonth() + 1 !== Number(mm)) return null;
  return `${yyyy}-${mm}-${dd}`;
}
