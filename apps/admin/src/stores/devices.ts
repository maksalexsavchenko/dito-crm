import { create } from 'zustand';
import { devices as seed, type Device } from '../data/devices';

let nextId = 2000;

interface DevicesState {
  devices: Device[];
  addDevice: (d: Omit<Device, 'id'>) => void;
  updateDevice: (id: string, patch: Partial<Device>) => void;
  removeDevice: (id: string) => void;
  writeOff: (ids: string[]) => void;
}

// Клієнтський стор пристроїв (поки без бекенду), як і stores/products.
export const useDevices = create<DevicesState>((set) => ({
  devices: seed,
  addDevice: (d) => set((s) => ({ devices: [{ ...d, id: String(++nextId) }, ...s.devices] })),
  updateDevice: (id, patch) =>
    set((s) => ({ devices: s.devices.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  removeDevice: (id) => set((s) => ({ devices: s.devices.filter((x) => x.id !== id) })),
  writeOff: (ids) =>
    set((s) => ({
      devices: s.devices.map((x) => (ids.includes(x.id) ? { ...x, status: 'written_off' } : x)),
    })),
}));
