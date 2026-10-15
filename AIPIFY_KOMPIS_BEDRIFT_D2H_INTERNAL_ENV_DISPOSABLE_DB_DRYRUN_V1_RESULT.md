# AIPIFY — KOMPIS BEDRIFT D2H — INTERNAL ENV EXECUTABLE SQL DISPOSABLE-DB DRY-RUN V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS** — disposable local dry-run **21/21 PASS**; SQL **READY FOR OWNER APPLY DECISION** |
| LIVE / Production apply | **NOT performed** — local green ≠ LIVE enforcement |
| Repo | `aipify-project/aipify-platform` |
| HEAD at dry-run | `161cdadb` (`origin/main`, PR #218 merge) |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2h-internal-env-disposable-db-dryrun-v1` |
| Branch | `feat/kompis-bedrift-d2h-internal-env-disposable-db-dryrun-v1` |

This RESULT is **not** owner approval to apply SQL to Staging/Production.

---

## 1. SQL under test

| Item | Value |
|---|---|
| Path | `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql` |
| Expected SHA-256 | `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b` |
| Actual SHA-256 | `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b` |
| Non-comment lines | 350 |
| Under `supabase/migrations/` | **No** |
| SQL rewritten this job | **No** (applied unchanged) |

---

## 2. Disposable database identity (no secrets)

| Property | Value |
|---|---|
| Engine | PostgreSQL 15 (Docker image `postgres:15-alpine`) |
| Container name | `aipify-d2h-disposable-pg` |
| Host bind | **`127.0.0.1:55432` → container 5432** (loopback only; not published on `0.0.0.0`) |
| Database name | `d2h_disposable` |
| Role used | local disposable role `d2h` (container-local; password not reported) |
| Linked Supabase project / Staging / Production | **Not used** (`supabase status` showed linked remote DB **exited**; dry-run used Docker only) |
| Env files with remote DB URLs | None used (no `.env.local` in worktree for this run) |
| Baseline type | **Stub fixture** `docs/platform/d2h_disposable_db_fixture_baseline_v1.sql` — minimal tables/helpers matching D2G dependencies; **not** a full 1146-migration Production replay |
| Commands (no secrets) | `docker run … -p 127.0.0.1:55432:5432 postgres:15-alpine` → `psql -v ON_ERROR_STOP=1 < fixture` → `< NOT_APPLIED sql` → `< test matrix` |
| Apply exit | Fixture **0**, D2G SQL **0**, matrix **0** |

---

## 3. Test matrix

| Test | Result | Detail / SQLSTATE |
|---|---|---|
| T01_rpc_arity_6 | **PASS** | single overload `pronargs=6` with `p_environment_type` |
| T02_helper_fail_closed | **PASS** | helper `select false` |
| T03_anon_denied | **PASS** | `P0001` Platform portal access denied |
| T04_production_default_support | **PASS** | `platform_support` create → `environment_type=production` |
| T05_support_internal_denied | **PASS** | `P0001` `INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED` |
| T06_super_helper_false_denied | **PASS** | `P0001` `INTERNAL_ENVIRONMENT_NOT_AUTHORIZED` |
| T07_invalid_env_rejected | **PASS** | `P0001` `INVALID_ENVIRONMENT_TYPE` (`staging`) |
| T08_duplicate_slug | **PASS** | `P0001` `DUPLICATE_SLUG` |
| T09_existing_tenant_unchanged | **PASS** | pre-seeded production fixture unchanged |
| T10_env_immutable | **PASS** | `P0001` `ENVIRONMENT_TYPE_IMMUTABLE` |
| T11_local_positive_internal_persist | **PASS** | **LOCAL FIXTURE ONLY** — helper temporarily `true` then restored; persists `internal` + audit `environment_type` |
| T11b_helper_restored_false | **PASS** | helper false again |
| T12_block_subscription | **PASS** | `P0001` `INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN` |
| T13_block_license | **PASS** | same |
| T14_block_org_domain | **PASS** | same |
| T15_block_customer_domain | **PASS** | same |
| T16_block_installation | **PASS** | same |
| T17_production_subscription_allowed | **PASS** | production customer can still get subscription |
| T18_revoke_public | **PASS** | `public` cannot execute create RPC |
| T19_security_definer_search_path | **PASS** | `SECURITY DEFINER` + `search_path=public` |
| T20_super_production_ok | **PASS** | regression production create after helper restore |
| Full Production schema replay (1146 migrations) | **NOT RUN** | disposable stub baseline used instead |
| Stripe / payment-provider objects | **NOT RUN** | outside SQL scope |
| Website CMS public publish paths | **NOT RUN** | outside trigger tables |
| Frozen Website Kompis | **PASS** | **46/46** |
| Platform flags flipped | **NOT RUN / unchanged** | `RPC_CONNECTED=false`, `INTERNAL_AUTHORIZED=false` |
| Step B stash | **PASS** | `step-b-wip-blocked-not-for-merge` preserved |
| Staging/Production SQL apply | **NOT RUN** | forbidden |

---

## 4. What the SQL now proves (disposable) vs still not enforced live

**Proven in disposable DB after applying this exact SHA:**

- Production default create compatibility
- `platform_support` cannot create `internal`
- `super_admin` cannot create `internal` while helper is false
- Invalid env / duplicate slug fail closed
- `environment_type` immutable after insert
- Internal blocks subscriptions, license links, org/customer domains, installations
- Audit records `environment_type` on create
- Grants / SECURITY DEFINER / search_path as authored

**Still not LIVE in Core Production/Staging:** SQL not applied there.

**Still outside this SQL even after a future Production apply:**

- Stripe / external billing provider customer objects
- Website CMS / public runtime publish beyond domain/install tables
- Platform RPC connect + execute flags
- Helper authorize flip / sandbox tenant create / admin invite / Bedrift

---

## 5. Consequences / rollback notes for a future Production apply

| Concern | Note |
|---|---|
| Existing tenants | Apply does not UPDATE existing `environment_type`; immutability trigger blocks later changes |
| Privileges | Drops 5-arg overload; adds 6-arg with default — callers omitting env keep working |
| Rollback | Restore prior 5-arg body from `20261934400000_…`; drop new triggers/helpers (see SQL footer / D2G APPLY_PLAN) |
| Forward repair | If Production schema differs from fixture stubs, apply may fail on missing relations — RO pre-check required |

**Caveat:** dry-run used a **dependency stub**, not full remote schema. Owner apply job should still run RO preflight (`pg_get_functiondef`, table existence) on the real target before apply.

---

## 6. Apply readiness

| Decision label | Value |
|---|---|
| Disposable dry-run | **PASS (21/21)** |
| SQL file integrity | **PASS** (SHA match) |
| **READY FOR OWNER APPLY DECISION** | **Yes** — exact file + SHA below |
| LIVE / already applied | **No** |

### Exact Production-apply decision packet (do not execute here)

**YES/NO:** Authorize a separate named job to apply **only**:

- File: `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql`
- SHA-256: `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b`

**Exclude from that YES:** sandbox create, admin invite, Bedrift, helper flip, Platform connect, legal acceptance, UnoNight, frozen WK, WordPress.org plugin work.

---

## 7. Artifacts added this job

- `docs/platform/d2h_disposable_db_fixture_baseline_v1.sql`
- `docs/platform/d2h_disposable_db_test_matrix_v1.sql`
- This RESULT

Disposable container `aipify-d2h-disposable-pg` is stopped/removed after RESULT packaging (local only; no remote residue).

---

## 8. Next single step

Owner **Production APPLY YES/NO** for the SHA above (or request a RO Production preflight-only job first). Do not combine with sandbox creation.
