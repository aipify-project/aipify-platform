# Support Center Staging SQL — STOP REPORT (no apply)

**Date:** 2026-11-26  
**Decision received:** Owner Staging APPLY YES for two named files only  
**Target:** `aipify-core-staging` (`auedugihkduoaikfusqe`) only  
**Result:** **STOPPED BEFORE APPLY** — prerequisite schema missing on Staging

---

## Preflight (passed)

| Check | Result |
|-------|--------|
| Repo | `aipify-project/aipify-platform` |
| Worktree | `/Users/veltrix/Development/aipify-platform-support-center-v1-20261126b` |
| Branch / HEAD | `feat/platform-support-center-v1-20261126b` @ `23bafc5fa` |
| Project | `aipify-core-staging` / `auedugihkduoaikfusqe` / ACTIVE_HEALTHY |
| File 1 SHA-256 | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` **MATCH** |
| File 2 SHA-256 | `96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95` **MATCH** |
| Standalone schema file | **Not applied** (intentionally; covered by Staging batch) |
| Prior Support Center migrations on Staging | **None** (no matching `schema_migrations` rows) |

Approved files were **not** executed (0/2).

---

## Deviation that forced STOP

Staging has only **35** `public` tables (mostly CSP + thin platform stubs). Required dependencies for the approved SQL are **absent**:

| Required object | Staging | Production Core (`qbcqoixhrvhnuwphefvw`) |
|-----------------|---------|------------------------------------------|
| `public.app_portal_support_requests` | **MISSING** | present |
| `public.app_portal_support_request_audit_logs` | **MISSING** | present |
| `public.companies` | **MISSING** | present |
| `public._ppsf258_require_platform_access()` | **MISSING** | present |
| `list_platform_app_portal_support_requests` (etc.) | absent (expected pre-apply) | n/a |
| `platform_support_*` tables | absent (expected pre-apply) | n/a |

Present on Staging (context only): `platform_admins`, CSP sales-email CRM tables, customers/organizations/installations. **CRM was not touched.**

Applying File 1 or File 2 now would fail (FK / missing function references) or create an incomplete, unsafe state. Per instruction **«Ved avvik: stopp uten automatisk ny kjøring»** — no retry, no partial apply, no Production.

---

## What was NOT done

- No Staging SQL apply of either approved file  
- No Production SQL  
- No DNS / secrets / email activation  
- No Sales Email CRM changes  
- No test data created (nothing to clean)

---

## Next required owner approval gate

Staging cannot host Support Center Core until the **APP ticket SoT + Platform access foundation** exists there.

### Proposed next gate (needs NEW exact owner YES)

Phase 271 also requires `public.companies` and `public.users` (FK targets). Staging currently has neither companies foundation nor Platform access RPC. Do **not** blindly apply historical migrations without a named dependency inventory.

**Known required pieces (hashes verified in this worktree):**

| Piece | File | FULL SHA-256 |
|-------|------|--------------|
| Platform access helper | `supabase/migrations/20261532000000_platform_portal_structure_foundation_phase258.sql` | `b8876e445f380f5364f1286927c60310b1fc4dba4014291e672a59bc91efde78` |
| APP ticket SoT | `supabase/migrations/20261540000000_app_portal_support_request_center_phase271.sql` | `21b754f31654c31980a93aabc5d2e10226904bdcf5a52275f51d9e3f5f8a13cd` |
| Channel/status extensions | `supabase/migrations/20261862700000_phase620_app_support_history.sql` | `880a49df36712dbf9e6d7be34b57c46d2991764b612001b30d72c8d06cada986` |

**Still needed before those can succeed:** `public.companies` + `public.users` (origin migration(s) to be listed with full SHA in the next owner decision pack — starting candidate `20260610150000_multi_tenant_foundation.sql`, must be dependency-checked first).

**After** foundation + P1–P3 succeed on Staging, issue a **fresh** APPLY YES for the original two Support Center files (same SHAs). Do not treat this STOP as automatic continuation of the previous approval.

### Alternative

Stand up / restore a Staging database that already mirrors Production Core schema for APP + Platform portal, then re-run the two approved Support Center files once.

---

## FINAL_STATUS

**STAGING_APPLY_BLOCKED_MISSING_PREREQUISITES**  
Approved Support Center SQL remains **NOT_RUN**.  
Next gate: owner approval for prerequisite foundation on Staging (P0–P3 or equivalent restore), then a new APPLY YES for the two Support Center files.
