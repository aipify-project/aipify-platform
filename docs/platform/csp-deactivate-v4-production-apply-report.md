# CSP Deactivate Attribution Link V4 — Production Apply Report

**Goal status:** `CSP_DEACTIVATE_V4_PRODUCTION_APPLIED_VERIFIED`  
**Date:** 2026-11-26  
**Staging evidence:** `CSP_SELLERPANEL_V5_STAGING_VERIFIED_PRODUCTION_READY` (28/28)

---

## Apply

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/csp_deactivate_attribution_link_v4.sql` |
| SHA256 verified | `b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3` |
| Project | `qbcqoixhrvhnuwphefvw` (Aipify Core Production) |
| Preflight | `deactivate_already_present=false`; `_csp_audit` + create-link present |
| Apply | `apply_migration` name `csp_deactivate_attribution_link_v4` → **success** |
| Migration recorded | `supabase_migrations.schema_migrations` version `20261126030832` |

## Post-verify

| Check | Result |
|-------|--------|
| `csp_deactivate_attribution_link(text)` | present |
| `SECURITY DEFINER` | true |
| `authenticated` EXECUTE | yes |
| `anon` EXECUTE | 0 |
| Links total / active | 1 / 1 (unchanged vs preflight) |
| Click events | 0 (unchanged) |
| Qualified sales | 0 (unchanged) |
| Commission ledger | 0 (unchanged) |
| Partners | 2 (unchanged) |
| Real seller link deactivated | **No** — gentle probes only |

Existing Production link remaining active: code `csp-5218ee2208af` (`active=true`).

## Unchanged surfaces

- Kompis Core / Public Chain / Academy / Stripe / APP: no code or SQL changes in this job  
- Repo working tree clean on `main` @ `4faa1dbe3` (docs from prior V5 merge only)

## Remaining blocks (not claimed done)

1. **Public click / attribution capture RPC** still missing — do **not** declare full deactivate→block-new-attribution chain complete until capture is implemented and verified to honor `active=false`.
2. Stripe TEST / LIVE payment funnel: out of scope for this SQL apply.
3. Authenticated partner UI deactivate against a disposable Production test partner: not run here (no real-link deactivation).

## Scope note

Only this SQL candidate was applied. No other migrations, secrets, payment changes, or destructive operations.
