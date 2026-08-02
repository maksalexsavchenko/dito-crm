# Loyalty API

The contract `apps/mobile` expects. It is not aspirational: `apps/mobile/src/api/*`
already implements these exact signatures against a mock database, so a backend
that matches this document can be swapped in by replacing those function bodies
with `fetch()` calls — no screen or store changes.

All responses are JSON. Authenticated calls send `Authorization: Bearer <token>`.
Errors return `{ "message": "...", "code": "..." }`; `message` is shown to the
user as-is, so it must be written in the tenant's locale.

## Authentication

Phone number plus a one-time SMS code. There are no passwords.

| Endpoint | Request | Response |
| --- | --- | --- |
| `POST /auth/otp` | `{ phone }` | `{ challengeId, expiresIn }` |
| `POST /auth/otp/verify` | `{ challengeId, code }` | `{ token, member }` |
| `POST /auth/register` | see below | `{ token, member }` |
| `GET /me` | — | `Member` |
| `POST /auth/logout` | — | `204` |
| `DELETE /me` | — | `204` |

`phone` is E.164 (`+380671234567`). `expiresIn` is seconds.

**`member` may be `null` in the verify response.** That is the signal that the
phone has no account yet and the app should continue to registration — it is a
normal outcome, not an error. The returned token is only good for the register
call in that case.

`POST /auth/register` takes `{ challengeId, phone, firstName, lastName, email,
birthDate, gender }`. `email` and `birthDate` are nullable; `gender` is
`female | male | unspecified`. The server credits the welcome bonus and writes
the matching `bonus` transaction as part of this call.

`GET /me` is what the app calls on cold start to validate a stored token. It must
return `401` for a stale one — the app then clears the session and shows the
welcome screen.

`DELETE /me` is irreversible and removes the profile, its ledger and any accrued
bonuses.

## Profile and loyalty

| Endpoint | Request | Response |
| --- | --- | --- |
| `PATCH /me` | partial profile | `Member` |
| `GET /me/transactions` | — | `LoyaltyTransaction[]` |
| `GET /me/vouchers` | — | `Voucher[]` |
| `POST /vouchers/redeem` | `{ code }` | `{ voucher, member, transaction }` |
| `POST /reviews` | `{ rating, comment, locationId }` | `201` |

`PATCH /me` accepts any subset of `firstName`, `lastName`, `email`, `birthDate`,
`gender`, `pushEnabled`, `emailEnabled`. The phone number is not editable — it
identifies the card. Validation errors come back as `400` with a user-facing
`message`.

`GET /me/transactions` returns the ledger newest-first. Redeeming a voucher
returns the updated member alongside the new transaction so the app can refresh
the balance without a second request.

## Content

Public: `GET /locations`, `GET /locations/{id}`, `GET /news`, `GET /news/{id}`,
`GET /legal/{slug}` where slug is `terms` or `privacy`.

Authenticated: `GET /me/notifications`, `POST /me/notifications/read` (marks all
read, returns the updated list).

## Entities

```
Member
  id, phone, firstName, lastName, email, birthDate, gender
  cardNumber        15 digits, unformatted — the app groups them for display
  bonusBalance      current bonus balance
  spendTotal        cumulative qualifying spend; the tier is derived from it
  referralCode      shown on the invite screen
  createdAt, pushEnabled, emailEnabled

LoyaltyTransaction
  id, type          purchase | bonus | redeem | expire
  createdAt, locationId
  amount            bill total for a purchase, 0 for pure bonus operations
  bonusDelta        signed: positive accrual, negative spend
  balanceAfter      balance immediately after this transaction
  items[]           { name, qty, price }
  note

Location    id, title, address, latitude, longitude, photoUrl,
            hours { label, openNow }, phone
NewsPost    id, title, excerpt, body, coverUrl, publishedAt
Voucher     id, code, title, description, bonusValue,
            status (active | used | expired), expiresAt, redeemedAt
Notification id, title, body, createdAt, read
LegalDoc    slug, title, updatedAt, paragraphs[] { heading, text }
```

**The server owns the arithmetic.** `balanceAfter`, `bonusBalance` and
`spendTotal` are read-only to the app, which never recomputes them. Tier and
cashback rate are derived from `spendTotal` against the tier table.

## Not in the list above, but the programme does not work without it

The app only ever reads. Something else has to create the accruals, and that
contour still needs designing:

- `POST /pos/transactions` — the till registers a purchase against the
  `cardNumber` from the QR code; the server accrues cashback at the member's
  rate and returns the resulting transaction.
- `POST /pos/redeem` — paying part of a bill with bonuses, capped by the
  programme's `maxBonusShare` (currently 50%).
- Push token registration and delivery.
- `.pkpass` signing for Apple Wallet, plus a `webServiceURL` so the balance on
  the pass itself stays current. This needs an Apple signing certificate; until
  it exists the app's Wallet button is disabled via `appleWalletEnabled`.
- Scheduled jobs: bonus expiry after `bonusExpiryDays`, tier recalculation, and
  the referral bonus once an invited friend makes their first purchase.

## Programme configuration

Tiers, cashback rates, welcome and referral bonuses, the card number format and
bonus rules live in `packages/config/src/loyalty.ts` on the client. That is fine
while the data is mocked, but once a backend exists **it must become the source
of truth** — otherwise the app can advertise one set of terms while the server
calculates another. Expect to serve this config from an endpoint and keep the
local file as the fallback.
