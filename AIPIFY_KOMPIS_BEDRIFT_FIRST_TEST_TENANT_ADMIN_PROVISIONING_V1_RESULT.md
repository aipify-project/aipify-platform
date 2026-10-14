# AIPIFY — Kompis Bedrift First Test Tenant Admin Provisioning V1

**Date:** 2026-10-14  
**Repo:** `aipify-project/aipify-platform`  
**Worktree:** `/Users/veltrix/Development/aipify-bedrift-first-test-tenant-admin-provisioning-v1`  
**Baseline:** `70b0f693` (PR #208 MERGED/LIVE)  
**Branch:** `feat/platform-bedrift-first-test-tenant-admin-provisioning-v1`  
**Verdict:** see footer after CI/deploy

## Goal delivered

Canonical, reusable, fail-closed Platform prepare flow for attaching an organization administrator to a **future** new customer — without creating tenants, auth users, invitations, memberships, or Bedrift grants in Production.

## Mapping (existing hole confirmed)

| Step | Existing behavior |
| --- | --- |
| `POST /api/platform-portal/customers` → `create_platform_portal_customer` | Org identity only — **no** admin |
| Contact-email identity PATCH | `auth_unchanged: true` — **no** membership |
| APP team invite | `inviteSoon` / unwired |
| Core `invite_organization_user` | **Stub** (logs only; no membership/email) |

## Data flow (this job)

```
Platform admin (authenticated)
  → GET …/admin-provisioning
      → Core RO: get_platform_portal_customer_identity
      → Core RO: get_platform_portal_customer_detail (member_count)
      → readiness + prerequisite checklist
  → POST …/admin-provisioning mode=prepare
      → validate email/role/reason/apk-idempotency
      → dry-run plan (sideEffects all false)
  → POST mode=execute
      → 403 owner_provision_authorization_required
        and/or invite_delivery_not_connected
      → never auth.admin / invite RPC / membership write
```

## Files

- `lib/platform-portal/admin-provisioning.ts`
- `lib/platform-portal/admin-provisioning.test.ts`
- `app/api/platform-portal/customers/[id]/admin-provisioning/route.ts`
- `components/platform/platform-portal/PlatformPortalAdminProvisioningPanel.tsx`
- `components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx`
- `app/platform/customers/[id]/page.tsx`
- `lib/platform-portal/labels.ts` / `index.ts`
- `locales/{en,no,sv,da,pl,uk,es}/platform.json`
- this RESULT

## Safety gates

| Gate | Status |
| --- | --- |
| `ADMIN_PROVISION_OWNER_ALLOWLIST` empty | PASS |
| `ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED = false` | PASS |
| Execute UI permanently disabled | PASS |
| No `admin@aipify.tech` hardcoded runtime target | PASS |
| No Production tenant/user/invite/email/SQL | PASS |
| `KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST` still empty | PASS |
| Frozen Website Kompis 46/46 | PASS |
| Step B stash `step-b-wip-blocked-not-for-merge` preserved | PASS |
| UnoNight Web-only (no Bedrift grant) | PASS |

## Tests

- `npx tsx lib/platform-portal/admin-provisioning.test.ts`
- related: MFA boundary / bedrift activation / access-control frozen hashes
- `npm run typecheck` / `npm run build` (see footer)

## NOT RUN (by design)

- Live invitation acceptance
- New customer creation
- Auth user create for `admin@aipify.tech`
- Bedrift activate
- Production SQL / schema / secrets

## OWNER EXECUTE object (NOT approval)

Separate later job only after explicit owner authorization:

1. **D1** Create NEW customer via existing Platform create-customer (named org — not UnoNight).
2. **D2** Attach commercial agreement/license path as separately authorized (no Bedrift yet).
3. **D3** Admin identity for `admin@aipify.tech`:
   - Add **named customer id** to `ADMIN_PROVISION_OWNER_ALLOWLIST`
   - Ship/connect **real** invite/accept Core contract (replace stub)
   - Execute attach with `apk-` idempotency + audit; existing identity = explicit accept only
4. **D4** Named Bedrift activate (`KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST` + confirmation) — separate from D3.
5. **D5** After-check: membership active · Bedrift status · UnoNight still Web-only · FAQ/domains untouched.

**Stop / rollback signals:** any email send failure, auth create ambiguity, cross-tenant auto-link attempt, Bedrift grant sneak-in, frozen-chain touch, UnoNight mutation → STOP and revoke pending invite only via named compensation (never delete auth users on retry).

After verified Bedrift test tenant + owner E1/E2/E3 cutover choice, Step B may resume as its **own** job.
