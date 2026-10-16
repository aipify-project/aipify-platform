# AIPIFY CORE – SUPER PORTAL DASHBOARD RPC – MIGRATION PREPARATION V1 — RESULT

**STATUS: PASS PREPARATION**

**NO SQL APPLIED; NO PR MERGED; NO PRODUCTION CHANGE**

**Date:** 2026-10-16  
**Base:** `origin/main` `e21d3f1ad1efafd548f278c9ffa7454d4b8dbda7`  
**Worktree:** `/Users/veltrix/Development/aipify-core-super-portal-dashboard-rpc-migration-prep-v1`  
**Branch:** `feat/core-super-portal-dashboard-rpc-migration-prep-v1`  
**Out of scope (untouched):** PR #249/#250, Website Kompis, UnoNight, partner email, group archive, J4

---

## 1) Root-cause confirmation

| Item | Status |
|---|---|
| Classification | **Unapplied canonical RPC** (repo Phase 257 exists; Production Core catalog gap) |
| Production Core | `qbcqoixhrvhnuwphefvw` (Aipify Core) — **confirmed** |
| `get_super_portal_dashboard()` | **ABSENT** (`to_regprocedure` NULL) |
| `get_platform_portal_dashboard()` | PRESENT (other cards) |
| Migration history | `schema_migrations`: `20261521…` then `20261534…` — repo `20261529`–`20261531` not recorded |
| App contract | `GET /api/super-portal/dashboard` → `rpc("get_super_portal_dashboard")` → `parseSuperPortalDashboard` |

Not wrong signature / wrong schema name: function is missing entirely.

---

## 2) Dependency matrix

| Dependency | Production | Proposal handling |
|---|---|---|
| `_super_admin_require_super_admin()` | **CONFIRMED** present (security definer, `search_path=public`; checks `is_platform_admin` + `role=super_admin`) | Wrapped by `_spsf257_require_super_admin` |
| `companies` (`is_platform`, `created_at`) | **CONFIRMED** | Count aggregates |
| `users` | **CONFIRMED** | Count |
| `subscriptions` (`status`, `created_at`) | **CONFIRMED** | Count active/trialing |
| `platform_admins` (`role`, `status`) | **CONFIRMED** (incl. `status`/`suspended_at`/`updated_at`) | Count active `platform_support` |
| `platform_health_incidents` / `alerts` | **ABSENT** | Soft via `to_regclass` (zeros / empty alerts) |
| `_phoc256_build_services()` | **ABSENT** | Soft via `pg_proc` check → default `operational_services=8` |
| Full gap migrations `20261522`–`20261533` | **NOT REQUIRED** for this card | Explicitly **out of** this minimal file |
| MFA / recovery | App gate only | Unchanged; Core rechecks role |

---

## 3) Named SQL artifact + SHA256

| File | Role | SHA-256 |
|---|---|---|
| `docs/platform/NOT_APPLIED_core_super_portal_dashboard_rpc_v1.sql` | Executable draft (helpers + dashboard RPC + grants) | `e950a501dd1992426ce45078e657358d987876e6242012b6268e10b0ebbd4765` |
| `docs/platform/NOT_APPLIED_core_super_portal_dashboard_rpc_v1_VERIFY.sql` | Read-only before/after checks | `21cdcca2cf4d4f5e2601f0259d7ccde1206b27f581822b76d31551537688897c` |

Canonical body = Phase 257 health-indicators shape from `20261531000000_…sql` (not the older return without `platform_health_indicators`).

---

## 4) Expected return contract (JSON keys)

Matches `lib/super-portal/parse.ts` / `SuperPortalDashboard`:

- Top: `principle`, `total_organizations`, `total_active_users`, `total_active_subscriptions`, `platform_administrator_count`, `global_platform_status`, `open_critical_incidents`, `growth_trends[]` (`key`,`label`,`value_pct`), `executive_alerts[]` (`id`,`title`,`severity`,`category`,`created_at`), `platform_uptime_pct`, `platform_health_indicators`, `privacy_note`
- Health: `uptime_pct`, `global_status`, `open_critical_incidents`, `operational_services`, `degraded_services`, `maintenance_services`, `incident_services`

