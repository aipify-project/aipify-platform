# Aipify Partner Terminology Update

**Effective:** Implementation Blueprint Phase 33 · Partner & Aipify Expert Network  
**Feature owner:** Customer App  
**Supersedes:** Legacy tier names (`Registered Partner`, `Advanced Partner`, `Strategic Partner`, `Premier Partner`) and public **Affiliate** language.

## Official partner tiers (public)

Use these full titles everywhere in customer-facing UI, i18n, ILM, and partner portal copy:

| DB key | Official title | Role summary |
|--------|----------------|--------------|
| `sales_representative` | **Aipify Sales Representative** | Prospecting, relationship building, product introductions, opportunity identification; recurring commission |
| `sales_expert` | **Aipify Sales Expert** | Product demos, solution matching, business pack recommendations; requires Aipify Foundations Certification; enhanced recurring commission |
| `certified` | **Aipify Certified Partner** | Onboarding, KC setup, workflow config, training; requires Administrator Certification + successful implementations |
| `expert` | **Aipify Expert Partner** | Executive consulting, industry specialization, large-scale implementations; advanced certifications + proven success |

## Never use publicly

- **Affiliate** (including Affiliate Dashboard, Affiliate Earnings)
- **Referral hustle** or reseller hustle language
- Legacy tier labels: Registered Partner, Advanced Partner, Strategic Partner, Premier Partner (except in migration notes)

## Partner Portal professional terminology

| Use | Instead of |
|-----|------------|
| Customers | Leads (when meaning existing relationships) |
| Opportunities | Lead referral program |
| Pipeline | Referral hustle |
| Commission Overview | Affiliate Earnings |
| Certifications | Generic “badges” without context |
| Performance Insights | Hustle metrics |
| Partner Resources | Affiliate toolkit |

## Database mapping

### `partners.certification_level` (A.45)

**Allowed values:** `sales_representative`, `sales_expert`, `certified`, `expert`

**Migration from legacy:**

| Legacy | New |
|--------|-----|
| `registered` | `sales_representative` |
| `certified` | `certified` (unchanged) |
| `advanced` | `expert` |
| `strategic` | `expert` |

Helper: `_mpfe_tier_label(p_level text)` returns official titles (with legacy fallback for unmigrated reads).

### `partner_ecosystem_profiles.partner_tier` (Phase 91)

**Allowed values:** `sales_representative`, `sales_expert`, `certified`, `expert`

**Migration from legacy:**

| Legacy | New |
|--------|-----|
| `registered` | `sales_representative` |
| `certified` | `certified` |
| `advanced` | `expert` |
| `premier` | `expert` |
| `strategic` | `expert` |

Helper: `_pce_tier_label(p_tier text)` delegates to `_mpfe_tier_label()`.

## Related surfaces

| Surface | Route |
|---------|-------|
| Marketplace & Partner Ecosystem A.45 / Phase 19 + 33 | `/app/marketplace-partner-ecosystem-foundation-engine` |
| Partner Certification Phase 91 | `/app/partners` |
| Certification & Achievement A.37 | `/app/certification-achievement-engine` |
| Learning & Training A.36 | `/app/learning-training-engine` |

Migration: `supabase/migrations/20260980000000_implementation_blueprint_phase33_partner_expert_network.sql`
