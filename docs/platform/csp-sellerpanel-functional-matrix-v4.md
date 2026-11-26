# CSP Sellerpanel Functional Matrix V4

Baseline: `origin/main` @ `1d23f9640` (PR #362 LIVE). Worktree: `feat/csp-sellerpanel-functional-acceptance-v4-20261126`.

Legend: **VERIFIED** · **CODE_READY** · **CODE_READY_BLOCKED** · **PLACEHOLDER_FIXED** · **EXTERNAL_GATE**

| Area | Status | Notes |
|------|--------|-------|
| Registration / status gates | CODE_READY | Server gates + portal allowlist; Unonight CSP remains suspended |
| Academy / product rights | CODE_READY | Existing exam rules untouched |
| Products pricing / commission display | CODE_READY | Admin rates + catalog; no fake discounts |
| Sales links create/list | CODE_READY | Create + list + visits |
| Sales links deactivate | CODE_READY_BLOCKED | App + UI wired; SQL candidate PREPARED_ONLY (`csp_deactivate_attribution_link_v4`) needs owner apply |
| Social share | CODE_READY | Platforms + copy; no fake direct post |
| Leads / Mine kunder | CODE_READY | Partner-scoped reads |
| Sales / commission / settlements | CODE_READY / EXTERNAL_GATE | Engine in Core; no Production payouts in QA; Stripe webhook→sale still external |
| Attribution unique visits / capture | CODE_READY / EXTERNAL_GATE | Click events counted; bot filter / session capture limited by Core contract |
| Admin messages recipient picker | PLACEHOLDER_FIXED → CODE_READY | Searchable picker; profile compose; blocked statuses |
| Partner messages reply/read | CODE_READY | Live since #362 |
| Materials admin publish | CODE_READY | Register/publish/withdraw; empty until real assets |
| Partner materials visibility | CODE_READY | Published-only RPC |
| Profile / avatar / bank | CODE_READY | Avatar Core sync; bank via existing RPC |
| Help | CODE_READY | Honest sections; contact without dead CTA |
| Platform SELGERE ops pages | CODE_READY | Overview, partners, products, rates, attribution, leads, messages, materials, audit, settings |

## Ownership vs APP #361

| Path family | Owner |
|-------------|-------|
| `/partners/*`, `/platform/sellers/*`, `/api/certified-sales-partner/*`, `/api/platform/sellers/*` | This V4 job |
| `/app/*` customer billing/catalog/nav | PR #361 — do not take over |

## Production Core snapshot (qbcqoixhrvhnuwphefvw)

| Metric | Value |
|--------|-------|
| Partners | 2 |
| Messageable statuses | 1 |
| Suspended | 1 (Unonight CSP remains suspended — do not change) |
| Published materials | 0 |
| Partner messages | 0 |
| `csp_deactivate_attribution_link` | missing (PREPARED_ONLY) |

## SQL apply required (owner)

1. `docs/platform/sql-candidates/csp_deactivate_attribution_link_v4.sql` SHA `b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3`

## Honest E2E note

No Production messages sent in V4 QA. Admin picker + profile compose are CODE_READY; full LIVE_VERIFIED for messaging requires an approved Staging/isolated test partner — not mass/Production messaging.
