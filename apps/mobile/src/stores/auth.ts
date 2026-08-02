import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { Member, Session } from '@/domain/types';
import * as authApi from '@/api/auth';

const SESSION_KEY = 'dito.loyalty.session.v1';

type Status = 'loading' | 'authenticated' | 'anonymous';

interface AuthState {
  status: Status;
  session: Session | null;
  member: Member | null;
  /** Restores a persisted session on cold start; safe to call more than once. */
  bootstrap: () => Promise<void>;
  signIn: (session: Session, member: Member) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  /** Replaces the cached member after a profile edit or bonus movement. */
  setMember: (member: Member) => void;
  refreshMember: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  status: 'loading',
  session: null,
  member: null,

  bootstrap: async () => {
    const token = await AsyncStorage.getItem(SESSION_KEY);
    if (!token) {
      set({ status: 'anonymous', session: null, member: null });
      return;
    }
    try {
      const member = await authApi.me(token);
      set({ status: 'authenticated', session: { token, memberId: member.id }, member });
    } catch {
      // Stale token (backend wiped, account deleted elsewhere) — start over.
      await AsyncStorage.removeItem(SESSION_KEY);
      set({ status: 'anonymous', session: null, member: null });
    }
  },

  signIn: async (session, member) => {
    await AsyncStorage.setItem(SESSION_KEY, session.token);
    set({ status: 'authenticated', session, member });
  },

  signOut: async () => {
    const { session } = get();
    if (session) await authApi.logout(session.token);
    await AsyncStorage.removeItem(SESSION_KEY);
    set({ status: 'anonymous', session: null, member: null });
  },

  deleteAccount: async () => {
    const { session } = get();
    if (session) await authApi.deleteAccount(session.token);
    await AsyncStorage.removeItem(SESSION_KEY);
    set({ status: 'anonymous', session: null, member: null });
  },

  setMember: (member) => set({ member }),

  refreshMember: async () => {
    const { session } = get();
    if (!session) return;
    try {
      set({ member: await authApi.me(session.token) });
    } catch {
      await get().signOut();
    }
  },
}));
