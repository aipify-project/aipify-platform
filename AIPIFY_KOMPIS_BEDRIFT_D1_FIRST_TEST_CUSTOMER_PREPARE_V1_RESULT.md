# AIPIFY — Kompis Bedrift D1 — First Test Customer Prepare V1

**Date:** 2026-10-14  
**Repo:** `aipify-project/aipify-platform`  
**Worktree:** `/Users/veltrix/Development/aipify-bedrift-d1-first-test-customer-prepare-v1`  
**Baseline:** `41bfc031` (PR #209 MERGED / origin/main)  
**Branch:** `feat/platform-bedrift-d1-first-test-customer-prepare-v1`  
**Verdict:** see footer after CI/deploy

## Goal delivered

Canonical, reusable, fail-closed Platform **prepare / dry-run** for a **new, separate** Kompis Bedrift test customer identity — without creating a Production customer, auth user, invite, membership, entitlement, or Bedrift license in this job.

## Gap found (inspection)

| Existing | Status |
| --- | --- |
| `POST /api/platform-portal/customers` → `create_platform_portal_customer` | Live Production create (write) — no prepare/dry-run |
| Admin-provisioning prepare (#209) | Exists for **existing** customer admin attach — not customer identity create |
| Bedrift status/activate (#208) | Status RO + activate locked — not customer create |
| D1 prepare route | **Missing** before this job |

## Data flow (this job)

```
Platform admin (authenticated)
  → POST /api/platform-portal/customers/prepare mode=prepare
      → parse identity + reason + confirmation + cpk- idempotency
      → Core RO: get_platform_portal_customers (advisory registry scan)
      → dry-run plan (sideEffects all false)
  → POST mode=execute
      → 403 create_execute_not_enabled
        (CUSTOMER_CREATE_EXECUTE_ENABLED=false; empty owner allowlist)
      → never create_platform_portal_customer / auth.admin / invite / Bedrift grant
```

UI: customer creation panel primary action = prepare dry-run; Production Create CTA disabled with locked copy. Existing `POST /customers` write path remains in API for a later owner-authorized job — panel does not call it.

## Files

- `lib/platform-portal/create-customer-prepare.ts`
- `lib/platform-portal/create-customer-prepare.test.ts`
- `lib/platform-portal/create-customer.test.ts` (panel/locale expectations)
- `app/api/platform-portal/customers/prepare/route.ts`
- `components/platform/platform-portal/PlatformPortalCustomerCreationPanel.tsx`
- `lib/platform-portal/labels.ts` / `types.ts` / `index.ts`
- `locales/{en,no,sv,da,pl,uk,es}/platform.json`
- this RESULT

## Safety gates

| Gate | Status |
| --- | --- |
| `CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST` empty | PASS |
| `CUSTOMER_CREATE_EXECUTE_ENABLED = false` | PASS |
| Prepare `sideEffects` all false | PASS |
| Execute on prepare route fail-closed 403 | PASS |
| No `admin@aipify.tech` hardcoded runtime target | PASS |
| No Production customer/user/invite/email/SQL | PASS |
| `KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST` still empty | PASS |
| `ADMIN_PROVISION_OWNER_ALLOWLIST` still empty | PASS |
| Frozen Website Kompis 46/46 | PASS |
| Step B stash `step-b-wip-blocked-not-for-merge` preserved | PASS |
| UnoNight Web-only (no Bedrift grant / FAQ / member mutation) | PASS |

## Tests

| Suite | Result |
| --- | --- |
| `npx tsx lib/platform-portal/create-customer-prepare.test.ts` | PASS |
| `npx tsx lib/platform-portal/create-customer.test.ts` | PASS |
| `npx tsx lib/platform-portal/admin-provisioning.test.ts` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` (first attempt) | FAIL — ENOSPC (disk full during webpack compile) |
| `npm run build` (retry after reclaiming ~25GB sandbox cache) | PASS (~901s) |

## NOT RUN / NOT CLAIMED (by design)

- Production customer create for any Bedrift test org
- Auth user / invite / membership for `admin@aipify.tech`
- Bedrift license grant
- Customer agreement / commercial plan binding
- Production SQL / schema / secrets
- Claim that a test customer, admin, or license exists after D1

## D2 owner approval points (NOT executed)

Separate later job only after explicit owner authorization:

1. **Legal customer identity** — named org number, legal name, display name, slug (not UnoNight; not email-as-tenant-link).
2. **Customer agreement** — commercial / contractual path as separately authorized (no Bedrift grant yet).
3. **Exact Production create action** — enable named owner allowlist / execute path (or use existing `POST /customers` under explicit owner control) with `cpk-` audit; Core uniqueness authoritative on write.
4. Then D3 admin invite/accept, D4 Bedrift activate, D5 runtime verification — each as its own approved job.

**Stop signals:** any Production write from prepare, cross-tenant auto-attach, Bedrift sneak-in, frozen-chain touch, UnoNight mutation → STOP.

## Footer (fill after PR/LIVE)

- PR: _(pending)_
- Head SHA: _(pending)_
- Merge SHA: _(pending)_
- Vercel deployment: _(pending)_
- Final verdict: _(pending)_
