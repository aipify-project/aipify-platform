# AIPIFY — Public AI Cost SQL Review 05 RESULT

**Oppgave-ID:** `AIPIFY.KOMPIS.PUBLIC.COST.SQL.REVIEW.05`  
**Date:** 2026-10-14 (re-verified; original job dated 2026-10-10)  
**Job text:** `AIPIFY_KOMPIS_PUBLIC_AI_COST_SQL_REVIEW_2026_10_10.text`  
**Status:** **REVIEW COMPLETE — THIS JOB DID NOT APPLY**  
**Recommended apply object:** **V2** (not V1)

---

## Scorecard

| Control | Status |
|---------|--------|
| V1 file SHA matches reported | **PASS** |
| V1 original preserved (unchanged) | **PASS** |
| Isolated Docker Postgres contracts | **PASS** (V2 all green; V1 fails 3 gates) |
| Role EXECUTE deny anon/authenticated | **PASS** |
| Rate race no overshoot (60) | **PASS** |
| #98 / TS adapter param contract | **PASS** |
| Production / staging apply | **NOT RUN** (forbidden) |
| Provider / billing / #96 / index | **NOT RUN** (forbidden) |
| Fresh merge/deploy in this job | **NOT RUN** (forbidden) |

---

## 1. Exact files / SHA

| Version | Path | Bytes | SHA-256 |
|---------|------|-------|---------|
| **V1 (original approval object)** | `/Users/veltrix/Downloads/AIPIFY_KOMPIS_PUBLIC_AI_COST_CONTROLS_V1_PROPOSAL.sql` | 7686 | `1cc93f0f2836284e775d45f041466e7437058f5b56400961adfe5afce8247029` |
| **V2 (review / recommended apply)** | `/Users/veltrix/Downloads/AIPIFY_KOMPIS_PUBLIC_AI_COST_CONTROLS_V1_REVIEW_v2.sql` | 9517 | `b4319e34cc804e14358b765a1def549b198c982f932f87e1d6e83629494937d6` |
| Repo copy of V2 bytes | `supabase/migrations/20261937700000_website_kompis_public_ai_cost_controls_v1.sql` | 9517 | **identical to V2** |

Reported V1 SHA in job text: **match**.

### V2 delta vs V1

1. Idempotent replay of finalized/non-reserved → `allowed=false` (`already_finalized`) — must not re-authorize paid call.  
2. Idempotent replay requires matching `install_id` + `domain` — else `binding_mismatch`.  
3. Finalize meters into reservation `created_at` hour window (not `now()`), ensuring window row exists.  
Intentionally unchanged: `reserved_count` not decremented on release/error (rate slot consumed).

---

## 2. Object catalog (V1 and V2 — same shapes)

**Tables**

- `website_kompis_public_ai_reservations` — PK `id`; tenant/install/domain; optional idempotency; status check; units; RLS ON; `REVOKE` public/anon/authenticated; `GRANT ALL` service_role; unique `(tenant_id, idempotency_key)` where key not null.  
- `website_kompis_public_ai_budget_windows` — PK `(tenant_id, window_start)`; `reserved_count` / `call_count` / `token_units`; same RLS/grants.

**Functions** (`SECURITY DEFINER`, `search_path=public`)

- `reserve_website_kompis_public_ai_call(uuid, text, uuid, text, text) → jsonb`  
- `finalize_website_kompis_public_ai_call(uuid, uuid, uuid, text, text, int, int, int, int) → jsonb`  
- `EXECUTE`: **service_role only**

Default rate: **60** reserves / calendar hour / tenant (`date_trunc('hour', now())`).

### TypeScript adapter (`lib/marketing/website-kompis-public-ai-cost-controls.ts`)

| RPC | Params used |
|-----|-------------|
| reserve | `p_install_id`, `p_domain`, `p_tenant_id`, `p_idempotency_key`, `p_model_profile` |
| finalize | `p_reservation_id`, `p_tenant_id`, `p_install_id`, `p_result`, `p_safe_error_code`, units, `p_latency_ms` |

Tenant/install/domain come from `resolveWebsiteKompisPublicInstallDomainTrust` after visitor context — **not** from client body. Public ask hardcodes post-reserve `costControls: "off"` so APP `auth.uid()` metering is not used for anonymous embed. Fail-closed when RPC missing.

---

## 3. Isolated Postgres evidence (this run)

| Item | Value |
|------|-------|
| Engine | Docker `postgres:17.6` container `aipify-public-ai-cost-review-05` (removed after tests) |
| DBs | `cost_review_v1` / `cost_review_v2` |
| Tests | `docs/proposals/rehearsal/public-ai-cost-review-05-contract-tests.sql` |
| Logs | `docs/proposals/rehearsal/public-ai-cost-review-05-v1.out.txt` · `…-v2.out.txt` |

### V1 (`1cc93f0f…`) — **not apply-ready**

