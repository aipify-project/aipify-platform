# AIPIFY Commercial Payment & Revenue Activation Master V2

Feature owner: **PLATFORM** (activation gates, YES packages, Core contracts)  
APP UI / Product Center panels: **Agent 2** · Support/analytics delivery: **Agent 3** · Presence statusbar: **Agent 4**

## Priority

**First paying Kompis customer** — reuse Product Center catalog (#525/#530) and fail-closed commercial contracts from #536. Do **not** start Nordic Founder Exchange.

## Verified environment (2026-11-28)

| Env | Ref | Foundation SQL | Snapshot RPC |
|-----|-----|----------------|--------------|
| Staging | `auedugihkduoaikfusqe` | Applied `20261128201827` SHA `2ee4239b…` | **Missing** |
| Production | `qbcqoixhrvhnuwphefvw` | **Not applied** | **Missing** |

## Activation gates

`lib/commercial-billing-sales/activation-gates.ts` — all writers fail-closed (`stripeLive`, `checkoutLive`, `payoutLive`, `invoiceSend`, `percentCommission`).

## Exact YES packages

1. [Production foundation](./AIPIFY_COMMERCIAL_LICENSE_FOUNDATION_PRODUCTION_YES_PACKAGE_V2.md) — SHA `2ee4239b4566c04a0c136e9fc3a311ba7c6e7664c392ccd18916d6fb9b2dd30d`
2. [Staging snapshot read](./AIPIFY_COMMERCIAL_SNAPSHOT_READ_STAGING_YES_PACKAGE_V2.md) — SHA `57269903f43b080ef3156c41fbf354250a2a20ada66d04e638e8ade9aecb0e0d`

Separate YES still required for: Stripe LIVE/secrets, checkout LIVE, EXECUTE grants, percent commission, VAT source, invoice SoR, payout, license level catalog values.

## End-to-end (Kompis-first)

Product Center → price mapping (test only) → APP browse → checkout intent (closed) → verified webhook → entitlement → receipt DTO → seller commission ledger → Agent 3 notifications/analytics (verified payment only).

## Agent contracts

- **Agent 2:** typed license/entitlement/checkout/receipt reads; `purchaseCtaFromThisModule=false`
- **Agent 3:** notifications + `commercial.purchase_verified` analytics (dedupe, consent, no secrets)
- **Agent 4:** presence event names only; `mutatesGlobalStatusbar=false`
