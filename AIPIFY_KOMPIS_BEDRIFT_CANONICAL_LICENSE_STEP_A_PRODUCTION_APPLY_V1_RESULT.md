# AIPIFY — Kompis Bedrift Canonical License Step A — Production APPLY V1 RESULT

**Date:** 2026-10-14  
**Task:** Kompis Bedrift Canonical License — Step A  
**Owner approval:** Affirmative APPLY (empty backfill · no UnoNight `kompis_bedrift` grant · no Step B / accounts / other SQL / frozen WK)  
**Core:** `qbcqoixhrvhnuwphefvw`  
**Verdict:** **PASS — APPLIED**

---

## Identity

| Field | Value |
|-------|-------|
| Source | `docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql` |
| Deployable | `supabase/migrations/20261939000000_kompis_bedrift_product_entitlement_register_v1.sql` |
| Bytes | **13256** |
| SHA-256 | `99e1eea1837629bc386961ebc43dd50467c86951fc23d54c9a9d43ef8841253a` (proposal ≡ migration) |
| Ledger | `20261939000000` **recorded** |
| Apply path | `npm run supabase:sql:apply -- --file …` |

---

## Preflight → Postflight

| Check | Preflight | Postflight |
|-------|-----------|------------|
| `*kompis_bedrift*` functions | **0** | **3** (SECURITY DEFINER) |
| `tenant_modules` where `module_key='kompis_bedrift'` | **0** | **0** (empty backfill) |
| Ledger `202619390*` | absent | **present** |
| Ledger `202619382*` | present | present (untouched) |
| TENANT Web modules | `website_kompis` + `employee_knowledge` (+gaps) · **no** bedrift | **unchanged** · **no** bedrift |
| Frozen WK public chain | — | **46/46** changed **0** |

### Functions live

1. `get_platform_portal_customer_kompis_bedrift_status(uuid) → jsonb`  
2. `activate_platform_portal_customer_kompis_bedrift(uuid, text, boolean, text) → jsonb`  
3. `deactivate_platform_portal_customer_kompis_bedrift(uuid, text, boolean, text) → jsonb`  

Grants probe: `anon` EXECUTE status/activate = **false**; `authenticated` EXECUTE status = **true** (Platform portal pattern).

---

## Explicit non-runs (per approval)

- Step B fail-closed APP/API gates — **NOT RUN**  
- Platform activate / UnoNight `kompis_bedrift` grant — **NOT RUN**  
- `admin@aipify.tech` / new accounts — **NOT RUN**  
- Other SQL / public cost / Website Kompis Public Chain edits — **NOT RUN**  
- Stripe / provider / index — **NOT RUN**

---

## Rollback note (if needed before any activate)

`DROP FUNCTION` the three RPCs above. Do **not** invent grants. Reservation/history N/A (no bedrift rows written).

---

## Next (out of scope)

Separate owner job for any Platform `activate_…_kompis_bedrift` grants or Step B.