Konsernoversikt UI maps via `toPlatformSuperAdminInsightView` (subset of aggregates).

---

## 5) Route / security checklist

| Control | Status |
|---|---|
| App: `super_admin` + MFA + recovery fail-closed | Unchanged (`evaluateSuperPortalDashboardAccess`) |
| App: RPC errors → opaque 403 + `private, no-store` | Unchanged |
| Core: `_spsf257_require_super_admin` → `_super_admin_require_super_admin` | In proposed SQL |
| SECURITY DEFINER + fixed `search_path = public` | Same as reviewed Phase 257 design |
| `GRANT EXECUTE` to `authenticated` only on public RPC | Yes; `REVOKE` from `public`/`anon` |
| Helpers not granted to `authenticated`/`anon`/`public` | Yes |
| No `anon` / PUBLIC execute on dashboard | Yes |
| No new tables, seeds, mutations, RLS bypass | Yes |
| Aggregates only — no email/chat/order content | Yes (`privacy_note` in payload) |
| Secrets in artifacts | None |

---

## 6) Rollback / containment (not executed)

After a future apply:

1. `drop function if exists public.get_super_portal_dashboard();`
2. `drop function if exists public._spsf257_platform_status();`
3. `drop function if exists public._spsf257_require_super_admin();`

Implication: Konsernoversikt returns to current fail mode (RPC missing → app 403). No data rows written by this RPC file; drop is non-destructive to customer tables.

---

## 7) Future apply gates (separate owner jobs)

### Staging (if used)

> I approve Staging apply of `docs/platform/NOT_APPLIED_core_super_portal_dashboard_rpc_v1.sql` with SHA-256 `e950a501dd1992426ce45078e657358d987876e6242012b6268e10b0ebbd4765` on the named Staging Core project only. No Production. No MFA/gate changes.

Then: run VERIFY.sql; negative non–super_admin reject; Super Admin HTTP 200 smoke.

### Production

> I approve Production apply of `docs/platform/NOT_APPLIED_core_super_portal_dashboard_rpc_v1.sql` with SHA-256 `e950a501dd1992426ce45078e657358d987876e6242012b6268e10b0ebbd4765` on Aipify Core `qbcqoixhrvhnuwphefvw` only. No other SQL. No app gate weakening.

Then: VERIFY.sql; authenticated Network `GET /api/super-portal/dashboard` → **200** + `private, no-store`; Konsernoversikt metrics render.

---

## 8) Tests / NOT RUN

| Check | Result |
|---|---|
| `npx tsx lib/super-portal/core-super-portal-dashboard-rpc-prep.contract.test.ts` | **PASS** (SQL keys, grants, parse + insight view fixture) |
| Production catalog RO | **PASS** (MCP `execute_sql` metadata only) |
| Disposable Postgres dry-run | **NOT RUN** (no local `psql`; Docker full-schema stub deferred) |
| `dashboard-route-rbac.test.ts` | **NOT RUN** (fresh worktree lacks `node_modules` / `@/` resolve) |
| Staging/Production apply | **NOT RUN** (forbidden this job) |
| Authenticated Production 200 | **NOT RUN** |

---

## 9) Changed files (prep branch only)

1. `docs/platform/NOT_APPLIED_core_super_portal_dashboard_rpc_v1.sql`  
2. `docs/platform/NOT_APPLIED_core_super_portal_dashboard_rpc_v1_VERIFY.sql`  
3. `lib/super-portal/core-super-portal-dashboard-rpc-prep.contract.test.ts`  
4. `AIPIFY_CORE_SUPER_PORTAL_DASHBOARD_RPC_MIGRATION_PREPARATION_V1_RESULT.md`

**NO SQL APPLIED; NO PR MERGED; NO PRODUCTION CHANGE.**

## Neste konkrete gate

Owner-named **Staging** (optional) then **Production** apply job citing the SQL path + SHA-256 above.

END OF RESULT.
