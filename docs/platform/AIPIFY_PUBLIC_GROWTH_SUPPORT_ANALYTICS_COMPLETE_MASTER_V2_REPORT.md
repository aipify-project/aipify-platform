# AIPIFY_PUBLIC_GROWTH_SUPPORT_ANALYTICS_COMPLETE_MASTER_V2 — Report

**Agent 3** · Worktree `aipify-core-support-complete-two-way-communication-v1` · Branch `feat/public-growth-support-analytics-master-v2`  
**Did not touch** Agent 1/2/4 worktrees (including `/Users/veltrix/Development/aipify` billing).

## A. Release baseline — LIVE

| Surface | Deploy | Commit | Notes |
|---|---|---|---|
| `aipify.ai` / `www` | `dpl_3Q81Usbic7kL8kgwVzDuCyUAMv17` | `03f7bebce` | Includes #535 (`c332b5888`) + #536 |
| `app.aipify.ai` | `dpl_4o5P78xvonzGyqyFrMrQ7LaRobUb` | `03f7bebce` | Same HEAD |
| #535 features on Production | Verified via alias HEAD ≠ older `dpl_3P7FNf7` | Idempotency, unread note, canonicals, robots `/login` | |
| Website Kompis freeze | **3-file DRIFT** | Widget, answer-policy, feedback-server hashes ≠ manifest | No freeze edits; needs separate YES |

## B. Support — INTEGRATION_READY / partial LIVE

| Step | Status |
|---|---|
| Admin draft → send → customer_visible | **LIVE** (inbox_persisted) |
| APP get messages | **LIVE** |
| Customer reply | **LIVE** |
| Unread / presence notify on reply | **CODE_READY SQL candidate** — not applied |
| Guest email | **BLOCKED** (flags false) |
| E2E authorized sessions | **BLOCKED** |
| SUP-1067A439 | Read-only only |

Notify candidate: `docs/sql-candidates/20261128_platform_support_public_reply_app_notify_v1.sql`  
SHA256 `b599dab2c473efa5df9d91088789f9a7d18da7fe50358455764b90333d8fe26a`  
Approval pack: `docs/platform/SUPPORT_NOTIFY_EMAIL_EXACT_APPROVAL_PACK_V2.md`

## C. Email — CODE_READY / gated

Contract + templates remain fail-closed. Exact YES sentences in approval pack. No secrets / sends.

## D. Legacy — CODE_READY matrix only

Exact matrix: `docs/marketing/PUBLIC_LEGACY_301_EXACT_MATRIX_V2.md`  
**No new 301s applied.** Existing redirects unchanged. Safe robots cleanup: remove `/login` from allow (disallow kept).

## E–G. SEO — CODE_READY → deploy with PR

| Item | Status |
|---|---|
| Canonical sales home / growth-partners | LIVE (#535) + hreflang reciprocal same-URL added this job |
| Sitemap / robots | LIVE; robots allow list cleaned |
| JSON-LD | Existing (#533) — no invented ratings |
| Path locales | N/A (cookie UI locale); hreflang → single canonical |
| Freeze files | Untouched |

## H. GSC — BLOCKED counts / recipe ready

`docs/marketing/GSC_OWNER_RECIPE_V2.md` — live robots/sitemap 200 verified; indexed counts not claimed.

## I/J. Analytics / Agent 4 — CODE_READY

| Deliverable | Path |
|---|---|
| Contract | `lib/platform-portal/visitor-today-contract.ts` |
| Fail-closed GA4 adapter | `lib/platform-portal/visitor-today-ga4-adapter.ts` |
| Wired into status load | `load-traffic-status.ts` → `visitorsToday` |
| Tests | `visitor-today-contract.test.ts` |
| Interface doc | `docs/platform/AGENT4_VISITOR_TODAY_CONTRACT_V1.md` |

Live unique-visitor number: **unavailable** until GA4 Data API YES. Agent 4 UI already shows unavailable honestly.

## K. Coordination

Agent 1 billing/Stripe · Agent 2 product · Agent 4 top-bar — contracts only; no cross-worktree edits.

## L. QA

- Unit: visitor-today + traffic-status tests  
- No SQL apply · no email · no freeze · no new tracking tags · no new 301s  
- RESULT: `RESULT.text` (repo root)

## Remaining YES packs

1. Notify SQL Staging then Production (SHA256 above)  
2. Email transport activation  
3. Legacy 301 batch V2  
4. GA4 Data API visitors-today  
5. Freeze drift remediation (separate named YES)  
6. GSC submit/request indexing if desired  
