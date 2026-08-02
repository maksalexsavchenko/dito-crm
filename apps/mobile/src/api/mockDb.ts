import AsyncStorage from '@react-native-async-storage/async-storage';
import { loyaltyBrands, defaultLoyaltyBrandId } from '@dito/config';
import type { AppNotification, LoyaltyTransaction, Member, Voucher } from '@/domain/types';
import { demoLedger } from '@/data/ledger';
import { notifications as seedNotifications } from '@/data/notifications';
import { redeemableVouchers } from '@/data/vouchers';

// In-memory stand-in for the backend, mirrored to AsyncStorage so a reload
// behaves like a real server rather than wiping the account. Everything here
// disappears the day apps/mobile talks to a real API — see ./client.ts.

const STORAGE_KEY = 'dito.loyalty.mockdb.v1';
const brand = loyaltyBrands[defaultLoyaltyBrandId];

export const DEMO_PHONE = '+380670000000';
/** The mock backend accepts only this code; the UI shows it as a dev hint. */
export const DEV_OTP_CODE = '1234';

interface Db {
  members: Member[];
  ledgers: Record<string, LoyaltyTransaction[]>;
  vouchers: Record<string, Voucher[]>;
  notifications: Record<string, AppNotification[]>;
  /** token → memberId */
  sessions: Record<string, string>;
}

function demoMember(): Member {
  return {
    id: 'mem-demo',
    phone: DEMO_PHONE,
    firstName: 'Максим',
    lastName: 'Савченко',
    email: 'demo@dito.com.ua',
    birthDate: '1992-04-18',
    gender: 'male',
    cardNumber: '838721340586295',
    bonusBalance: demoLedger[0].balanceAfter,
    spendTotal: demoLedger.filter((t) => t.type === 'purchase').reduce((s, t) => s + t.amount, 0),
    referralCode: 'DITO-MX7Q4A',
    createdAt: '2026-03-02T10:12:00.000Z',
    pushEnabled: true,
    emailEnabled: false,
  };
}

function seed(): Db {
  const demo = demoMember();
  return {
    members: [demo],
    ledgers: { [demo.id]: demoLedger },
    vouchers: { [demo.id]: redeemableVouchers.map((v) => ({ ...v })) },
    notifications: { [demo.id]: seedNotifications.map((n) => ({ ...n })) },
    sessions: {},
  };
}

let db: Db | null = null;
let loading: Promise<Db> | null = null;

async function load(): Promise<Db> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return seed();
  try {
    return JSON.parse(raw) as Db;
  } catch {
    // Corrupted payload from an older build — start clean rather than crash.
    return seed();
  }
}

export async function ready(): Promise<Db> {
  if (db) return db;
  loading ??= load().then((loaded) => {
    db = loaded;
    return loaded;
  });
  return loading;
}

export async function persist(): Promise<void> {
  if (db) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

/** Wipes the mock backend — used by "delete account" and by dev tooling. */
export async function reset(): Promise<void> {
  db = seed();
  loading = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
}

// ── Factories ──────────────────────────────────────────────────

function randomDigits(count: number): string {
  let out = '';
  for (let i = 0; i < count; i += 1) out += Math.floor(Math.random() * 10);
  return out;
}

export function newCardNumber(): string {
  return randomDigits(brand.cardNumber.groups * brand.cardNumber.groupSize);
}

export function newReferralCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `DITO-${code}`;
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
}
