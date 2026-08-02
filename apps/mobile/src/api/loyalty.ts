import type { LoyaltyTransaction, Member, Review, Voucher } from '@/domain/types';
import { redeemableVouchers } from '@/data/vouchers';
import { delay, fail } from './client';
import { newId, persist, ready } from './mockDb';

/** Resolves the member behind a token, or rejects with an ApiError. */
async function requireMember(token: string): Promise<Member> {
  const db = await ready();
  const memberId = db.sessions[token];
  const member = memberId ? db.members.find((m) => m.id === memberId) : undefined;
  if (!member) return fail('Сесія завершилась. Увійдіть знову.', 'unauthorized', 0);
  return member;
}

/** Bonus movements, newest first. */
export async function getTransactions(token: string): Promise<LoyaltyTransaction[]> {
  const db = await ready();
  const member = await requireMember(token);
  return delay(db.ledgers[member.id] ?? []);
}

export async function getVouchers(token: string): Promise<Voucher[]> {
  const db = await ready();
  const member = await requireMember(token);
  return delay(db.vouchers[member.id] ?? []);
}

export interface RedeemResult {
  voucher: Voucher;
  member: Member;
  transaction: LoyaltyTransaction;
}

/** Credits a voucher's bonuses and records the accrual in the ledger. */
export async function redeemVoucher(token: string, code: string): Promise<RedeemResult> {
  const db = await ready();
  const member = await requireMember(token);
  const normalized = code.trim().toUpperCase();

  const known = redeemableVouchers.find((v) => v.code.toUpperCase() === normalized);
  if (!known) return fail('Такого ваучера не існує. Перевірте код.', 'voucher_unknown');
  if (known.status === 'expired') return fail('Термін дії ваучера минув.', 'voucher_expired');

  const owned = db.vouchers[member.id] ?? [];
  if (owned.some((v) => v.code.toUpperCase() === normalized && v.status === 'used')) {
    return fail('Цей ваучер уже погашено.', 'voucher_used');
  }

  const now = new Date().toISOString();
  const voucher: Voucher = { ...known, id: newId('v'), status: 'used', redeemedAt: now };
  const transaction: LoyaltyTransaction = {
    id: newId('tx'),
    type: 'bonus',
    createdAt: now,
    locationId: null,
    amount: 0,
    bonusDelta: voucher.bonusValue,
    balanceAfter: member.bonusBalance + voucher.bonusValue,
    items: [],
    note: `Ваучер «${voucher.title}»`,
  };

  member.bonusBalance = transaction.balanceAfter;
  db.vouchers[member.id] = [voucher, ...owned.filter((v) => v.code !== voucher.code)];
  db.ledgers[member.id] = [transaction, ...(db.ledgers[member.id] ?? [])];
  await persist();

  return delay({ voucher, member: { ...member }, transaction });
}

export interface ProfilePatch {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  birthDate?: string | null;
  gender?: Member['gender'];
  pushEnabled?: boolean;
  emailEnabled?: boolean;
}

export async function updateProfile(token: string, patch: ProfilePatch): Promise<Member> {
  const member = await requireMember(token);

  if (patch.firstName !== undefined && patch.firstName.trim().length < 2) {
    return fail("Ім'я має містити щонайменше 2 символи.", 'first_name_invalid');
  }
  if (patch.email !== undefined && patch.email !== null && patch.email !== '') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(patch.email)) {
      return fail('Перевірте адресу електронної пошти.', 'email_invalid');
    }
  }

  Object.assign(member, patch);
  await persist();
  return delay({ ...member });
}

export async function submitReview(token: string, review: Review): Promise<void> {
  await requireMember(token);
  if (review.rating < 1) return fail('Поставте оцінку від 1 до 5 зірок.', 'rating_required');
  await delay(null, 500);
}
