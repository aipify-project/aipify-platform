# Certified Aipify Sales Partner — Complete Build V1 Report

**Date:** 2026-11-24  
**Branch:** `feat/certified-sales-partner-complete-v1`  
**Base:** `origin/main` @ `c7995407cdb310bc8bdf03c070818a69f5bf5147`  
**Worktree:** `/Users/veltrix/Development/aipify-certified-sales-partner-complete-v1`

## Basis overview (short)

| Area | Status |
|---|---|
| Existing `/partners` portal, academy, settlement, attribution `/p/[slug]` | CODE_PRESENT — reused |
| Growth Partner %-tier engines (Phase 333+) | Present — **not** used as CSP commission truth |
| Platform sidebar group **Selgere** | Existed with 3 links — **expanded** to CSP control plane |
| Fixed one-time commission after **2 paid periods** | **New** domain rules + migration candidate |
| Kompis Public Chain | **Unchanged** (diff does not touch protected paths) |
| SQL on Staging/Production | **NOT APPLIED** — separate owner gate required |

## What shipped in this job (APP code, fail-closed)

1. **Domain** `lib/certified-sales-partner/` — constants, types, commission rules (one-time / 2 periods / no renewals), feature gate, Kompis honest-blocked helper, labels.
2. **Migration candidate** `supabase/migrations/20261941000000_certified_sales_partner_core_v1.sql`  
   SHA-256: `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95`  
   Tables + RLS revoke + `get_csp_platform_overview` / `get_csp_partner_portal_bundle`.
3. **Platform Admin → Selgere** routes under `/platform/sellers/*` (overview, partners, products, rates, attribution, academy, materials, leads/sales, settlements, audit, settings) with honest backend-not-ready states.
4. **Partner portal** Light Enterprise shell + CSP nav IA (`lib/partners-portal/csp-nav.ts`).
5. **Public recruitment** `/certified-sales-partner`.
6. **Product attribution** `/p/[partnerSlug]/[productSlug]?channel=…` (reuses existing resolve/capture RPCs; fail-closed redirect).
7. **i18n** en/no/sv/da/pl/uk (+ es parity for platform nav).
8. **Tests PASS:** commission-rules + platform sellers nav structure.

## Explicitly NOT LIVE / BLOCKED

| Gate | Status |
|---|---|
| Apply CSP SQL to Staging | **BLOCKED** — needs exact owner approval |
| Apply CSP SQL to Production | **BLOCKED** — needs exact owner approval |
| `AIPIFY_CSP_BACKEND_READY` / RPC probe green | Fail-closed until migration applied |
| Full E2E: registration → cert 80% → link → Stripe #1/#2 → earn → monthly payout | **FULL_E2E_BLOCKED** without Core SQL + controlled test payments |
| Real bank payout automation | Out of scope (manual payout only) |
| Kompis help inside Academy tests | **Honest blocked** (no Core changes) |
| Voice products LIVE checkout | Future / Admin-publish later — not fabricated |

## E2E matrix (honest)

| Case | Result |
|---|---|
| A Recruitment / approval UI surfaces | PARTIAL — pages exist; backend profile write needs SQL |
| B Academy 80% server score | PARTIAL — rules + tables in migration; UI reuses academy routes |
| C Admin product + fixed commission | PARTIAL — Platform products/rates pages fail-closed until RPC |
| D Attribution 90d / product+channel path | PARTIAL — route added; first-valid-touch logic unit-tested; live CSP ledger pending SQL |
| E/F Stripe period #1/#2 → earn once | **BLOCKED** — no Production payment test without separate consent |
| G Monthly settlement statuses | **BLOCKED** until SQL + finance ops |
| H Locked email templates | Not fully rebuilt this pass (existing partner email engines remain) |
| I RBAC/IDOR | Schema revoke+DEFINER stubs prepared; live proof after SQL |
| J Responsive / i18n | PASS for new surfaces (core locales + es nav) |
| K Kompis chain untouched | PASS |
| L CI/Preview/Production READY | Pending PR |

## Owner decisions needed next

1. **Approve Gate S/P for SQL only:**  
   `20261941000000_certified_sales_partner_core_v1.sql`  
   SHA-256 `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95`  
   on Staging and/or Production (Staging may lack partner tables — expect Production-first or seed plan).
2. After SQL: set env probe / confirm RPC, then continue Stripe #2 earn wiring + settlement batch under a follow-on exact approval.
3. Ordinary APP PR may merge with fail-closed UI **without** claiming LIVE sales/commission.

## End state

**APP scaffolding + domain rules + Platform Selgere + recruitment + attribution path: READY FOR PR.**  
**Commercially LIVE certified sales/commission/payout flow: NOT COMPLETE until SQL + payment E2E gates pass.**
