import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Placeholder } from './pages/Placeholder';
import { Inventory } from './pages/Inventory';
import { UiKit } from './pages/UiKit';

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

const placeholder = (path: string, key: string) =>
  createRoute({ getParentRoute: () => rootRoute, path, component: () => <Placeholder pageKey={key} /> });

const routeTree = rootRoute.addChildren([
  createRoute({ getParentRoute: () => rootRoute, path: '/', component: Dashboard }),
  createRoute({ getParentRoute: () => rootRoute, path: '/inventory', component: Inventory }),
  placeholder('/sales', 'sales'),
  placeholder('/repair', 'repair'),
  placeholder('/contacts', 'contacts'),
  placeholder('/reports', 'reports'),
  createRoute({ getParentRoute: () => rootRoute, path: '/kit', component: UiKit }),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
