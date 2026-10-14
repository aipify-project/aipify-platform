# AIPIFY — Core Product Entitlement & APP Separation — Continuation V2

**Date:** 2026-10-14  
**Job:** `AIPIFY_CORE_PRODUCT_ENTITLEMENT_APP_SEPARATION_CONTINUATION_V2_2026_10_14`  
**Repo:** `aipify-project/aipify-platform` @ `e8c34bef6d4603a66258c8c2bac16c88befce86b` (`origin/main`)  
**Core:** Aipify Core `qbcqoixhrvhnuwphefvw` (read-only)  
**Verdict:** **BLOCKED** — Phase 2.5 approval gate (no LIVE code from this job)

---

## Phase 0 — Collision / status gate

| Check | Result |
|-------|--------|
| Prior V1 **implementation** (`…IMPLEMENTATION_V1…`) | **Not implemented.** No merge, no deploy, no implementation RESULT. Job text no longer present under Downloads. |
| What *did* land | Read-only audits **PR #188** + pathDenied note **PR #189** only |
| Competing worktree / open impl PR | **None** for product entitlement separation |
| Spanish #191 (`e8c34bef`) | LIVE locale work — **not reopened**; unrelated to gates |
| Migrations `202619382` / `202619383` | Ledger **present** in Core — **not reapplied** |
| Frozen WK public chain | **46/46**, changed **0** |

**Conclusion:** Continue from fresh `main`. V1 was never finished; this V2 job correctly hits the entitlement-contract gate before any fail-closed code.

---

## Phase 1 — Facts (read-only)

### A. Entitlement sources

| Product | Canonical key | How APP authorizes today | Server query today |
|---------|---------------|--------------------------|--------------------|
| Kompis Web | `website_kompis` | Fail-closed via `is_tenant_module_enabled` + nav `moduleKey` | **Yes** — `load-snapshot.ts` / menu loaders |
| Kompis Bedrift | Catalog key `kompis_bedrift` | **Membership-default-on** unless `bedriftModuleEnabled === false` | **No** — loaders never pass `bedriftModuleEnabled`, never query `kompis_bedrift` |

Code anchors:

- `lib/core/access-control-plane/resolve-snapshot.ts` — `mapBedriftProduct` comment: *“No dedicated tenant_modules row yet… Membership-gated until a dedicated Bedrift tenant_modules key is authoritative.”*
- `lib/core/access-control-plane/load-snapshot.ts` — queries **only** `website_kompis`
- `lib/app-portal/nav-config.ts` — `KOMPIS_WEB_FLAT_NAV` has `moduleKey: "website_kompis"`; `KOMPIS_BEDRIFT_FLAT_NAV` has **no** `moduleKey`
- `lib/core/app-menu-capability/resolve.ts` — `FAIL_CLOSED_SAFE_CAPABILITY_IDS` still includes Bedrift dashboard/employees/settings

### B. pathDenied / UI exposure

