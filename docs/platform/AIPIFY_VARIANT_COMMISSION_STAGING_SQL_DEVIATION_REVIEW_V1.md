# AIPIFY_VARIANT_COMMISSION_STAGING_SQL_DEVIATION_REVIEW_V1

| Field | Value |
|-------|--------|
| Date | 2026-11-28 |
| Project | Staging `auedugihkduoaikfusqe` only |
| Status | **`AIPIFY_VARIANT_COMMISSION_STAGING_SQL_DEVIATION_VERIFIED`** |
| Mode | READ_ONLY review · no SQL apply · no harness · no Production |

---

## 1. SHA comparison

| Artifact | SHA256 |
|----------|--------|
| Owner-approved preflight file (Git `6b381ead8`) | `d34ecae9bc2d6b4c94de64b88c6e6ff5ddec017fcf389e3bea12d39a0aba864f` |
| Actually installed on Staging | `8a732222ca1aa9aa08e0c6300e71c9875934797393c1c7a5e9c3dcae03fb721e` |
| Git-aligned source (matches installed) | `8a732222ca1aa9aa08e0c6300e71c9875934797393c1c7a5e9c3dcae03fb721e` |

**Deviation:** Staging Step 2 was installed with a **different** SHA than the owner-approved YES line.

---

## 2. Exact content delta (approved → installed)

`diff` of approved (`d34ecae9…`) vs installed (`8a732222…`): **6 lines**, all in `upsert_csp_variant_commission_rate` only.

Change type: wrap existing SQL `CASE` expressions in parentheses.

| Location | Approved | Installed |
|----------|----------|-----------|
| Idempotency compare `amount` | `case when v_model = 'fixed' … end` | `(case when v_model = 'fixed' … end)` |
| Idempotency compare `rate_pct` | `case when v_model = 'percent' … end` | `(case when v_model = 'percent' … end)` |
| INSERT `amount` | bare `case when …` | `(case when …)` |
| INSERT `rate_pct` | bare `case when …` | `(case when …)` |
| Audit jsonb `amount` | bare `case when …` | `(case when …)` |
| Audit jsonb `rate_pct` | bare `case when …` | `(case when …)` |

**Confirmed:** no other additions/removals (no DDL/DML/grant/RPC logic edits beyond those parentheses).

Reason the approved file failed: PL/pgSQL treats bare `CASE` inside `IF …` as a control statement; Postgres returned `syntax error at end of input` at the first bare `CASE`.

---

## 3. Failed first apply — leftover DB state?

| Attempt | Result | Leftover? |
|---------|--------|-----------|
| 1 — exact approved SHA `d34ecae9…` (MCP + Management API) | **FAILED** parse | Post-fail probe: `csp_variant_commission_rate_versions` **null**, step-2 RPCs **absent** |
| 2 — parenthesized hotfix SHA `8a732222…` | **SUCCEEDED** | Objects listed below |

Diagnostic probes `_tmp_case_probe` were created and dropped during diagnosis; **not present** after review.

**Conclusion:** failed first run left **no** Step 2 schema objects.

---

## 4. Staging objects created by Step 2 (current)

| Object | Present | Notes |
|--------|---------|-------|
| Table `csp_variant_commission_rate_versions` | yes | 15 columns as designed; **0 rows** (no backfill) |
| `list_csp_variant_commission_rates(uuid)` | yes | security definer, stable |
| `upsert_csp_variant_commission_rate(…)` | yes | security definer, volatile; live body has parenthesized CASE |
| `get_effective_csp_variant_commission(…)` | yes | security definer, stable |
| `get_csp_product_variants_bundle(text)` | replaced | includes `commission_rules`; `settlement_activated` false |
| `supabase_migrations.schema_migrations` row for step 2 | **none** | Applied via Management API `database/query`, not `apply_migration` |

Step 1 remains: `csp_product_variants` / `csp_product_variant_prices` present, **0 rows**.

---

## 5. History / activation checks

| Check | Result |
|-------|--------|
| `csp_commission_rate_versions` | **3** unchanged (voice 0 · bedrift 800 · web 500; same IDs) |
| `csp_qualified_sales` | **4** unchanged (all `kompis_web`, snapshot 500 NOK, same IDs) |
| Variant commission rows | **0** |
| `settlement_activated=false` in bundle / upsert / get_effective sources | **true** |

---

## 6. Git versioning status (deviation)

| Location | SQL SHA | Notes |
|----------|---------|-------|
| Commit `6b381ead8` (preflight) | `d34ecae9…` | Original owner-YES bytes (failed parse) |
| Source-alignment commit on PR #490 | `8a732222…` | Matches Staging install (CASE parentheses only) |
| `origin/main` at review | may lag | Align via PR #490 |

**Policy reminder for future:** on SQL apply failure, stop; do not install modified SQL without a new exact owner YES naming the new SHA256.

---

## 7. Commits / references

- Preflight commit (approved bytes): `6b381ead8d0a7762aa1fdf799b9c4e8743b64761`
- Branch: `feat/variant-commission-core-staging-preflight-v1`
- PR: https://github.com/aipify-project/aipify-platform/pull/490

---

## Verdict

Staging Step 2 is live with hotfix SHA `8a732222…`. Delta vs original YES is **only CASE parentheses** in `upsert_csp_variant_commission_rate`. Failed first apply left no objects. Legacy rates/sales unchanged. `settlement_activated=false`. Git source on PR #490 is aligned to the installed SHA (`AIPIFY_VARIANT_COMMISSION_SQL_SOURCE_ALIGNED`).
