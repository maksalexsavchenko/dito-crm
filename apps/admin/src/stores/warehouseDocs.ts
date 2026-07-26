import { create } from 'zustand';
import { warehouseSections, type WRow } from '../data/warehouse';

const initial: Record<string, WRow[]> = Object.fromEntries(
  Object.entries(warehouseSections).map(([k, s]) => [k, [...s.rows]]),
);

interface DocsState {
  rows: Record<string, WRow[]>;
  addDoc: (sectionId: string, row: WRow) => void;
}

// Client-side warehouse documents store. "Create" prepends a row to the given section.
export const useWarehouseDocs = create<DocsState>((set) => ({
  rows: initial,
  addDoc: (sectionId, row) =>
    set((s) => ({ rows: { ...s.rows, [sectionId]: [row, ...(s.rows[sectionId] ?? [])] } })),
}));
