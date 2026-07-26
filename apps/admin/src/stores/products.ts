import { create } from 'zustand';
import { products as seed, type Product } from '../data/products';

let nextId = 1000;

interface ProductsState {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
}

// Client-side product store (no backend yet). CRUD is reflected in the table immediately.
export const useProducts = create<ProductsState>((set) => ({
  products: seed,
  addProduct: (p) => set((s) => ({ products: [{ ...p, id: String(++nextId) }, ...s.products] })),
  updateProduct: (id, patch) =>
    set((s) => ({ products: s.products.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  removeProduct: (id) => set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
}));
