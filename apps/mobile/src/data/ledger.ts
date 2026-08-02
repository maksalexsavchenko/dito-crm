import type { LoyaltyTransaction, TransactionItem, TransactionType } from '@/domain/types';

/** A transaction before the running balance is applied. */
interface LedgerEntry {
  id: string;
  type: TransactionType;
  createdAt: string;
  locationId: string | null;
  amount: number;
  bonusDelta: number;
  items?: TransactionItem[];
  note?: string;
}

/**
 * Applies a running balance over entries ordered oldest → newest and returns
 * them newest-first, the way the history screen renders them. Keeping this in
 * one place means mock data can never drift out of sync with the balance.
 */
export function buildLedger(entries: LedgerEntry[]): LoyaltyTransaction[] {
  let balance = 0;
  const withBalance = entries.map((entry) => {
    balance += entry.bonusDelta;
    return {
      id: entry.id,
      type: entry.type,
      createdAt: entry.createdAt,
      locationId: entry.locationId,
      amount: entry.amount,
      bonusDelta: entry.bonusDelta,
      balanceAfter: balance,
      items: entry.items ?? [],
      note: entry.note ?? null,
    } satisfies LoyaltyTransaction;
  });
  return withBalance.reverse();
}

/** Sum of purchase totals — the figure the tier is calculated from. */
export function qualifyingSpend(transactions: LoyaltyTransaction[]): number {
  return transactions
    .filter((t) => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
}

// ── Seeded history for the demo account ────────────────────────
// Log in with +380 67 000 00 00 to get an account that already has purchases;
// any other number goes through registration and starts with the welcome bonus.
export const demoLedger: LoyaltyTransaction[] = buildLedger([
  {
    id: 'tx-1',
    type: 'bonus',
    createdAt: '2026-03-02T10:12:00.000Z',
    locationId: null,
    amount: 0,
    bonusDelta: 50,
    note: 'Вітальний бонус за реєстрацію',
  },
  {
    id: 'tx-2',
    type: 'purchase',
    createdAt: '2026-03-09T08:41:00.000Z',
    locationId: 'loc-2',
    amount: 185,
    bonusDelta: 6,
    items: [
      { name: 'Капучино 300 мл', qty: 1, price: 85 },
      { name: 'Круасан з мигдалем', qty: 1, price: 100 },
    ],
  },
  {
    id: 'tx-3',
    type: 'purchase',
    createdAt: '2026-04-14T09:05:00.000Z',
    locationId: 'loc-1',
    amount: 240,
    bonusDelta: 7,
    items: [
      { name: 'Латте 400 мл', qty: 2, price: 95 },
      { name: 'Сирник', qty: 1, price: 50 },
    ],
  },
  {
    id: 'tx-4',
    type: 'redeem',
    createdAt: '2026-04-14T09:06:00.000Z',
    locationId: 'loc-1',
    amount: 0,
    bonusDelta: -40,
    note: 'Оплата бонусами',
  },
  {
    id: 'tx-5',
    type: 'purchase',
    createdAt: '2026-05-22T13:20:00.000Z',
    locationId: 'loc-3',
    amount: 415,
    bonusDelta: 12,
    items: [
      { name: 'Паста карбонара', qty: 1, price: 245 },
      { name: 'Лимонад домашній', qty: 2, price: 85 },
    ],
  },
  {
    id: 'tx-6',
    type: 'bonus',
    createdAt: '2026-06-01T07:00:00.000Z',
    locationId: null,
    amount: 0,
    bonusDelta: 100,
    note: 'Бонус за запрошеного друга',
  },
  {
    id: 'tx-7',
    type: 'purchase',
    createdAt: '2026-06-19T11:48:00.000Z',
    locationId: 'loc-2',
    amount: 320,
    bonusDelta: 10,
    items: [
      { name: 'Сніданок «Гарячий»', qty: 1, price: 220 },
      { name: 'Американо', qty: 1, price: 100 },
    ],
  },
  {
    id: 'tx-8',
    type: 'purchase',
    createdAt: '2026-07-11T16:02:00.000Z',
    locationId: 'loc-4',
    amount: 680,
    bonusDelta: 20,
    items: [
      { name: 'Млинці з вишнею', qty: 2, price: 180 },
      { name: 'Раф кокосовий', qty: 2, price: 160 },
    ],
  },
  {
    id: 'tx-9',
    type: 'purchase',
    createdAt: '2026-07-28T09:31:00.000Z',
    locationId: 'loc-2',
    amount: 175,
    bonusDelta: 5,
    items: [{ name: 'Флет уайт', qty: 1, price: 95 }, { name: 'Вафлі солоні', qty: 1, price: 80 }],
  },
]);
