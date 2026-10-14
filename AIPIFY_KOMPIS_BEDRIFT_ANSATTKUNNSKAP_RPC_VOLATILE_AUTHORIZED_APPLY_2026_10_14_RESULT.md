# AIPIFY — KOMPIS BEDRIFT ANSATTKUNNSKAP RPC VOLATILE — AUTHORIZED APPLY RESULT

**Date:** 2026-10-14  
**Job:** `AIPIFY_KOMPIS_BEDRIFT_ANSATTKUNNSKAP_RPC_VOLATILE_AUTHORIZED_APPLY_2026_10_14`  
**UTC stamps** recorded per gate below.

| State flag | Value |
|------------|-------|
| SQL APPLIED | **YES — exactly 1 time** |
| API CHECKED (authenticated) | **NOT RUN** (no owner session) |
| AUTHENTICATED APP UI CHECKED | **NOT RUN** |
| FROZEN INTACT | **YES** (0 / 46) |
| FULLY VERIFIED / LIVE UI | **Not claimed** |

---

## Gates

| Gate | Status | UTC |
|------|--------|-----|
| Artifact SHA-256 exact match | **PASS** | 2026-10-14T07:01:52Z |
| SQL scope = only `ALTER … VOLATILE` | **PASS** | 2026-10-14T07:01:52Z |
| Project identity Aipify Core `qbcqoixhrvhnuwphefvw` | **PASS** | 2026-10-14T07:01:52Z |
| Ledger pre: 383 absent, 382 present | **PASS** | 2026-10-14T07:01:52Z |
| Live function zero-arg **STABLE** before apply | **PASS** | 2026-10-14T07:01:52Z |
| Docker isolated rehearsal (25006 → VOLATILE → write OK → ledger once) | **PASS** | 2026-10-14T07:03:xxZ |
| unonight-staging same RPC | **NOT RUN** (RPC absent on staging; Docker used instead) | — |
| Production APPLY once via `--file` | **PASS** | **2026-10-14T07:03:40Z** |
| Ledger post: 383 count=1, vol=`v` | **PASS** | post-apply |
| 382 intact | **PASS** | post-apply |
| Frozen Website Kompis 46 | **PASS** (0 mismatches) | post-apply |
| Authenticated `GET /api/employee-knowledge` | **NOT RUN** | — |
| Four Bedrift UI entries | **NOT RUN** | — |
| Public paid Kompis Web ask | **NOT RUN** (not authorized) | — |

---

## Artifact

| Item | Value |
|------|--------|
| File | `supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql` |
| Full SHA-256 | `505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81` |
| Authorized effect | `alter function public.get_customer_employee_knowledge_center() volatile;` |
| Project | Aipify Core — `qbcqoixhrvhnuwphefvw` |

---

## Docker / Staging rehearsal

- **Docker:** ephemeral `postgres:17-alpine` (no Production data/secrets).
- Baseline: center **STABLE**; `ensure_eke_settings` under `transaction_read_only` → SQLSTATE **25006**.
- Applied **exact unchanged** migration file bytes → `ALTER FUNCTION` → center **VOLATILE** (`v`).
- Read-write call of center returned `{"ok": true, …}`; row seeded.
- Ledger: 382 preserved; 383 inserted once; second insert → unique_violation (**idempotence PASS**).
- **Staging project `zowtcspnbgtdxrxyzhte`:** `get_customer_employee_knowledge_center` / `ensure_eke_settings` **absent** — not used for APPLY rehearsal.

---

## Production APPLY

| Item | Value |
|------|--------|
| Command | `npm run supabase:sql:apply -- --file supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql` |
| Times applied | **1** |
| Script output | `applied 20261938300000_employee_knowledge_center_rpc_volatile.sql` / `Done. 1 migration(s) processed.` |
| Other migrations in same command | **0** (`--file` only) |
| UnoNight DBs touched | **No** |

### Ledger / volatility after APPLY

| Check | Result |
|-------|--------|
| `20261938300000` count | **1** — name `employee_knowledge_center_rpc_volatile` |
| `20261938200000` count | **1** — name `website_kompis_visitor_faq_install_isolation_v1` |
| `get_customer_employee_knowledge_center` `provolatile` | **`v` (VOLATILE)** |
| `authenticated` EXECUTE | **true** (unchanged) |

**25006 status:** Root cause was PostgREST READ ONLY on STABLE RPC. Function is now VOLATILE → PostgREST uses READ WRITE for POST `/rpc`. Direct forced `transaction_read_only` INSERT would still 25006 by design; the production failure mode for the center GET path is addressed by volatility.

---

## APP / UI

| Check | Status | Evidence |
|-------|--------|----------|
| Unauthenticated API | **PASS** | `GET https://app.aipify.ai/api/employee-knowledge` → **401** `{"error":"Unauthorized"}` |
| Authenticated API | **NOT RUN** | No owner session in agent |
| Opprett FAQ | **NOT RUN** | Needs owner session |
| Kunnskapsartikler | **NOT RUN** | Needs owner session |
| Til godkjenning | **NOT RUN** | Needs owner session |
| Kunnskapshull / Ansattkunnskap | **NOT RUN** | Needs owner session |
| Tenant / ACL weakened | **No** | ALTER volatility only; table ACL still revoked |

---

## Frozen / scope

| Check | Result |
|-------|--------|
| Frozen 46 SHA mismatches | **0** |
| Migration 382 file SHA | `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e` (untouched) |
| Stripe / secrets / RLS edits | **None** |

---

## Repo / deployment

Recorded after this RESULT is committed with migration + evidence (see git/PR section completed in same job).

---

## Remaining owner actions

1. Log into APP as UnoNight owner → Kompis Bedrift → FAQ og kunnskap → open each of the four cards + Ansattkunnskap; confirm load without «Kunne ikke laste ansattkunnskap».
2. Confirm empty state vs real content as appropriate (not a fake PASS from SQL alone).

**Do not treat SQL APPLIED as UI LIVE verification.**