| Surface | Status |
|---------|--------|
| `authorizeProductContext()` computes `pathDenied` | **Yes** (`product-context.ts`) |
| `app/app/layout.tsx` honors redirect/403 on `pathDenied` | **No** — still unused (documented in #189) |
| Product switcher / Bedrift routes | Visible whenever membership + license plane authorizes Bedrift (default) |
| `/api/employee-knowledge*` | Auth user → RPC only — **no** product entitlement check (`app/api/employee-knowledge/route.ts`) |

### C. UnoNight license facts (aggregates — no secrets/PII)

| Fact | Value |
|------|-------|
| Customer / org id | `32d748eb-9a66-4174-a416-18a813610d3e` (slug `unonight`) |
| Company id | `7126b75f-0cd9-4727-ab89-e7970df9a163` |
| `tenant_modules.website_kompis` | **enabled** |
| `tenant_modules.kompis_bedrift` | **absent** (0 rows) |
| `tenant_modules.employee_knowledge` (+ gaps) | **enabled** — **not** wired as product switcher truth |
| Visible Bedrift UI without `kompis_bedrift` | **Expected under current membership-default** — not proof of Bedrift license |

### D. Platform-wide module inventory (Core)

| Module key | Enabled tenants |
|------------|-----------------|
| `website_kompis` | **1** |
| `employee_knowledge` | **1** |
| `kompis_bedrift` | **0** |

**Zero** tenants currently have an authoritative `kompis_bedrift` row. A sudden fail-closed on that key would deny Bedrift for **all** current APP members who rely on membership-default — including any dual-use orgs — unless a license migration/fallback is approved first.

### E. Web FAQ vs employee knowledge

| Store | Relationship |
|-------|----------------|
| Public companion FAQ (`tenant_public_companion_faq_items`) | Web / Website Kompis |
| Employee knowledge items | Bedrift / EKE — separate tables/RPCs |
| Zero EKE articles | **Not** evidence of lost Web FAQ |

Migrations 382 (FAQ install isolation) and 383 (EKE VOLATILE) remain applied; not touched.

### F. Compatibility risk

Job forbids abrupt global membership→Bedrift deny without documented migration/fallback. Current Core state (**0** `kompis_bedrift` entitlements) means fail-closed without prior grant/backfill **would lock out Bedrift for every existing tenant** that only has membership-default access.

Using `employee_knowledge` as a silent alias for Bedrift is a **new commercial mapping** (audit: UNKNOWN intent) and would **keep UnoNight on Bedrift** — defeating Web-only test policy without a separate license change (also forbidden here).

---

## Phase 2 — Implementation decision

| Gate (job §2.5) | Triggered? |
|-----------------|------------|
| Unambiguous server-owned Bedrift entitlement already queried & authoritative? | **No** — key exists in catalog/comments only; **0** rows; loaders ignore it |
| Fix requires SQL / schema / RLS / real license assignment / broad migration? | **Yes** — to fail-closed safely without locking customers |
| Forbidden: simulate with membership-as-Bedrift | Would leave hole open |
| Forbidden: UnoNight-specific patch / license mutation / new test org | Out of scope |

**STOP — no code LIVE from this continuation.** Half-secure pathDenied-only or membership-preserving “gates” would not meet the product separation contract.

---

## Owner decisions required (sequenced)

1. **Authoritative Bedrift product key** — confirm `kompis_bedrift` (vs alias to `employee_knowledge` / other).  
2. **License migration / fallback policy** — inventory + grant/backfill for tenants that must keep Bedrift before fail-closed; staged rollout plan.  
3. **Separate SQL/license job** (owner-approved) — insert/enable `tenant_modules` (or Platform entitlement path) for entitled tenants; **no** silent Production UPDATEs without that job.  
4. **Then** authorize an APP/Core **gate implementation** job to:  
   - Query `is_tenant_module_enabled(..., 'kompis_bedrift')` into `bedriftModuleEnabled`  
   - Add `moduleKey: "kompis_bedrift"` on Bedrift nav  
   - Gate `/api/employee-knowledge*` + Bedrift pages server-side  
   - Honor `pathDenied` with redirect/denied UX (all active locales)  
   - Remove Bedrift from `FAIL_CLOSED_SAFE_CAPABILITY_IDS` (or gate it)  
5. **Later:** separate Bedrift test org (`admin@aipify.tech`) — **not** this job.  
6. Keep UnoNight as **Web-only** reference after gates; do not convert UnoNight to Bedrift.

---

## Test matrix (this job)

| Scenario | Status |
|----------|--------|
| Web-only / Bedrift-only / dual / none / unauthenticated | **NOT RUN** as E2E — no gate code shipped |
| Direct URL / hidden nav / API without product | Documented as **open hole** (audit still accurate) |
| UnoNight Web install/FAQ chain | **Read-only confirmed** — migrations 382/383 applied; frozen 46/46 |
| Authenticated APP UI | **NOT RUN** — no owner session |
| Typecheck / lint / build of new code | **N/A** — no implementation diff |
| Locale coverage for new denied UX | **N/A** — no new strings |

---

## Absolute boundaries observed

| Boundary | Status |
|----------|--------|
| SQL / migrations / RLS | **0** |
| License / permission Production writes | **0** |
| New test customer / invites | **0** |
| Frozen WK chain | **0** diff |
| Spanish #191 reopen | **0** |
| UnoNight hardcoding | **0** |

---

## Verdict

**BLOCKED** at the documented entitlement-contract / license-migration approval gate.

Prior V1 implementation was never delivered (audits #188/#189 only). Continuation V2 re-verified the hole on current `main` (`e8c34bef`) and Core: Bedrift remains membership-default; `kompis_bedrift` is not an active server entitlement (**0** tenants); `pathDenied` is still unenforced; EKE APIs remain ungated by product. Safe fail-closed requires an owner-approved license migration/fallback **before** APP/Core enforcement code can ship LIVE.
