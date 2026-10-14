# AIPIFY — Kompis Bedrift Test Tenant & License Activation Prep V1 RESULT

**Oppgave:** `AIPIFY.KOMPIS.BEDRIFT.TEST.TENANT.AND.LICENSE.ACTIVATION.PREP.V1`  
**Date:** 2026-10-14  
**Worktree:** `/Users/veltrix/Development/aipify-bedrift-test-tenant-prep-v1`  
**origin/main:** `ff7322395d15cbb18ca86027691c6fbcbb6c425d`  
**Core:** `qbcqoixhrvhnuwphefvw` (read-only)  
**Overall:** **PARTIAL** — plan ready · **STOP** before create/invite/activate  
**Execution readiness:** **BLOCKED** until owner-approved create + Platform activate surface (or named RPC call) + admin attach path

---

## Scorecard

| Proof point | Status |
|-------------|--------|
| Collision / no Step B impl duplicate | **PASS** — Step B still NOT IMPLEMENTED (#201) |
| Platform create-customer flow mapped | **PASS** |
| `admin@aipify.tech` existence (aggregate) | **PASS** — **0** auth users / **0** linked app users |
| Step A RPCs LIVE + contracts | **PASS** |
| Safe Platform HTTP activate for `kompis_bedrift` | **BLOCKED** — Core RPC only; no `app/api/platform-portal/...` wrapper found |
| Admin invite/attach Platform→APP path | **PARTIAL** — Core `invite_organization_user` exists; Team UI still `inviteSoon`; no platform-portal invite route found |
| UnoNight Web unchanged (RO) | **PASS** |
| Frozen WK 46 / Q15 / cost V2 / index | **0 changes** this job |
| Auth/tenant/license writes | **NOT RUN** (forbidden) |

---

## 1. Canonical Platform → Core flows (read-only)

### A. Create customer organization

| Layer | Artifact |
|-------|----------|
| UI | `PlatformPortalCustomerCreationPanel` → `POST /api/platform-portal/customers` |
| API | `app/api/platform-portal/customers/route.ts` |
| Core RPC | `create_platform_portal_customer(p_organization_number, p_legal_name, p_display_name, p_slug, p_country)` |
| Writes | `companies` → `customers` → org sync |
| Explicitly does **not** | subscriptions, licenses, domains, installs, entitlements, **auth users**, invite emails |

Country-aware org number (NO = 9 digits; other ISO-2 = text 2–64). Requires `_ppsf258_require_platform_access()`.

### B. License / agreement (required before Bedrift activate)

| Layer | Artifact |
|-------|----------|
| API | `POST /api/platform-portal/customers/[id]/licenses` |
| Core RPC | `create_platform_portal_customer_license(...)` |
| Why | Bedrift activate **eligible** only if subscription `active`/`trialing` and not `paused` |

### C. Kompis Bedrift product grant (Step A)

| RPC | Signature / gates |
|-----|-------------------|
| Status | `get_platform_portal_customer_kompis_bedrift_status(p_customer_id uuid) → jsonb` |
| Activate | `activate_platform_portal_customer_kompis_bedrift(p_customer_id, p_internal_reason, p_confirmation, p_idempotency_key)` |
| Deactivate | `deactivate_platform_portal_customer_kompis_bedrift(...)` |

**Activate requirements (from migration `20261939000000`):**

- Platform access (`_ppsf258_require_platform_access`)
- `p_confirmation = true`
- Reason 3–500 chars (no secret patterns)
- Idempotency key `^bpk-` length 8–128; audit via `platform_admin_audit_logs` action `platform_customer_kompis_bedrift_activate`
- Customer row exists; **eligible** = healthy agreement **and** not already active
- Inserts/updates `tenant_modules` (`module_key = 'kompis_bedrift'`) — **no** membership / `employee_knowledge` alias

**Grants:** `authenticated` EXECUTE status/activate = true; `anon` = false (RO probe).

**Platform HTTP/UI for activate/status:** **NOT FOUND** under `app/api/platform-portal/**`. Calling the RPC from ad-hoc SQL/scripts is **not** a documented safe Platform flow for this job → treat activate as **BLOCKED** until a thin Platform API/panel is approved **or** owner names an exact RPC-via-platform-admin-session procedure.

### D. Attach `admin@aipify.tech`

| Finding | Evidence |
|---------|----------|
| Auth user today | **0** (`auth.users` email match) |
| Linked `public.users` | **0** |
| `create_platform_portal_customer` | Does **not** create auth users / send invites |
| Core invite RPC | `invite_organization_user` (legacy) present |
| Platform/APP invite API wire-up | **Not found** in `app/api/platform-portal`; Team center shows `inviteSoon` |

**Do not assume** the same email can recreate a user later — today it is absent, so first creation needs a **named** owner-approved auth/invite job.

---

## 2. Proposed separate Bedrift test tenant (not created)

| Field | Prep value |
|-------|------------|
| Working name | Aipify Bedrift Test |
| Suggested slug | `aipify-bedrift-test` (confirm uniqueness at execute time; reserved slugs include `aipify`, `aipify-group`, …) |
| Intended admin | `admin@aipify.tech` (not yet an auth user) |
| Separation | New `company_id` / `customer_id` — **never** UnoNight `7126b75f-…` / `32d748eb-…` |
| Product | `kompis_bedrift` only for this test (no UnoNight grant) |

Exact legal name, country, and registration number must be chosen in the **execute** approval text.

---

## 3. Exact activate sequence (when owner approves — not this job)

1. **Create customer** via Platform `POST /api/platform-portal/customers` → RPC `create_platform_portal_customer` (record returned `customer_id` / `company_id`).
2. **Provision agreement** via Platform licenses API → `create_platform_portal_customer_license` until status/status probe shows Bedrift `eligible=true`.
3. **Admin identity** (separate named approval): create or invite `admin@aipify.tech` and attach as **owner** on the new company only — after a verified invite/attach path is named (Platform API or approved Core RPC + APP).
4. **Activate Bedrift** only after a safe Platform surface exists **or** owner explicitly authorizes platform-admin session call to `activate_platform_portal_customer_kompis_bedrift` with `p_confirmation=true`, reason, and `bpk-…` idempotency key for **that customer_id only**.
5. **Verify** status RPC `active=true`; audit row present; UnoNight `kompis_bedrift` still **0**.
6. **Then** Step B gates (separate job). **Then** authenticated Bedrift E2E (separate).

---

## 4. Step B risk (unchanged)

Membership-default still opens Bedrift UI; `pathDenied` unused for redirect; EKE APIs lack product entitlement checks (#188/#189/#201). Creating a tenant or granting `kompis_bedrift` must **not** be described as fail-closed product separation. Test matrix for later jobs:

| Case | Expectation after Step B |
|------|--------------------------|
| Web-only (UnoNight) | Web OK · Bedrift deny (URL/API) |
| Bedrift-only (new tenant) | Bedrift OK · Web deny if no `website_kompis` |
| Dual (fixture) | Both per modules |
| None | Both deny |
| Direct URL/API | Server 403/redirect — not UI hide alone |

---

## 5. UnoNight RO re-verify (2026-10-14)

| Fact | Value |
|------|--------|
| Customer / company | `32d748eb-…` / `7126b75f-…` · slug `unonight` |
| `website_kompis` | licensed + enabled |
| `kompis_bedrift` rows | **0** (platform-wide grants also **0**) |
| Install `180c9d31-…` | active |
| Verified domains | **2** (`www.unonight.com`, `unonight.com`) |
| FAQ published + public_safe | **5** |
| Frozen WK / Q15 P1 | Untouched this job (P1 already LIVE #203) |

---

## 6. i18n note (later UI)

Active locales: core `en,no,sv,da,pl,uk` + extended `es` (`lib/i18n/config.ts`). Any future Platform create/activate/deny copy and Step B APP gates must use shared keys in **all** active locales — no EN-only fallback as finished work. No new strings in this prep job.

---

## 7. Forward plan (dependencies)

| Phase | Job | Needs |
|-------|-----|-------|
| **A** | Owner-approved: create Bedrift test customer + license (+ optional identity email) | Exact org identity · **no** UnoNight · **no** bedrift activate yet if Platform surface missing |
| **A′** | Platform `kompis_bedrift` status/activate API + UI (thin Core client) | Ordinary code PR · no frozen WK · no SQL if RPCs already LIVE |
| **A″** | Owner-approved: create/invite `admin@aipify.tech` onto new tenant only | Named auth/invite procedure |
| **A‴** | Owner-approved: `activate_…_kompis_bedrift` for new `customer_id` only | Platform surface **or** exact RPC authorization |
| **B** | Step B APP/API fail-closed gates | After ≥1 real grant **or** staged flag policy |
| **C** | Authenticated Bedrift E2E | After A‴ + B |

**NOT RUN here:** tenant create · invite · auth user · license · activate · Step B · E2E · SQL · provider · index.

---

## Owner approvals required before any write

1. Exact create payload (legal name, display name, slug, country, registration number).  
2. License/plan parameters for eligibility.  
3. Auth/invite method for `admin@aipify.tech` (user does not exist today).  
4. Either ship Platform activate API/UI **or** name an exact one-shot platform-admin RPC activate for the new customer only.  
5. Explicit “do **not** grant UnoNight `kompis_bedrift`”.

---

## Confirmations

Frozen WK **0/46** · SQL apply **0** · provider **0** · license/tenant writes **0** · Step B code **0** · docs-only RESULT this job.

**Next single job (recommended):** `AIPIFY.PLATFORM.KOMPIS_BEDRIFT.STATUS_ACTIVATE.API_UI.V1` — thin Platform portal status/activate against existing Step A RPCs (no SQL; no UnoNight grant; no frozen WK). In parallel, owner can approve Phase A create+license text once Platform activate path is ready.
