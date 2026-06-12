# Implementation Blueprint Phase 24 — Community & Collective Intelligence FAQ

## What is Phase 24 of the Implementation Blueprint?

Phase 24 aligns the Community & Collective Intelligence Engine (Phase 89) with ABOS preparation standards — shared learning across organizations while preserving privacy, security, and trust through governed, anonymized participation.

## How is this different from Cross-Tenant Intelligence (A.71)?

**Cross-Tenant Intelligence A.71** at `/app/cross-tenant-intelligence-engine` handles platform-wide pattern intelligence. **Community & Collective Intelligence Phase 89** at `/app/community` is the tenant community hub with governed contributions. Phase 24 extends Phase 89 — do not duplicate A.71.

## How is this different from Organizational Benchmarking (A.58)?

**Organizational Benchmarking A.58** at `/app/organizational-benchmarking-engine` provides benchmarking via anonymized aggregates. Community Intelligence surfaces collective insights and voluntary contributions. Distinct surfaces — cross-link only.

## What is the core principle?

**Organizations own their knowledge. Organizations control participation.** Contributions are voluntary, governed, and anonymized before publication.

## What community objectives does Phase 24 cover?

Best practice recommendations, industry trend awareness, cross-organizational learning, emerging pattern detection, community-driven improvements, and benchmarking opportunities — from `_ccibp_blueprint_community_objectives()`.

## What collective insight examples are documented?

Support (resolved issues, workflows, escalations), knowledge (gaps, topics, documentation), operational (workflow optimization, coordination), and strategic (opportunities, market observations) — metadata from `_ccibp_blueprint_collective_insight_examples()`.

## What privacy principles apply?

Anonymized aggregation, no org identity disclosure, no confidential exposure, explicit governance, and trust transparency — from `_ccibp_blueprint_privacy_principles()`.

## What companion examples are included?

🦉 Others approached differently · 🌹 Not alone · 🔔 Community insight worth exploring · 🦉 Emerging trends in best practices.

## How does Self Love connect?

Self Love normalizes challenges, encourages learning, reduces fear of imperfection, and celebrates collective progress. Route: `/app/self-love-engine` — principle only.

## What should users understand about trust?

What contributes to insights, how anonymity is protected, which recommendations come from community trends, and participation settings. Recommendations are guidance — humans decide what to adopt.

## What are the Phase 24 success criteria?

Computed live by `_ccibp_blueprint_success_criteria(tenant_id)`: collective learning benefit, privacy effective, community recommendations improve, transparent voluntary participation, ecosystem strengthens, objectives documented, insight examples, privacy principles, companion examples, Self Love connection, and distinct integration links.

## What does engagement summary show?

Live counts from `community_contributions`, `community_scores`, `community_settings`, and `community_briefings` via `_ccibp_engagement_summary(tenant_id)` — counts only, no PII.

## Where does dogfooding happen?

**Aipify Group AS** validates knowledge sharing, support improvements, workflow recommendations, and companion experiences internally. **Unonight** is the first external pilot.

## Where is the dashboard?

`/app/community` — RPCs `get_community_intelligence_dashboard()` and `get_community_intelligence_card()`. Admin at `/app/community/admin`.

Migration: `supabase/migrations/20260971000000_implementation_blueprint_phase24_community_collective_intelligence.sql`
