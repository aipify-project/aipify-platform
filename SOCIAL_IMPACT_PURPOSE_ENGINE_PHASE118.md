# Social Impact & Purpose Engine — Phase 118

**Feature owner:** Customer App

Purpose Center + Social Impact initiatives — stewardship through responsibility. Purpose is action, not marketing.

## Distinctions

- **NOT** Purpose & Values A.82 (`/app/purpose-values-engine`) — organizational values alignment cross-link only
- **NOT** Impact Engine A.85 (`/app/impact-engine`) — outcome measurement cross-link only
- **NOT** Platform Anonymised Impact (`/platform/impact`) — marketing proof, NOT tenant social impact
- **Phase 118** — Purpose Center visibility, social impact initiatives, wellbeing support, alignment reflections, and impact tracking metadata

## Route

`/app/social-impact-purpose-engine` — nav id `socialImpactPurposeEngine`

## Module

`social_impact_purpose_engine`

## Migration

`supabase/migrations/20261208000000_social_impact_purpose_engine_phase118.sql` — prefix `_sipe_*`, blueprint `_sipbp118_*`

## Tables

- `social_impact_purpose_settings`
- `social_impact_purpose_initiatives`
- `social_impact_purpose_commitments`
- `social_impact_purpose_alignment_snapshots`
- `social_impact_purpose_impact_indicators`
- `social_impact_purpose_audit_logs`

## Permissions

`social_impact_purpose.view` · `social_impact_purpose.manage`

## RPCs

`get_social_impact_purpose_card` · `get_social_impact_purpose_dashboard`

## Cross-links

Purpose & Values A.82 · Impact Engine A.85 · Inclusion & Humanity A.83 · Self Love A.76 · Gratitude & Recognition A.89 · Community Phase 117/89 · Growth Partner Ops Phase 114 · AI Ethics Blueprint 98

## Code paths

- `lib/aipify/social-impact-purpose-engine/`
- `app/api/aipify/social-impact-purpose-engine/`
- `app/app/social-impact-purpose-engine/page.tsx`
- `components/app/social-impact-purpose-engine/`
- `lib/internal-language-model/implementation-blueprint-phase118-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase118-social-impact-purpose.txt`
- `content/knowledge/aipify/social-impact-purpose-engine/faq/social-impact-purpose-engine-faq.md`

## decision_explanations

Append `social_impact_purpose` to `decision_explanations_decision_type_check`.