| Test | Result |
|------|--------|
| anon / authenticated EXECUTE denied | PASS |
| happy reserve + finalize once | PASS |
| sequential 60 + 5 deny | PASS |
| race at 59 → 1 allow / 3 deny / reserved=60 | PASS |
| release does not free rate slot | PASS |
| **idem after finalize → no re-auth** | **FAIL** (`allowed=true`, `idempotent_replay`) |
| **binding mismatch on same key** | **FAIL** (`allowed=true`) |
| **schema_is_v2_semantics** | **FAIL** |
| Exit | `CONTRACT_FAILURES=3` |

### V2 (`b4319e34…`) — **PASS**

All 12 contracts green including `already_finalized`, `binding_mismatch`, race, roles. Final: **`ALL_CONTRACT_TESTS_PASSED`**.

---

## 4. Rate vs cost / upper exposure

| Layer | What it enforces |
|-------|------------------|
| SQL | Call-rate only (`reserved_count ≤ 60` / hour / tenant) |
| SQL | Does **not** deny on token/\$ budget (`token_units` accumulated, unused for deny) |
| Code profile `kompis_result_summary_v1` | `gpt-4.1-mini` · `maxInput` 2000 · `maxOutput` 800 · grounded cap `min(600, maxOutput)` · `timeoutMs` 8000 · `retry` 0 → **1 attempt** |
| Public path | Fail-closed without public RPC |

Illustrative ceiling (assumptions, not a guaranteed \$ cap):  
≤ 60 calls/hour/tenant × (~2000 in + ≤600 out tokens) ≈ ≤ ~156k tokens/hour/tenant under these caps. Actual \$ depends on OpenAI pricing and prompt size.

---

## 5. Security notes

- service_role-only EXECUTE/table grants; RLS on; DEFINER + fixed `search_path`.  
- RPC trusts `p_tenant_id` from caller — safe **only** because server adapter resolves trust before service_role call. SQL does not join install↔tenant Core tables.  
- Ask path may omit `idempotencyKey` today → each ask can create a new reservation; V2 guards still required for retries/future keys.  
- Credit refill noted in job (2026-10-10 ~20:26) — **no provider attempts** in this review. Vercel `OPENAI_API_KEY` present (value not read).

---

## 6. Owner approval proposal — **not executed by this job**

### A) Schema apply (exact object)

> I authorize Production **APPLY** of task **AIPIFY.KOMPIS.PUBLIC.COST.SQL.REVIEW.05** using exactly  
> `AIPIFY_KOMPIS_PUBLIC_AI_COST_CONTROLS_V1_REVIEW_v2.sql`,  
> SHA-256 `b4319e34cc804e14358b765a1def549b198c982f932f87e1d6e83629494937d6`,  
> 9517 bytes, on Aipify Core `qbcqoixhrvhnuwphefvw`.  
> This does **not** authorize V1 (`1cc93f0f…`), provider QA, index-ingest, or #96 merge.

**Do not apply V1.**

Preflight: confirm functions/tables; ledger strategy `20261937700000`.  
Rollback if needed before usage: replace functions with deny-all — **do not DROP** reservation history.  
Post-apply: anon deny probe + service_role reserve/finalize on synthetic testtenant only.

### Observational Core status (read-only; not an apply)

Core `qbcqoixhrvhnuwphefvw` already exposes V2 guards (`already_finalized` / `binding_mismatch` in `reserve_website_kompis_public_ai_call`). Repo migration bytes match V2. A future APPLY job should **re-hash and confirm drift** before any rewrite; this review job performed **zero** Production writes.

### B) Bounded QA-writes (separate approval)

Preview sharing Production DB ⇒ Preview ask = Production metering write. Prefer isolated testtenant. First smoke ≤ 3 provider attempts / 120 s after schema+credit. Full 20-Q model QA only after smoke green. Not authorized here.

---

## 7. #98 / remaining gates (current HEAD)

| Item | Current (2026-10-14) |
|------|----------------------|
| Job baseline | #98 OPEN @ `6f68cd14` |
| Actual | #98 **MERGED** 2026-10-10 · merge `9fd7ef2c` · head `6e710a1a` · ancestor of `main` `6238c843` |
| This job | No merge/deploy; SQL review only |
| Model QA | Separate (credit confirmed in job text; still needs bounded smoke authorization) |
| #96 / index ingest | Out of scope |
| Migration 376 | Untouched / not reapplied |

---

## 8. Confirmations

- No Production/staging SQL apply in this job  
- No provider attempts  
- No secret/billing/env changes  
- No #96 merge / index-enable  
- V1 file in Downloads unchanged  
- Isolated Docker only for contract proof  

**Conclusion:** V1 is **not** apply-ready. V2 is locally proven for roles, rate race, idempotency, and finalize semantics. Owner apply authorization must name **V2** + SHA `b4319e34…` (or confirm Core already matches and skip rewrite).
