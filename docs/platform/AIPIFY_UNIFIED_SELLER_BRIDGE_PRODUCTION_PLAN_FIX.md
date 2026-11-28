# UNIFIED_SELLER_BRIDGE_PRODUCTION_PLAN_FIX_READY

STATUS: **PLAN_FIX_READY** — SQL NOT_APPLIED · no Production write · no seller link

## Exact changes

File: `docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql`

| Location | Before | After |
|---|---|---|
| `_usb_provision_dedicated_gp_org_for_auth` org update | `subscription_plan = 'growth_partner'` | `subscription_plan = 'internal'` |
| `complete_growth_partner_public_signup` org update | `subscription_plan = 'growth_partner'` | `subscription_plan = 'internal'` |

Preserved:
- `aipify_tenant_profiles.tenant_type = 'growth_partner'`
- CSP authoritative status/cert mapping
- `organization_users.role = 'growth_partner'`
- Refusal of existing APP customer org conversion
- Production `organizations_subscription_plan_check` unchanged (no new plan value)

## `internal` access note

- `internal` satisfies Production plan check; it is **not** a new commercial package.
- Seller capability remains gated by CSP cert + GP profile status + `growth_partner.*` IRP role grants.
- `_mta_seed_organization_modules` still seeds its default starter module rows (pre-existing bridge behavior; independent of plan string). It does not grant platform admin or elevate CSP/APP owners.
- Existing APP customer orgs are never updated by this candidate.

## Tests

| Suite | Result |
|---|---|
| `lib/growth-partner-bridge/*.test.ts` (incl. plan=`internal` contract + SHA sidecar) | see run output |
| Production RO re-check: plan check still starter…internal; bridge_fns=0; 1 approved+kompis seller | PASS |

## SHA-256

`4db4c931b17cefaeee0e354fc446027f0099c61ce464ede927cbc5163e2324d0`  
Sidecar: `NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql.sha256`

## Remaining blockers

1. PR #484 CI / merge readiness — confirm green checks before merge (`gh` may need re-auth).
2. Production SQL still **NOT_APPLIED** until Exact YES citing new SHA.
3. Seller link remains a **separate** Exact YES after apply.

## Exact next approval

```
YES PRODUCTION APPLY
docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql
SHA256 4db4c931b17cefaeee0e354fc446027f0099c61ce464ede927cbc5163e2324d0
project qbcqoixhrvhnuwphefvw only
NO seller link · NO Staging shim · NO email/Stripe/commission
```
