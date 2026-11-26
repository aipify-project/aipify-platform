# CSP Sellerpanel Functional Matrix V5 (Staging)

Baseline app: `76a8e50c8` (#363 LIVE). Staging Core: `auedugihkduoaikfusqe`.  
Deactivate SQL V4 Staging-applied SHA `b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3`.

Legend: **VERIFIED** · **CODE_READY** · **BLOCKED** · **NOT_DONE**

| Area | Status | Evidence |
|------|--------|----------|
| Registration / approval gates | CODE_READY | Prior LIVE + Core status checks; not re-run |
| 2FA | CODE_READY | Existing platform/partner gates; not re-run |
| Growth Academy | CODE_READY | ZERO DIFF; prior pass rules unchanged |
| Certification / product rights | CODE_READY | Existing gates; materials product filter verified Staging |
| Sales links create/list/copy | CODE_READY | App LIVE (#360/#363) |
| Sales links deactivate | **VERIFIED** (Staging) | RPC applied; own/cross/suspended/idempotent/audit/history |
| Public click capture | **BLOCKED** | No `csp_record_*` click RPC on Staging; future capture must honor `active=false` |
| Unique visit dedupe | **BLOCKED** | Same external gate |
| Leads / customers | CODE_READY | Partner-scoped reads LIVE |
| Sale period 1 → not earned | **VERIFIED** (Staging) | `csp_apply_paid_period_event` fixture |
| Sale period 2 → earned once | **VERIFIED** (Staging) | Fixture |
| Renewal no new commission | **VERIFIED** (Staging) | Period 3 fixture |
| Webhook replay no double | **VERIFIED** (Staging) | Same eventId |
| Refund/chargeback | CODE_READY | RPC supports types; not exercised this run |
| Manual settlements | CODE_READY | Transition RPCs present; not exercised |
| Stripe TEST full funnel | **BLOCKED** | No Stripe TEST wiring in this job; Core paid-period fixtures used instead |
| Messages admin→partner→reply | **VERIFIED** (Staging) | Ephemeral fixtures |
| Mark-read / suspended / IDOR | **VERIFIED** (Staging) | |
| Notifications unread | CODE_READY | App derives from messages API (#363) |
| Materials draft/publish/withdraw | **VERIFIED** (Staging) | Product filter + partner forbid upsert |
| Profile / avatar | CODE_READY | Prior V3 |
| Bank details | CODE_READY | Panel LIVE; encryption env-dependent |
| Platform SELGERE admin | CODE_READY | Recipient picker LIVE |
| i18n 7 locales | CODE_READY | Prior V4 |
| Unonight CSP suspended | VERIFIED | Untouched |
| Kompis Public Chain / Academy rules | VERIFIED | ZERO DIFF |
| Production deactivate SQL | **NOT_DONE** | Requires separate owner approval |

## Staging assertion tally (disposable harness)

28 / 28 core assertions **passed** (deactivate 8 · messages 8 · materials 8 · sales/commission 4).  
Harness cleanup: `csp_commission_ledger` append-only — residual ledger delete skipped; partner/auth/material fixtures cleaned.
