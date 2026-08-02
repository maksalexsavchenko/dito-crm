# Dito CRM

White-label CRM platform for small retail and service/repair businesses.

## Structure (Turborepo + pnpm)

```
apps/
  admin/          # main CRM app — React 19 + Vite + Tailwind v4 + TanStack
  mobile/         # loyalty app for end customers — Expo (React Native) + expo-router
packages/
  ui/             # shared UI kit (shadcn-style, web only)
  config/         # tenant configs, feature flags, white-label themes, loyalty program
```

`packages/ui` is React DOM and is not consumed by `apps/mobile`; the mobile app
has its own token-based primitives in `src/components`. `packages/config` is
plain TypeScript and is shared by both.

## Getting started

```bash
pnpm install
pnpm dev            # serves apps/admin at http://localhost:5173
```

The workspace installs with `node-linker=hoisted` (see `.npmrc`) because Metro
does not resolve pnpm's isolated symlink layout reliably.

## Mobile app (apps/mobile)

```bash
pnpm --filter @dito/mobile dev      # Metro; press i for iOS, w for web
pnpm --filter @dito/mobile lint     # tsc --noEmit
```

Running on the iOS simulator needs a full Xcode install selected:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Expo Go covers day-to-day development. A standalone build (and TestFlight) goes
through EAS: `eas build -p ios`. Android is not configured beyond `app.json`
defaults — `react-native-maps` will need a Google Maps API key when it is.

### Demo data

There is no backend yet. `src/api/*` is the only module that knows this: it
reads from a mock database persisted to AsyncStorage. Replacing those function
bodies with `fetch()` calls is the entire migration — no screen or store changes.

- Any phone number goes through registration and starts with the welcome bonus.
- `+380 67 000 00 00` logs into a seeded account with purchase history.
- The SMS code is always `1234`; voucher codes are `КАВА100` and `ДР2026`.
- **Ще → Скинути демо-дані** wipes the mock backend.

## White-label

Each tenant has its own theme (`packages/config/src/tenants.ts`). The brand
switcher in the sidebar swaps CSS variables at runtime — one codebase,
different brands. Modules are toggled per tenant via feature flags.

Loyalty programmes are configured separately in `packages/config/src/loyalty.ts`
— tiers, cashback rates, welcome and referral bonuses, card number format and
palette. The mobile app reads all of it at runtime, so onboarding a new client
is a config change rather than a fork.

## Notes

- Data is mocked client-side (Zustand stores); no backend yet.
- Multi-tenant by design; `cloud` / `dedicated` modes via config.
- Apple Wallet passes need a server that signs `.pkpass` files — the button is
  present but disabled via `appleWalletEnabled` until that exists.
