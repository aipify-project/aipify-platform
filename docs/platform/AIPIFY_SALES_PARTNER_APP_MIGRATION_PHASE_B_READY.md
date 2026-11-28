# AIPIFY_SALES_PARTNER_APP_MIGRATION_PHASE_B_READY

**Status:** READY (thin hosts + menu bindings; `/partners` not retired)  
**Phase:** B  
**Based on:** Phase A PR #511 / `e290326e1` · contract `lib/sales-partner-app-migration/phase-a-contract.ts`

## Delivered

| Item | Path |
|------|------|
| Host registry | `lib/sales-partner-app-migration/phase-b-hosts.ts` |
| License architecture (docs only) | `lib/sales-partner-app-migration/phase-b-license-contract.ts` |
| APP layout + partner_identity gate | `app/app/sales-partner/layout.tsx` |
| Thin hosts | `app/app/sales-partner/**` (14 routes) |
| Materials distinct host | `…/materials` via `initialSection="library"` |
| Binding fix | `FOUNDATION_NAV_BINDINGS` → `/app/sales-partner/*` |
| Manifest | `sales_partner.canonicalRoute` → `/app/sales-partner` |
| Additive `/partners` roots | `customers` → prospects, `academy` → training |
| Tests | `phase-b-hosts.test.ts` + updated Phase A contract tests |

## Route PASS matrix (code/contract)

| APP host | Source | Auth |
|----------|--------|------|
| `/app/sales-partner` | `/partners` | partner_identity gate |
| `/app/sales-partner/products` | product-catalog | same |
| `/app/sales-partner/links` | referrals/links | same |
| `/app/sales-partner/sales-page` | sales-page | same |
| `/app/sales-partner/leads` | customers/leads | same |
| `/app/sales-partner/customers` | customers/prospects | same |
| `/app/sales-partner/pipeline` | customers/pipeline | same |
| `/app/sales-partner/commissions` | settlement | same |
| `/app/sales-partner/academy` | academy/training | same |
| `/app/sales-partner/certificates` | academy/certifications | same |
| `/app/sales-partner/tools` | marketing/assets center | same |
| `/app/sales-partner/materials` | marketing/assets library | same |
| `/app/sales-partner/email-templates` | email-templates | same |
| `/app/sales-partner/messages` | account/messages | same |

Reuse (no thin host): notifications → `/app/notifications`, profile → `/app/profile`, help → `/app/support` (Phase C).

## Explicit non-effects

- No `/partners` retirement or redirects cutover  
- No SQL / Production writes / Stripe / gates / commission rates  
- No Agent 2 dependency/catalog SQL · no Agent 3 support edits  
- Public `/p/*`, `/s/*`, cert verify unchanged  
- Commercial Sales Partner license **not activated** (architecture doc only)  
- Persistence UI E2E still BLOCKED (no Platform Admin session)  

## QA blockers (logged-in)

- Full UI E2E for every host requires authorized CSP + APP session (not guessed)  
- Portal load 60–120s + messages send UX remain Phase B→C requirements (hosts ship; performance/UX polish not claimed PASS)  

## Next

**Phase C:** shared profile/support/messages/notifications/feedback + performance.  
**Phase D:** `/partners` retirement only with separate owner YES.
