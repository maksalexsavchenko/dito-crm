import { create } from 'zustand';
import { postings as seed, type Posting } from '../data/postings';

let nextNum = 200;

interface PostingsState {
  postings: Posting[];
  addPosting: (p: Omit<Posting, 'id' | 'num'>) => void;
  updatePosting: (id: string, patch: Partial<Posting>) => void;
  removePosting: (id: string) => void;
}

// Клієнтський стор оприбуткувань (поки без бекенду), як і stores/products.
export const usePostings = create<PostingsState>((set) => ({
  postings: seed,
  addPosting: (p) =>
    set((s) => ({
      postings: [{ ...p, id: String(Date.now()), num: `H${++nextNum}` }, ...s.postings],
    })),
  updatePosting: (id, patch) =>
    set((s) => ({ postings: s.postings.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  removePosting: (id) => set((s) => ({ postings: s.postings.filter((x) => x.id !== id) })),
}));
