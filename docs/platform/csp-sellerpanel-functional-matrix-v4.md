# CSP Sellerpanel Functional Matrix V4 → V5 update

Baseline app: `76a8e50c8` (PR #363 LIVE).  
Staging Core: `auedugihkduoaikfusqe`. Production Core: `qbcqoixhrvhnuwphefvw` (no SQL this job).

**Canonical V5 matrix:** `docs/platform/csp-sellerpanel-functional-matrix-v5.md`  
**Closure report:** `docs/platform/csp-sellerpanel-final-closure-v5-staging-report.md`

Legend: **VERIFIED** · **CODE_READY** · **BLOCKED** · **NOT_DONE**

| Area | Status | Evidence |
|------|--------|----------|
| Registration / approval | CODE_READY | Prior LIVE + Core status checks |
| 2FA | CODE_READY | Existing gates; not re-run |
| Growth Academy | CODE_READY | ZERO DIFF |
| Certification | CODE_READY | Existing gates |
| Product rights | CODE_READY | Materials product filter Staging-verified |
| Sales links create/list/copy | CODE_READY | App LIVE |
| Sales links deactivate | **VERIFIED** (Staging) | SQL V4 applied Staging; RPC own/cross/suspended/idempotent/audit |
| Visits / attribution capture | **BLOCKED** | No public click-capture RPC; future must honor `active=false` |
| Leads / customers | CODE_READY | Partner-scoped reads LIVE |
| Sales | **VERIFIED** (Staging Core) | Period fixtures via `csp_apply_paid_period_event` |
| Commission (P1 not earned / P2 once / renewal none / replay) | **VERIFIED** (Staging) | 4/4 harness |
| Settlements (manual) | CODE_READY | RPCs present; not exercised this run |
| Messages | **VERIFIED** (Staging) | Admin→partner→read→reply + IDOR + suspended |
| Notifications | CODE_READY | Unread from messages API |
| Sales materials | **VERIFIED** (Staging) | Draft → publish → withdraw + product gate |
| Profile / bank | CODE_READY | Prior V3/V4 |
| Platform admin SELGERE | CODE_READY | Recipient picker LIVE |
| Language / access control | CODE_READY | 7 locales prior; partner allowlist |
| Stripe TEST full funnel | **BLOCKED** | Core fixtures used; no LIVE payments |
| Production deactivate SQL | **NOT_DONE** | Separate owner approval required |

## SQL V4

| Env | Status |
|-----|--------|
| Staging `auedugihkduoaikfusqe` | Applied — SHA `b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3` |
| Production `qbcqoixhrvhnuwphefvw` | **Not applied** — `csp_deactivate_attribution_link` absent |

## Staging harness

28 / 28 assertions passed (`csp_v5_staging_verify_harness.sql`). Fixtures cleaned (leftover partners/materials/auth = 0). Append-only ledger retained by design.
