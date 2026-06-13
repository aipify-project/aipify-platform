# Global Impact & Social Responsibility Engine — Phase 149

## Vision

Organizations contribute meaningfully to communities and people — visible stewardship, thoughtful reporting, and leadership reflection — because authentic responsibility builds trust that marketing cannot manufacture.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261309000000_implementation_blueprint_phase149_global_impact_social_responsibility.sql` |
| Lib | `lib/aipify/social-impact-purpose-engine/` |
| API | `/api/aipify/social-impact-purpose-engine/dashboard`, `/card` |
| UI | `/app/social-impact-purpose-engine` |
| KC FAQ | `content/knowledge/aipify/social-impact-purpose-engine/faq/implementation-blueprint-phase149-faq.md` |
| ILM | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase149-global-impact-social-responsibility.txt` |

## Role

**Global Intelligence & Interorganizational Era (141–150)** — extends Social Impact & Purpose Engine Phase 118 with Global Intelligence Era social responsibility depth. **Do NOT create duplicate impact center or social scoring systems.**

## Principle

Authentic responsibility and measurable contribution — not virtue signaling or PR campaigns. **Impact Companion encourages awareness** — does NOT assign social scores, judge organizational worth, impose ideology, publish sensitive info, or replace executive accountability. Growth Partner terminology — never Affiliate.

## Distinction

| Surface | Route | Purpose |
|---------|-------|---------|
| **Global Impact & Social Responsibility (Phase 149)** | `/app/social-impact-purpose-engine` | Extends Phase 118 — community initiatives, wellbeing programs, impact reporting, leadership reflection |
| Social Impact & Purpose (Phase 118) | Same route | Base Purpose Center — preserved |
| Purpose & Values (A.82 + Phase 138) | `/app/purpose-values-engine` | Values alignment — cross-link only |
| Impact Engine (A.85) | `/app/impact-engine` | Outcome measurement — cross-link only |
| Innovation & Impact (A.28) | `/app/innovation-impact-engine` | Innovation impact cross-link |
| Platform Anonymised Impact | `/platform/impact` | Marketing proof — NOT tenant social scoring |

## Helpers

- Phase 118 base: `_sipe_*`, `_sipbp118_*`
- Blueprint Phase 149: `_gisrb149_*` including `_gisrb149_integration_links()`, `_gisrb149_engagement_summary()`, `_gisrb149_success_criteria()`

## Tables (optional scaffolds)

- `social_impact_community_initiatives`
- `social_impact_wellbeing_programs`
- `social_impact_reports`
- `social_impact_executive_reviews`

## Thin RPCs

- `record_community_initiative(...)`
- `record_executive_impact_review(...)`

## Permissions

Existing Phase 118 permissions preserved:

- `social_impact_purpose.view` — view Purpose Center and Phase 149 impact metadata
- `social_impact_purpose.manage` — manage initiatives, programs, and reports

## Cross-links

Phase 118 · Purpose & Values 138 · Impact Engine A.85 · Innovation & Impact A.28 · Platform Anonymised Impact · Self Love A.76 · Inclusion A.83 · Employee Experience Phase 96 · Ecosystem Governance 119/146 · Global Knowledge Exchange 141 · Growth Partner Ops 114

## Code paths

- `lib/aipify/social-impact-purpose-engine/types.ts`, `parse.ts`
- `components/app/social-impact-purpose-engine/SocialImpactPurposeDashboardPanel.tsx`
- `lib/internal-language-model/implementation-blueprint-phase149-vocabulary.ts`

**All Phase 118 dashboard/card fields preserved.**
