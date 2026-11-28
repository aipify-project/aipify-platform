# UNIFIED_SELLER_BRIDGE_STAGING_E2E_SAFE_READY

STATUS: **SAFE_READY** — candidates patched · no SQL apply · no testdata · Production untouched

## Staging inventory (unchanged RO)

| Check | Result |
|---|---|
| Project | `auedugihkduoaikfusqe` |
| Suitable approved + Kompis Web seller | **0** (all CSP partners terminated) |
| GP profiles / links | 0 / 0 |
| Bridge ensure RPC | present |
| Production bridge fns | **0** |

Baselines: attribution_fp `e77e6a818267812c2171e30e38315219` · commission_fp `a5d4f70523b809757f7c3c2b860a6009` · qs=4

## Safety patch summary

1. Cleanup deletes **exact UUIDs** from the current `verify()` run only.
2. Removed marker/email/slug `DELETE` patterns (dropped `_usb_staging_e2e_cleanup(text)`).
3. Cleanup cannot match existing CSP sellers, APP users, or orgs (no pattern match).
4. Deps shim uses **create-if-absent** for helpers; replaces `_usb_provision_dedicated_gp_org_for_auth` **only** when `aipify_tenant_profiles` is absent.
5. CRM assert requires `list_own_personal_sales_page_interests() -> ok=true` for the fixture certified seller.
6. PASS path verifies all fixture IDs gone + full attribution/commission fingerprints restored; FAIL path cleans exact IDs (or auth-only if partner never created). Transactional rollback of `verify()` also prevents leftovers.

## SQL candidates (NOT_APPLIED)

| Step | File | SHA-256 |
|---|---|---|
| Ref (already on Staging) | `NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql` | `3980f7795e3e4a77ac55ba876fbc8128d44a7bd3f000dc7893fafc4ce2d42d8f` |
| **A** deps shim | `NOT_APPLIED_staging_unified_seller_bridge_e2e_deps_shim_v1.sql` | 433230883a18ea265d604f0ec515b860f5f80d207bfe827283fc4f77109e1646 |
| **B** harness | `NOT_APPLIED_staging_unified_seller_bridge_e2e_harness_v1.sql` | 3d604e2d527e059b41071b3c10aa65e563cf8b8eca9bb24ea2ac30df76a7c313 |

## Staging-simplified functions — what E2E does / does not prove

| Function | Staging behavior | Proves on Staging | Does **not** prove about Production |
|---|---|---|---|
| `slugify_company_name` / `_awr_unique_slug` | Created only if missing | Slug uniqueness vs Staging orgs/companies | Production slug helpers / AWR rules |
| `_gp455a_generate_partner_public_id` / `_gp455a_slugify_partner_slug` | Created only if missing | Local ID/slug generation | Production GP455a ID formats |
| `provision_growth_partner_tracking_link` | Created only if missing (shim) | Ensure can attach primary `/s/{slug}` | Full Production provision + URL packaging |
| `_gp455_seed_training` / `_gp455_seed_role_permissions` | No-op if missing | Ensure does not hard-fail on seed | Training modules / role permission seeding |
| `_mta_sync_*` / `_mta_seed_*` | No-op if missing | Ensure continues without MTA tables | Multi-tenant sync / module settings |
| `_usb_provision_dedicated_gp_org_for_auth` | Staging override **only if** `aipify_tenant_profiles` absent; refuses existing `public.users` | Dedicated org on thin schema; no APP reuse | Production tenant profiles, customer_number_seq, org plan=`growth_partner`, registration profiles |

**Bridge RPCs under test (real Staging-applied):** `ensure_growth_partner_app_profile_for_csp_partner`, status sync trigger, `get_own_unified_seller_sales_links`, `list_own_personal_sales_page_interests`, `resolve_growth_partner_public_link`, `csp_set_partner_status`.

## Test matrix

| # | Assert |
|---|---|
| 1 | ensure creates certified + active personal slug (1:1 auth) |
| 2 | ensure second call idempotent |
| 3 | public slug published for fixture profile |
| 4 | own links path + CSP codes for fixture profile |
| 5 | `list_own_personal_sales_page_interests` returns **`ok=true`** + `interests` array for certified seller |
| 6 | suspend → personal links `disabled`, public closed |
| 7 | history rows retained after suspend |
| 8 | Non-fixture CSP attribution unchanged during run |
| 9 | Commission + qualified sales unchanged |
| 10 | Exact-ID cleanup restores org count + full attribution/commission fingerprints; fixture IDs gone |

## Cleanup plan

- PASS: `_usb_staging_e2e_cleanup(partner, admin, seller, profile, org, company, user, attr_link)`
- FAIL: same exact IDs; if partner never created → delete only this run’s admin/seller auth UUIDs
- Manual leftover (only if verify aborted outside SQL): call cleanup with IDs from `fixture_ids` in the JSON result — never by name/email/slug

## Exact YES (Staging only)

1. `YES STAGING APPLY` deps shim — cite path + SHA-256  
2. `YES STAGING APPLY` harness — cite path + SHA-256  
3. `YES STAGING RUN` `select public._usb_staging_e2e_verify();`

Forbidden without separate approval: Production · mass conversion · email · Stripe · commission mutation
