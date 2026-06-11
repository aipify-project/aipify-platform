# Industry Intelligence Foundation Engine — Phase A.44

## Vision

**Industry Intelligence Foundation Engine** — Customer App engine with Core RPCs in Supabase. Framework for industry-specific patterns, terminology, operational priorities, and explainable recommendations. Extends Business Packs (A.43), Organizational Memory (A.34), and Strategic Intelligence (A.31).

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260820000000_industry_intelligence_foundation_engine_phase_a44.sql` |
| Prefix | `_iife_` |
| decision_type | `industry_intelligence_foundation_engine` |
| Lib | `lib/aipify/industry-intelligence-foundation-engine/` |
| Core helpers | `lib/core/industry-intelligence-foundation.ts` |
| API | `/api/aipify/industry-intelligence-foundation-engine/*` |
| UI | `/app/industry-intelligence-foundation-engine` |
| KC FAQ | `content/knowledge/aipify/industry-intelligence-foundation-engine/faq/industry-intelligence-foundation-engine-faq.md` |

## Core tables

- `industry_profiles` — global catalog with `knowledge_metadata` jsonb (terminology, workflows, KPIs, best practices, risks, benchmarks, future hooks)
- `organization_industry_assignments` — tenant profile assignment (one active per org)
- `organization_industry_settings` — insights toggle, custom terminology, priorities
- `industry_insights` — tenant-scoped recommendations with override support

## Seed industry profiles (active)

- Membership Platforms (`membership_platforms`)
- E-Commerce (`e_commerce`)
- Professional Services (`professional_services`)
- Hospitality (`hospitality`)
- Healthcare (`healthcare`)
- Education (`education`)
- Manufacturing (`manufacturing`)

## RPCs

- `get_industry_intelligence_foundation_engine_dashboard()` — benchmarks, improvements, risks, opportunities, Business Pack alignment, integration summaries
- `get_industry_intelligence_foundation_engine_card()` — summary card for home/shell
- `assign_organization_industry_profile(p_industry_key)` — assign profile and seed sample insights
- `override_industry_insight(p_insight_id, p_override_recommendation)` — human override with audit
- `disable_organization_industry_insights(p_disabled)` — disable insights for org
- `customize_organization_industry_settings(p_settings)` — custom terminology and priorities
- `export_organization_industry_insights()` — metadata-only export

## Permissions

- `industry.view`
- `industry.manage`
- `industry.override`
- `industry.export`

## Integration notes

- **A.43 Business Packs:** `_iife_business_pack_alignment()` surfaces aligned packs per industry key
- **A.34 Organizational Memory:** `_iife_memory_summary()` in dashboard integration summaries
- **A.31 Strategic Intelligence:** `_iife_strategic_summary()` in dashboard integration summaries
- **Future hooks (scaffold):** external data sources, industry reports, benchmarking, partner ecosystems in `knowledge_metadata.future_hooks`

## Principle

Business logic in RPCs; panels are thin clients. Metadata-only — no PII. Human oversight — overrides require explicit action, never silent.
