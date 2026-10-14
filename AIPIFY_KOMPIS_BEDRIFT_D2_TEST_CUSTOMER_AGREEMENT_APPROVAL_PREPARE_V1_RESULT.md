# AIPIFY — Kompis Bedrift D2 — Test Customer Agreement & Approval Prepare V1

**Date:** 2026-10-14  
**Repo:** `aipify-project/aipify-platform`  
**Worktree:** `/Users/veltrix/Development/aipify-bedrift-d2-test-customer-agreement-approval-prepare-v1`  
**Baseline:** `27106802` (origin/main after D1 RESULT footer #211)  
**Branch:** `feat/platform-bedrift-d2-test-customer-agreement-approval-prepare-v1`  
**Verdict:** see footer after CI/deploy

## Goal delivered

Canonical, reusable, fail-closed Platform **agreement & owner-approval prepare** for a **future** Bedrift test customer candidate — without creating customers, writing agreements, binding commercial plans, inviting admins, or granting Bedrift.

## Gap found (inspection)

| Existing | Status |
| --- | --- |
| D1 `POST …/customers/prepare` | Identity dry-run only — no agreement readiness |
| `set_platform_portal_customer_commercial_plan` | Live Production **write** — no prepare/execute split |
| `get_platform_portal_customer_agreements_overview` | Subscription projection — not legal acceptance |
| Platform customer legal e-sign / acceptance store | **Missing** → `AGREEMENT_UNVERIFIED` |
| D2 prepare route / UI | **Missing** before this job |

## Data flow (this job)

```
Platform admin (authenticated)
  → POST /api/platform-portal/customers/agreement-approval/prepare mode=prepare
      → parse candidate identity + reason + aap- idempotency + optional plan key
      → Core RO: get_platform_portal_customers (advisory duplicate scan)
      → Core RO: get_platform_portal_commercial_plans (catalog reference)
      → dry-run plan (sideEffects all false; readyToExecute always false)
      → readiness: NOT_FOUND | NEEDS_REVIEW | READY_FOR_OWNER_DECISION | AGREEMENT_UNVERIFIED
  → POST mode=execute
      → 403 agreement_execute_not_enabled
      → never create customer / set commercial plan / write legal acceptance
```

## Files

- `lib/platform-portal/agreement-approval-prepare.ts`
- `lib/platform-portal/agreement-approval-prepare.test.ts`
- `app/api/platform-portal/customers/agreement-approval/prepare/route.ts`
- `components/platform/platform-portal/PlatformPortalCustomerCreationPanel.tsx`
- `lib/platform-portal/labels.ts` / `types.ts` / `index.ts`
- `locales/{en,no,sv,da,pl,uk,es}/platform.json`
- this RESULT

## Safety gates

| Gate | Result |
| --- | --- |
| `AGREEMENT_APPROVAL_EXECUTE_OWNER_ALLOWLIST` empty | PASS |
| `AGREEMENT_APPROVAL_EXECUTE_ENABLED = false` | PASS |
| `PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED = false` | PASS |
| Prepare `sideEffects` all false | PASS |
| Execute on prepare route fail-closed 403 | PASS |
| Legal verification = `AGREEMENT_UNVERIFIED` (no forge) | PASS |
| No `READY_TO_EXECUTE` readiness status | PASS |
| D1 / #208 / #209 allowlists still empty / execute off | PASS |
| No `admin@aipify.tech` hardcoded target | PASS |
| Frozen Website Kompis 46/46 | PASS |
| Step B stash `step-b-wip-blocked-not-for-merge` preserved | PASS |
| UnoNight not used as candidate / no Bedrift grant | PASS |
| No SQL / migration / payment / invite / membership | PASS |

## Tests

| Suite | Result |
| --- | --- |
| `npx tsx lib/platform-portal/agreement-approval-prepare.test.ts` | PASS |
| `npx tsx lib/platform-portal/create-customer-prepare.test.ts` | PASS |
| `npx tsx lib/platform-portal/create-customer.test.ts` | PASS |
| `npx tsx lib/platform-portal/admin-provisioning.test.ts` | PASS |
| `npx tsx lib/platform-portal/commercial-plan.test.ts` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS (~885s) |

## Write-audit (baseline → after)

No Production customer/org/auth/invite/membership/agreement/license/Bedrift writes attributable to this job. Code-only prepare path.

## NOT RUN / NOT CLAIMED

- Naming a real legal test entity
- Legal acceptance recording
- Production customer create
- Commercial plan bind
- Admin invite / Bedrift activate
- Claim that agreement exists or is verified

## OWNER DECISION PACKET (for chat review)

| Field | Value |
| --- | --- |
| Real legal test entity | **UNKNOWN / BLOCKED** — owner must name a non-UnoNight entity; not invented by this job |
| Agreement & version required | **UNKNOWN / AGREEMENT_UNVERIFIED** — Platform customer legal acceptance source not connected |
| Proof / actor for acceptance | **BLOCKED** — no independently verifiable e-sign/acceptance evidence store |
| Where acceptance must be recorded | **not available** until a Core Platform customer legal acceptance contract ships |
| Exact D3/D4 dependencies | Customer must exist (owner-authorized create) → D3 admin invite/accept → D4 Bedrift activate (separate allowlists) |
| Explicit owner approvals still needed | Name legal entity · connect legal acceptance source · authorize create · authorize commercial bind · authorize D3 · authorize D4 |

## Footer (after PR/LIVE)

- PR: _(pending)_
- Head SHA: _(pending)_
- Merge SHA: _(pending)_
- Vercel deployment: _(pending)_
- Final verdict: _(pending)_
