import { create } from 'zustand';
import type {
  AppNotification,
  LoyaltyTransaction,
  Location,
  NewsPost,
  Voucher,
} from '@/domain/types';
import * as content from '@/api/content';
import * as loyalty from '@/api/loyalty';
import { useAuth } from './auth';

interface LoyaltyState {
  transactions: LoyaltyTransaction[];
  vouchers: Voucher[];
  notifications: AppNotification[];
  locations: Location[];
  news: NewsPost[];
  loading: boolean;
  error: string | null;
  /** Everything the tabs need, in one round of requests. */
  load: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  /** Clears cached data on sign-out so the next account starts clean. */
  clear: () => void;
}

const empty = {
  transactions: [] as LoyaltyTransaction[],
  vouchers: [] as Voucher[],
  notifications: [] as AppNotification[],
  locations: [] as Location[],
  news: [] as NewsPost[],
};

export const useLoyalty = create<LoyaltyState>((set, get) => ({
  ...empty,
  loading: false,
  error: null,

  load: async () => {
    const token = useAuth.getState().session?.token;
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const [transactions, vouchers, notifications, locations, news] = await Promise.all([
        loyalty.getTransactions(token),
        loyalty.getVouchers(token),
        content.getNotifications(token),
        content.getLocations(),
        content.getNews(),
      ]);
      set({ transactions, vouchers, notifications, locations, news, loading: false });
    } catch {
      set({ loading: false, error: 'Не вдалося завантажити дані. Потягніть, щоб оновити.' });
    }
  },

  loadTransactions: async () => {
    const token = useAuth.getState().session?.token;
    if (!token) return;
    set({ transactions: await loyalty.getTransactions(token) });
  },

  loadNotifications: async () => {
    const token = useAuth.getState().session?.token;
    if (!token) return;
    set({ notifications: await content.getNotifications(token) });
  },

  markNotificationsRead: async () => {
    const token = useAuth.getState().session?.token;
    if (!token) return;
    set({ notifications: await content.markNotificationsRead(token) });
  },

  clear: () => set({ ...empty, loading: false, error: null }),
}));

/** Unread badge count for the bell in the home header. */
export function selectUnreadCount(state: LoyaltyState): number {
  return state.notifications.filter((n) => !n.read).length;
}

export function selectLocationById(state: LoyaltyState, id: string | null): Location | null {
  if (!id) return null;
  return state.locations.find((l) => l.id === id) ?? null;
}

/** Re-exported so screens can refresh both stores after a bonus movement. */
export async function refreshAfterBonusChange(): Promise<void> {
  await Promise.all([useAuth.getState().refreshMember(), useLoyalty.getState().loadTransactions()]);
}
