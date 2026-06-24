# Dito CRM

White-label CRM/CMS-платформа для малого та середнього бізнесу (роздріб + сервіс/ремонт).

## Структура (Turborepo + pnpm)

```
apps/
  admin/          # основна CRM — React 19 + Vite + Tailwind v4 + TanStack
packages/
  ui/             # спільний UI-kit (shadcn-style: cn, Button, Card)
  config/         # tenant-конфіги, feature-flags, white-label теми
```

## Запуск

```bash
pnpm install
pnpm dev            # підніме apps/admin на http://localhost:5173
```

## White-label

Кожен tenant має свою тему (`packages/config/src/tenants.ts`). Перемикач брендів
у топбарі демонструє зміну `--primary` через CSS-змінні в реальному часі —
один codebase, різні бренди.

## Архітектурні рішення

- **React + Vite**, не Next (CRM — це app, не сайт).
- **Власний бекенд** (поки мок-дані) — Medusa лише для натхнення.
- **Multi-tenant** з ізоляцією за дизайном; режими `cloud` / `dedicated` через config.
- Детальніше — у бізнес-плані та архітектурних діаграмах.
