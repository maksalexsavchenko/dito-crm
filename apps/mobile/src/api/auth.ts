import { loyaltyBrands, defaultLoyaltyBrandId } from '@dito/config';
import type { Gender, Member, Session } from '@/domain/types';
import { delay, fail } from './client';
import {
  DEV_OTP_CODE,
  newCardNumber,
  newId,
  newReferralCode,
  persist,
  ready,
  reset,
} from './mockDb';

const brand = loyaltyBrands[defaultLoyaltyBrandId];

export interface OtpChallenge {
  challengeId: string;
  phone: string;
  /** Seconds until the code stops working. */
  expiresIn: number;
  /** Only a mock backend returns the code — drop this field with the real API. */
  devCode: string;
}

export interface VerifyResult {
  session: Session;
  /** null when the phone has no account yet: continue to registration. */
  member: Member | null;
}

/** Registration always yields a member — unlike verifyOtp. */
export interface RegisterResult {
  session: Session;
  member: Member;
}

export interface RegisterPayload {
  challengeId: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string | null;
  birthDate: string | null;
  gender: Gender;
}

const challenges = new Map<string, string>();

/** Sends a one-time code to the phone. */
export async function requestOtp(phone: string): Promise<OtpChallenge> {
  const challengeId = newId('otp');
  challenges.set(challengeId, phone);
  return delay({ challengeId, phone, expiresIn: 60, devCode: DEV_OTP_CODE });
}

export async function verifyOtp(challengeId: string, code: string): Promise<VerifyResult> {
  const phone = challenges.get(challengeId);
  if (!phone) return fail('Термін дії коду минув. Запросіть новий.', 'otp_expired');
  if (code !== DEV_OTP_CODE) return fail('Невірний код. Спробуйте ще раз.', 'otp_invalid');

  const db = await ready();
  const member = db.members.find((m) => m.phone === phone) ?? null;
  const token = newId('tok');
  if (member) {
    db.sessions[token] = member.id;
    await persist();
  }
  return delay({ session: { token, memberId: member?.id ?? '' }, member });
}

/** Creates the account after a verified code and credits the welcome bonus. */
export async function register(payload: RegisterPayload): Promise<RegisterResult> {
  if (!challenges.has(payload.challengeId)) {
    return fail('Сесія реєстрації завершилась. Почніть спочатку.', 'challenge_expired');
  }

  const db = await ready();
  if (db.members.some((m) => m.phone === payload.phone)) {
    return fail('Акаунт із цим номером уже існує.', 'phone_taken');
  }

  const now = new Date().toISOString();
  const member: Member = {
    id: newId('mem'),
    phone: payload.phone,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    birthDate: payload.birthDate,
    gender: payload.gender,
    cardNumber: newCardNumber(),
    bonusBalance: brand.welcomeBonus,
    spendTotal: 0,
    referralCode: newReferralCode(),
    createdAt: now,
    pushEnabled: true,
    emailEnabled: false,
  };

  db.members.push(member);
  db.ledgers[member.id] = [
    {
      id: newId('tx'),
      type: 'bonus',
      createdAt: now,
      locationId: null,
      amount: 0,
      bonusDelta: brand.welcomeBonus,
      balanceAfter: brand.welcomeBonus,
      items: [],
      note: 'Вітальний бонус за реєстрацію',
    },
  ];
  db.vouchers[member.id] = [];
  db.notifications[member.id] = [
    {
      id: newId('n'),
      title: `Вітаємо в ${brand.appName}!`,
      body: `Ми нарахували ${brand.welcomeBonus} вітальних бонусів. Показуйте картку гостя на касі.`,
      createdAt: now,
      read: false,
    },
  ];

  const token = newId('tok');
  db.sessions[token] = member.id;
  await persist();

  return delay({ session: { token, memberId: member.id }, member });
}

/** Resolves the member behind a persisted token, or fails if it is stale. */
export async function me(token: string): Promise<Member> {
  const db = await ready();
  const memberId = db.sessions[token];
  const member = memberId ? db.members.find((m) => m.id === memberId) : undefined;
  if (!member) return fail('Сесія завершилась. Увійдіть знову.', 'unauthorized', 0);
  return delay(member, 120);
}

export async function logout(token: string): Promise<void> {
  const db = await ready();
  delete db.sessions[token];
  await persist();
  await delay(null, 120);
}

/** Irreversible: removes the profile, its ledger and all accrued bonuses. */
export async function deleteAccount(token: string): Promise<void> {
  const db = await ready();
  const memberId = db.sessions[token];
  if (!memberId) return fail('Сесія завершилась. Увійдіть знову.', 'unauthorized', 0);

  db.members = db.members.filter((m) => m.id !== memberId);
  delete db.ledgers[memberId];
  delete db.vouchers[memberId];
  delete db.notifications[memberId];
  delete db.sessions[token];
  await persist();
  await delay(null);
}

/** Dev helper wired to the "reset demo data" row in the More tab. */
export async function resetMockBackend(): Promise<void> {
  challenges.clear();
  await reset();
}
