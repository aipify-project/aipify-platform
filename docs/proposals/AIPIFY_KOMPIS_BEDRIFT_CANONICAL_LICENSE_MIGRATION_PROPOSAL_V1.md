# Kompis Bedrift — Canonical License Migration Proposal V1

**Status:** PROPOSAL ONLY — not applied  
**SQL:** `docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql`  
**SHA-256:** `99e1eea1837629bc386961ebc43dd50467c86951fc23d54c9a9d43ef8841253a` (13256 bytes)

## Contract

| Rule | Decision |
|------|----------|
| Authoritative product key | `kompis_bedrift` on `tenant_modules` |
| Authority check | Existing `is_tenant_module_enabled(tenant_id, 'kompis_bedrift')` |
| Grant path | Platform RPC only (`activate_platform_portal_customer_kompis_bedrift`) |
| Membership → Bedrift | **Forbidden** |
| `employee_knowledge` → Bedrift | **Forbidden** (no alias) |
| Package `module_keys` sync | **Do not** add `kompis_bedrift` to `subscription_packages` (avoids auto-grant) |
| UnoNight | **No** Bedrift grant — Web-only test customer |

## Two-step rollout

| Step | What | LIVE? |
|------|------|-------|
| **A** | Owner-approve → move SQL into `supabase/migrations/` → apply functions only (0 `tenant_modules` rows) → optional explicit Platform grants for sold Bedrift customers | Separate APPLY job |
| **B** | APP/Core fail-closed gates (`bedriftModuleEnabled`, nav `moduleKey`, EKE API, `pathDenied`) | Separate runtime job **after** A |

## Separate backfill plan (not in definition SQL)

| Tenant | Grant `kompis_bedrift`? | Why |
|--------|-------------------------|-----|
| *(empty)* | — | **0** Core rows today; no sold Bedrift product entitlements found |
| UnoNight `32d748eb-…` | **No** | Owner policy: Web test customer |
| Future admin@aipify.tech Bedrift org | Yes — via Platform activate after org creation | Separate customer-creation job |

## Future Bedrift test org (not this job)

1. Platform creates organization + owner `admin@aipify.tech` (ordinary flow).  
2. Ensure active subscription/agreement.  
3. Call `activate_platform_portal_customer_kompis_bedrift(..., confirmation=true, idempotency bpk-…)`.  
4. Do **not** use UnoNight.

## Staging / Docker test contract (isolated — no Production writes)

1. Apply `.NOT_APPLIED.sql` only on local/Docker Core clone.  
2. Assert functions exist; `tenant_modules` row count for `kompis_bedrift` unchanged (0).  
3. Platform role: status → eligible when agreement active; activate creates one licensed row; deactivate disables; replay idempotent.  
4. Non-platform role: execute denied.  
5. `is_tenant_module_enabled(id, 'kompis_bedrift')` false before activate, true after.  
6. Website FAQ / install rows untouched.

## Rollback / forward-fix

- **Rollback:** `DROP FUNCTION` the three RPCs (no data to undo if never granted).  
- **Forward-fix if grants already made:** deactivate RPC or explicit `licensed=false` — do not DELETE history/audit.  
- **Ledger:** only after authorized move into `supabase/migrations/` + successful APPLY.
