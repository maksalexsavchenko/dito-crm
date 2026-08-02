import type { Voucher } from '@/domain/types';

// Codes the mock backend accepts on the redemption screen.
export const redeemableVouchers: Voucher[] = [
  {
    id: 'v-welcome',
    code: 'КАВА100',
    title: 'Бонус на каву',
    description: '100 бонусів на будь-який напій у мережі.',
    bonusValue: 100,
    status: 'active',
    expiresAt: '2026-12-31T23:59:59.000Z',
    redeemedAt: null,
  },
  {
    id: 'v-birthday',
    code: 'ДР2026',
    title: 'Іменинний ваучер',
    description: '200 бонусів до дня народження.',
    bonusValue: 200,
    status: 'active',
    expiresAt: '2026-12-31T23:59:59.000Z',
    redeemedAt: null,
  },
  {
    id: 'v-summer',
    code: 'ЛІТО50',
    title: 'Літня акція',
    description: '50 бонусів за літню промо-кампанію.',
    bonusValue: 50,
    status: 'expired',
    expiresAt: '2026-06-30T23:59:59.000Z',
    redeemedAt: null,
  },
];
