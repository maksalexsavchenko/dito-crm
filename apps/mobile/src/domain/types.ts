// Domain model of the loyalty program. These shapes are the contract the
// backend will have to satisfy; screens never touch anything else.

export type Gender = 'female' | 'male' | 'unspecified';

export interface Member {
  id: string;
  /** E.164, e.g. +380671234567. */
  phone: string;
  firstName: string;
  lastName: string;
  email: string | null;
  /** ISO date, YYYY-MM-DD. */
  birthDate: string | null;
  gender: Gender;
  /** Digits only; formatted for display via formatCardNumber(). */
  cardNumber: string;
  /** Current bonus balance. */
  bonusBalance: number;
  /** Cumulative qualifying spend — drives the tier. */
  spendTotal: number;
  /** Personal referral code shown on the invite screen. */
  referralCode: string;
  createdAt: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export type TransactionType = 'purchase' | 'bonus' | 'redeem' | 'expire';

export interface TransactionItem {
  name: string;
  qty: number;
  price: number;
}

export interface LoyaltyTransaction {
  id: string;
  type: TransactionType;
  createdAt: string;
  locationId: string | null;
  /** Bill total for a purchase; 0 for pure bonus operations. */
  amount: number;
  /** Signed bonus movement: positive accrual, negative spend. */
  bonusDelta: number;
  /** Balance right after this transaction — the backend is the source of truth. */
  balanceAfter: number;
  items: TransactionItem[];
  note: string | null;
}

export interface WorkingHours {
  /** Free-form, e.g. "Щодня: 08:00-20:00". */
  label: string;
  /** True while the venue is currently serving. */
  openNow: boolean;
}

export interface Location {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  hours: WorkingHours;
  phone: string | null;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  publishedAt: string;
}

export type VoucherStatus = 'active' | 'used' | 'expired';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  /** Bonus credited when the voucher is redeemed. */
  bonusValue: number;
  status: VoucherStatus;
  expiresAt: string | null;
  redeemedAt: string | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface LegalDoc {
  slug: 'terms' | 'privacy';
  title: string;
  updatedAt: string;
  /** Plain-text paragraphs; rendered as-is. */
  paragraphs: { heading: string | null; text: string }[];
}

export interface Review {
  rating: number;
  comment: string;
  locationId: string | null;
}

/** Session returned by the auth API and persisted on the device. */
export interface Session {
  token: string;
  memberId: string;
}
