# CSP Academy — Exact Staging Gate S apply order (PREPARED ONLY)

**Do not apply until the owner names each file + full SHA + Staging `auedugihkduoaikfusqe`.**

## Order (mandatory)

### 1) Security fix — FIRST
- Path: `docs/security-hardening/CSP_ACADEMY_ANSWER_KEY_ACCESS_FIX_PREPARED_ONLY_20261125.sql`
- SHA-256: `b609a5c4f6c80dffb204600a62c0e1fbd662b1f09fcf2507dbe2abd67f187388`
- Effect: retires `csp_get_academy_answer_key` (always `forbidden`); revokes EXECUTE from `public` / `anon` / `authenticated` / `service_role`
- Does **not** publish the course or seed questions

### 2) Readback (Staging)
- `has_function_privilege('authenticated','public.csp_get_academy_answer_key(uuid)','execute')` → false
- Same for `anon` and `service_role`
- Partner PostgREST call must be denied / unavailable
- Course remains `kompis_web_v1` **unpublished**, questions **0**

### 3) Academy bank + subset scoring + overview — SECOND (separate exact approval)
- Path: `docs/security-hardening/CSP_ACADEMY_BANK_SUBSET_SCORING_OVERVIEW_PREPARED_ONLY_20261125.sql`
- SHA-256 (unchanged original): `68da61e232fa64340ccbfffc2995bb33adf01683229306c96f615f5e8c095c67`
- Only after step 1 is verified on Staging
- Then seed 25 keys, subset scoring, publish `kompis_web_v1`, enrich overview

### 4) Production
- Repeat 1 → readback → 2 under a **separate** Production Gate P approval  
- Target: `qbcqoixhrvhnuwphefvw`

## App contract (PR #352)
- Exam submit scores with **server-only** `getAnswerKeyForQuestions` — never calls `csp_get_academy_answer_key`
- Core persistence via `csp_record_academy_attempt` only

## Explicit
- Original bank file SHA must not be rewritten
- Prior Gate S approval for other SQL does **not** authorize these files
