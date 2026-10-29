# Staging WK FAQ visitor baseline + SQL 396 controlled live plan

**Task:** `AIPIFY_CORE_STAGING_BASELINE_AND_SQL396_CONTROLLED_LIVE_PLAN_V1`  
**Status:** PREPARE ONLY — no Staging/Production apply until named owner approval of each gate.

## Why not full Production migration replay

Staging `auedugihkduoaikfusqe` has `public` table count **0** (Supabase platform schemas only). Replaying ~1100+ Core migrations onto empty Staging is **not** the minimum path: intervening migrations assume `customers`/`users`/billing/auth graphs, RLS, and platform objects. That path is **BLOCKED** as unsafe/non-minimal for visitor FAQ eligibility QA.

## Minimum dependency graph (visitor FAQ eligibility only)

| Order | Artifact | SHA-256 | Role | Prod applied? |
|------:|----------|---------|------|---------------|
| A | `supabase/staging/wk_faq_visitor_baseline_v1.sql` | `e2d76f4c769546f9d6630816d68ce2d6701e6c40c75fd538fd23012898d250f6` | Staging-only: ledger, roles, customers/installations/customer_domains/FAQ columns, `normalize_domain`, `_wpkf_resolve_visitor_context` | N/A (Staging-only) |
| B | `supabase/migrations/20261932500000_widen_website_kompis_faq_retrieval.sql` | `3bccf917351206b54bdb8b4db65a3df761fe11b886762b11f41b568ba820f4fb` | `_wpkf_faq_query_tokens` + search body | YES on Production |
| C | `supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql` | `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e` | install count/assert + isolated search | YES on Production |
| D | `supabase/staging/wk_faq_visitor_synthetic_fixtures_v1.sql` | `d474063533b69e3977b91514147765035a0e2c0ea878411bbb4a57b36e49fdbc` | Synthetic apex/www + foreign tenant (`.example` only) | N/A |
| E | `supabase/migrations/20261939600000_website_kompis_verified_apex_www_faq_eligibility_v1.sql` | `1e51265f080086979d18b84fbc4b59cec12295e68f7f6098553d1e0b89879d9e` | apex↔www FAQ eligibility | **NO** on Production |

**Skipped intentionally (not required for visitor search QA):** full `202619323`/`324` APP admin FAQ surface (users FKs, audit, owner-admin helpers). Production already has them; Staging visitor path uses baseline columns instead.

**Risks if skipped incorrectly:** applying 396 alone on empty Staging fails (missing resolve/tokens/count/tables). Applying full history without review risks irreversible platform side effects — **do not**.

## Local proof commands

```bash
npx --yes tsx lib/website-kompis-verified-apex-www-faq-eligibility/staging-baseline-chain.contract.test.ts
npm run test:verified-apex-www-faq-eligibility
```

## Exact approval gates (independent)

### (A) Staging baseline
Authorize apply of **only**:
- `supabase/staging/wk_faq_visitor_baseline_v1.sql`  
  SHA-256 `e2d76f4c769546f9d6630816d68ce2d6701e6c40c75fd538fd23012898d250f6`  
- then verbatim `202619325…` SHA `3bccf917…` and `202619382…` SHA `ef2d436a…`  
- then `supabase/staging/wk_faq_visitor_synthetic_fixtures_v1.sql`  
  SHA-256 `d474063533b69e3977b91514147765035a0e2c0ea878411bbb4a57b36e49fdbc`  

to **Staging `auedugihkduoaikfusqe`**.

### (B) Staging migration 396
Authorize apply of **only**  
`supabase/migrations/20261939600000_website_kompis_verified_apex_www_faq_eligibility_v1.sql`  
SHA-256 `1e51265f080086979d18b84fbc4b59cec12295e68f7f6098553d1e0b89879d9e`  
to **Staging `auedugihkduoaikfusqe`** after (A) PASS.

### (C) Production migration 396
Authorize apply of the **same** file + SHA-256 to **Production `qbcqoixhrvhnuwphefvw`** only after (B) PASS. Separate named approval required — Staging PASS ≠ Production authorization.

## Post-apply agent QA (no owner Staging browser)

After each authorized apply: ledger versions, function SHA before/after, www→apex / apex→www RPC, cross-tenant/unverified/inactive negatives. Production Safari QA remains owner-only after Production SQL apply.
