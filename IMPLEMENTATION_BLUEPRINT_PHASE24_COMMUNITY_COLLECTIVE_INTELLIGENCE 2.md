# Implementation Blueprint — Phase 24: Community & Collective Intelligence Engine

**Feature owner:** Customer App  
**Implementation:** [Community & Collective Intelligence — Phase 89](./COMMUNITY_COLLECTIVE_INTELLIGENCE_PHASE89.md)

This document defines **Phase 24 — Community & Collective Intelligence Engine** of the Aipify Business Operating System (ABOS). It aligns the existing Community & Collective Intelligence Engine with ABOS preparation standards — shared learning across organizations while preserving privacy, security, and trust.

> **Mapping:** ABOS Implementation Blueprint Phase 24 maps to **Community & Collective Intelligence Phase 89** at `/app/community` (admin at `/app/community/admin`). Do not duplicate Cross-Tenant Intelligence A.71, Organizational Benchmarking A.58, Learning & Adaptation Phase 23, or Marketplace Ecosystem Phase 19 — extend Phase 89 RPCs, dashboard, and ILM vocabulary only.

## Mission

Identify broader patterns, shared learning, and collective improvements across organizations — preserving privacy, security, and trust.

## Core philosophy

**Organizations should not solve every problem alone.** Shared learning accelerates progress; collective intelligence without compromising confidentiality.

## ABOS principle

**Wisdom grows when experiences are shared responsibly.**

## Core principle (Phase 89)

**Organizations own their knowledge. Organizations control participation.**

## Community objectives

| Objective | Description |
|-----------|-------------|
| **Best practice recommendations** | Surface validated practices from anonymized collective patterns |
| **Industry trend awareness** | Emerging themes from metadata — never confidential records |
| **Cross-organizational learning** | Shared lessons accelerate progress without org identity exposure |
| **Emerging pattern detection** | Recurring opportunities, workflow improvements, knowledge gaps |
| **Community-driven improvements** | Voluntary contributions strengthen the broader ecosystem |
| **Benchmarking opportunities** | Anonymized aggregation enables benchmarking safely |

## Collective insight examples (metadata)

From `_ccibp_blueprint_collective_insight_examples()`:

| Domain | Signals |
|--------|---------|
| **Support** | Frequently resolved issues, effective workflows, escalation improvements |
| **Knowledge** | Common gaps, frequently requested topics, documentation best practices |
| **Operational** | Workflow optimization, team coordination, productivity recommendations |
| **Strategic** | Emerging opportunities, market observations, growth considerations |

## Privacy principles

From `_ccibp_blueprint_privacy_principles()`:

- Anonymized aggregation — no org identity disclosure
- No confidential exposure — metadata patterns only
- Explicit governance — voluntary participation with review workflow
- Organizations own their knowledge — organizations control participation
- Trust transparency — what contributes to insights is explainable

## Community contributions

From `_ccibp_blueprint_community_contributions()`:

Voluntary participation — best practices, templates, knowledge packs, lessons learned, industry guidance. Workflow: draft → review → governance → anonymization → publication.

## Companion examples

| Emoji | Scenario | Example |
|-------|----------|---------|
| 🦉 | Others approached differently | Pattern worth exploring without exposing who shared it |
| 🌹 | Not alone | Similar knowledge gaps across the ecosystem |
| 🔔 | Community insight worth exploring | Validated escalation workflow insight |
| 🦉 | Emerging trends | Support best practice trends surfaced responsibly |

## Self Love connection

Self Love normalizes challenges, encourages learning, reduces fear of imperfection, and celebrates collective progress.

Route: `/app/self-love-engine` — principle only, not a feature toggle. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md) (no ™).

## Trust connection

Community & Collective Intelligence must stay **transparent**:

- What contributes to insights and how anonymity is protected
- Which recommendations come from community trends
- Participation settings — voluntary, governed, reversible
- Recommendations are guidance — humans decide what to adopt

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Cross-Tenant Intelligence A.71** | `/app/cross-tenant-intelligence-engine` | Platform-wide pattern intelligence |
| **Organizational Benchmarking A.58** | `/app/organizational-benchmarking-engine` | Benchmarking via anonymized aggregates |
| **Impact Metrics Phase 21** | `/platform/impact` | Platform Admin — anonymised proof |
| **Learning & Adaptation Phase 23** | `/app/learning` | Tenant learning loops |
| **Marketplace Ecosystem Phase 19** | `/app/marketplace-partner-ecosystem-foundation-engine` | Partner ecosystem foundation |
| **Industry Intelligence A.44** | `/app/industry-intelligence-foundation-engine` | Industry context and trends |
| **Continuous Improvement A.49** | `/app/continuous-improvement-engine` | Operational improvement cycles |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — knowledge sharing, support improvements, workflow recommendations, companion experiences |
| **Unonight** | First external pilot — knowledge sharing, support improvements, workflow recommendations, companion experiences |

## Success criteria (live)

Computed by `_ccibp_blueprint_success_criteria(tenant_id)`:

1. Benefit from collective learning — published insights or briefings
2. Privacy effective — anonymization required and governance intact
3. Community recommendations improve outcomes — ratings and validated practices
4. Transparent voluntary participation — organizations control opt-in
5. Ecosystem strengthens organizations — health score and contributions tracked
6. Community objectives documented
7. Collective insight examples documented
8. Privacy principles enforced
9. Companion examples documented
10. Self Love connection — normalize challenges, celebrate progress
11. Integration links distinct from related engines

## Engagement summary (live)

Computed by `_ccibp_engagement_summary(tenant_id)` from `community_contributions`, `community_scores`, `community_settings`, and `community_briefings` — counts only, no PII.

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_ccibp_engagement_summary(tenant_id)` | Live counts from community tables |
| `_ccibp_blueprint_success_criteria(tenant_id)` | Live structural checks |
| `get_community_intelligence_dashboard()` | Full blueprint dashboard — **all Phase 89 fields preserved** |
| `get_community_intelligence_card()` | Extended with compact blueprint metadata |

Migration: `supabase/migrations/20260971000000_implementation_blueprint_phase24_community_collective_intelligence.sql`  
Base engine: `20260618100000_community_collective_intelligence_phase89.sql`, `20260618200000_community_collective_intelligence_refinement_phase89.sql`

## Integration links

Cross-Tenant Intelligence A.71 · Organizational Benchmarking A.58 · Impact Metrics Phase 21 · Learning & Adaptation Phase 23 · Marketplace Ecosystem Phase 19 · Industry Intelligence A.44 · Continuous Improvement A.49 · Self Love A.76

## Vision phrases

- Benefit from broader ecosystem lessons — "we would never have discovered this on our own."
- Wisdom grows when experiences are shared responsibly.
- Organizations should not solve every problem alone — shared learning accelerates progress.
- Organizations own their knowledge. Organizations control participation.
- Trust is non-negotiable — anonymized aggregation, explicit governance, voluntary participation.
