// ── Loyalty program config ─────────────────────────────────────
// The mobile app (apps/mobile) is white-label just like the CRM: one codebase,
// a different brand per tenant. Everything a client can negotiate — accrual
// rates, tiers, card format, bonus rules — lives here rather than in screens.

export interface LoyaltyTier {
  id: string;
  /** Client-facing tier name, in the tenant's default locale. */
  name: string;
  /** Cashback accrued on a purchase, in percent. */
  cashbackPercent: number;
  /** Cumulative qualifying spend needed to reach this tier. */
  threshold: number;
  color: string;
}

export interface LoyaltyPalette {
  primary: string;
  primaryForeground: string;
  /** Tinted surface used behind the guest card and other brand panels. */
  accentSoft: string;
}

export interface LoyaltyBrand {
  /** Tenant this program belongs to — see `tenants` in ./tenants.ts. */
  tenantId: string;
  appName: string;
  legalName: string;
  /** Printed card number layout, e.g. 5 groups of 3 → 838 721 340 586 295. */
  cardNumber: { groups: number; groupSize: number };
  /** Bonus credited once, when registration completes. */
  welcomeBonus: number;
  /** Bonus credited to the inviter once an invited friend makes a purchase. */
  referralBonus: number;
  /** Bonus units per one currency unit when paying with bonuses. */
  bonusToCurrency: number;
  /** Largest share of a bill payable with bonuses, 0..1. */
  maxBonusShare: number;
  /** Days until accrued bonuses expire; null = they never do. */
  bonusExpiryDays: number | null;
  /** Ordered from lowest to highest threshold. */
  tiers: LoyaltyTier[];
  palette: LoyaltyPalette;
  supportPhone: string;
  supportEmail: string;
  website: string;
  /** Apple Wallet passes need a signing backend — off until one exists. */
  appleWalletEnabled: boolean;
}

// Placeholder program for the pilot client. Swap the strings, palette and tier
// table for the real brand — no screen code has to change.
export const loyaltyBrands: Record<string, LoyaltyBrand> = {
  demo: {
    tenantId: 'demo',
    appName: 'Dito Loyalty',
    legalName: 'ТОВ «Діто»',
    cardNumber: { groups: 5, groupSize: 3 },
    welcomeBonus: 50,
    referralBonus: 100,
    bonusToCurrency: 1,
    maxBonusShare: 0.5,
    bonusExpiryDays: 365,
    tiers: [
      { id: 'starter', name: 'Початківець', cashbackPercent: 3, threshold: 0, color: '#E8285A' },
      { id: 'regular', name: 'Постійний', cashbackPercent: 5, threshold: 2400, color: '#C81E63' },
      { id: 'silver', name: 'Срібний', cashbackPercent: 7, threshold: 6000, color: '#8E24AA' },
      { id: 'gold', name: 'Золотий', cashbackPercent: 10, threshold: 15000, color: '#F5A623' },
    ],
    palette: {
      primary: '#E8285A',
      primaryForeground: '#FFFFFF',
      accentSoft: '#FDEAF0',
    },
    supportPhone: '+380 44 000 00 00',
    supportEmail: 'support@dito.com.ua',
    website: 'https://dito.com.ua',
    appleWalletEnabled: false,
  },
};

export const defaultLoyaltyBrandId = 'demo';

/** Highest tier whose threshold the member's qualifying spend has reached. */
export function tierFor(brand: LoyaltyBrand, spend: number): LoyaltyTier {
  let current = brand.tiers[0];
  for (const tier of brand.tiers) {
    if (spend >= tier.threshold) current = tier;
  }
  return current;
}

/** Next tier up, or null when the member is already at the top. */
export function nextTierFor(brand: LoyaltyBrand, spend: number): LoyaltyTier | null {
  return brand.tiers.find((tier) => tier.threshold > spend) ?? null;
}

/** Cash value of a bonus balance, capped by the program's max bonus share. */
export function bonusPayable(brand: LoyaltyBrand, bonus: number, billTotal: number): number {
  const cap = Math.floor(billTotal * brand.maxBonusShare);
  return Math.min(Math.floor(bonus / brand.bonusToCurrency), cap);
}
