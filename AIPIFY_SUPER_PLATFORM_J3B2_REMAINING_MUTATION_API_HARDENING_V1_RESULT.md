# AIPIFY_SUPER_PLATFORM_J3B2_REMAINING_MUTATION_API_HARDENING_V1 — RESULT

**Status:** **PARTIAL** — inventory + smallest coherent hardening + synthetic gates **PASS**; PR opened; **NOT MERGED / NOT LIVE**

**Date:** 2026-10-16  
**Baseline `origin/main`:** `e01d2efd9227455b70b266879b6e44095983dcfd` (#248 LIVE)  
**Branch:** `feat/super-platform-j3b2-remaining-mutation-api-hardening-v1`  
**Feature HEAD:** *(set after commit — see PR)*  
**PR:** *(URL after open)*

---

## Inventory (read-only, actual routes on main)

| Surface | Path | Methods | Side effects | Proxy MFA inventory | Prior route-local MFA gate |
|---|---|---|---|---|---|
| Module registry | `/api/super-admin/module-registry` | GET, **POST** | POST → `perform_super_admin_module_registry_action` | Not privileged (not in prefixes; not excluded) | **Missing** → **this PR** |
| Partner communications | `/api/super/partner-communications` | GET | GET may `processPartnerCommunicationOutbox` | Not privileged | Missing |
| Partner templates | `/api/super/partner-communications/templates` | PATCH, **POST** | Template update; **test email** queue + outbox | Not privileged | Missing |
| Partner logs | `/api/super/partner-communications/logs` | GET, **POST** | POST `process` / **`resend`** + outbox | Not privileged | Missing |
| Group entity actions | `/api/group-organization/entities/actions` | **POST** | `group_business_entity_action` incl. **archive** | Not privileged | Missing |
| Super-admin control center | `/api/super-admin/control-center` | GET | Aggregates | Not privileged | Missing |
| Super-admin audit | `/api/super-admin/audit` | POST | `record_super_admin_audit_event` | Not privileged | Missing |
| Super-admin navigation / role matrix | `/api/super-admin/navigation`, `…/role-permission-matrix` | GET | Read | Not privileged | Missing |
| Super-portal (J1–J3B1) | dashboard, global-audit, role-permission-matrix, executive-insights, language, platform-admins | GET/(POST) | Already gated LIVE | Explicitly **excluded** from proxy | Present |

**Risk rank (P0 mutations):** (1) module-registry POST → (2) partner email test/resend/outbox → (3) group entity archive (+ other entity actions) → (4) remaining `/api/super-admin/*` reads/audit.

---

## Scope chosen for this PR (smallest coherent slice)

| Route | Methods hardened |
|---|---|
| `/api/super-admin/module-registry` | **GET + POST** |

**Why this slice:** Single file, clear Super Admin UI caller (`SuperAdminModuleRegistryPanel`), mutating RPC with catalog impact, no email/outbox/archive side effects in tests, same gate pattern as J3B1 without mixed domains.

**Pattern:** `evaluateSuperPortalDashboardAccess` (super_admin + MFA + recovery ≥1) **before** body parse / RPC; `dynamic = "force-dynamic"`; all allow/deny/error use `NO_STORE_HEADERS` (`private, no-store`); deny bodies generic (no modules/stats/found). Core RPC remains defense-in-depth.

**UI note:** Clients without completed MFA/recovery will now receive `403` (`mfa_required` / `recovery_required`) instead of reaching the registry RPC — same policy as Super portal surfaces.

**Not changed:** partner email, group archive, other `/api/super-admin/*`, proxy exclusion list, SQL/RLS/migrations, secrets, #238, Website Kompis frozen files, J4.

---

## Before → after

| Concern | Before | After (this PR) |
|---|---|---|
| Route-local super_admin + MFA + recovery | Session user only | Full Super portal gate |
| POST body / mutation before auth | Body then user check | Gate → body → RPC |
| Cache-Control | Default on many paths | `private, no-store` all statuses |
| Registry leak on deny | Possible via RPC path | Gate denies before RPC |

---

## Synthetic deny/allow matrix

`lib/super-admin/module-registry-fail-closed.test.ts` — **PASS** (no Production login/writes).

| Case | Gate | Body parse on deny? | Privileged RPC before pass? | Registry leak? | Cache |
|---|---|---|---|---|---|
| anonymous | deny | no | no | no | private, no-store |
| no platform profile | deny | no | no | no | private, no-store |
| platform_support | deny | no | no | no | private, no-store |
| suspended super_admin | deny | no | no | no | private, no-store |
| MFA enrollment / incomplete | deny | no | no | no | private, no-store |
| no recovery | deny | no | no | no | private, no-store |
| authorized happy path | allow | POST yes after gate | yes after gate | n/a | private, no-store |
| Core RPC error after gate | 403/400 | after gate | yes | GET generic | private, no-store |

**Regression PASS:** `super-portal-remaining-fail-closed`, `global-audit-access`, `role-access-access`, `dashboard-route-rbac`.  
**tsc:** `0`.  
**AGENT AUTHENTICATED SMOKE:** **NOT RUN**.

---

## Named follow-up jobs (do not start here)

| Job ID (proposed) | Scope |
|---|---|
| **J3B2b** / J3B3 | `/api/super/partner-communications*` — test/resend/outbox; mocks only; no live send |
| **J3B2c** / J3B4 | `POST /api/group-organization/entities/actions` (archive + other mutations); no real archive |
| **J3B2d** | Remaining `/api/super-admin/*` (control-center, audit, navigation, role-permission-matrix) |
| **J4** | Module catalog / Platform alignment — **after** J3B2 mutation risks assessed |

---

## Release policy

**HOLD MERGE / NOT LIVE.** Privileged mutating Super Admin API — requires **new explicit owner approval** on exact PR + HEAD. Prior #248 auth-smoke exception does **not** apply.

END OF RESULT.
