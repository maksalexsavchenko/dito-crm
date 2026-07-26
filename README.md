# Dito CRM

White-label CRM platform for small retail and service/repair businesses.

## Structure (Turborepo + pnpm)

```
apps/
  admin/          # main CRM app — React 19 + Vite + Tailwind v4 + TanStack
packages/
  ui/             # shared UI kit (shadcn-style)
  config/         # tenant configs, feature flags, white-label themes
```

## Getting started

```bash
pnpm install
pnpm dev            # serves apps/admin at http://localhost:5173
```

## White-label

Each tenant has its own theme (`packages/config/src/tenants.ts`). The brand
switcher in the sidebar swaps CSS variables at runtime — one codebase,
different brands. Modules are toggled per tenant via feature flags.

## Notes

- Data is mocked client-side (Zustand stores); no backend yet.
- Multi-tenant by design; `cloud` / `dedicated` modes via config.
