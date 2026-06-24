import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Toaster } from '@dito/ui';
import { useUI } from '../../store';

export function AppShell({ children }: { children: ReactNode }) {
  const sidebarOpen = useUI((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className={`transition-all duration-200 ${sidebarOpen ? 'pl-60' : 'pl-16'}`}>
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
