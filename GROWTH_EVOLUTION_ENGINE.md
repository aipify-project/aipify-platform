# Growth & Evolution Engine

**Feature owner:** Customer App · **Phase:** A.81

See [GROWTH_EVOLUTION_ENGINE_PHASE_A81.md](./GROWTH_EVOLUTION_ENGINE_PHASE_A81.md) for implementation details.

## Purpose

Help organizations continuously improve, adapt, and evolve intentionally — sustainable growth through learning cycles and transparent evolution recommendations.

## Philosophy

- Growth = becoming better, not just doing more
- Learn thoughtfully, improve responsibly, adapt strategically
- Celebrate progress — progress not perfection
- Human control — accept, dismiss, or defer every recommendation
- Metadata only — no PII, no surveillance

## Learning cycle

Observe → Understand → Improve → Implement → Measure → Learn → Repeat

## Related engines

| Engine | Role |
|--------|------|
| Evolution Governance (Phase 84) | Change proposals and approval matrix |
| Capability Maturity (A.57) | Domain maturity levels 1–5 |
| Organizational Health (A.56) | Aggregate health indicators |
| Learning Engine | Customer learning memory |
| Proactive Companion (A.79) | Proactive surfacing of growth opportunities |
| Trust & Action Engine | Evidence, trade-offs, and approval for sensitive actions |

## Code paths

- Migration: `supabase/migrations/20260927000000_growth_evolution_engine_phase_a81.sql`
- Core: `lib/core/growth-evolution.ts`
- Engine: `lib/aipify/growth-evolution-engine/`
- ILM: `lib/internal-language-model/growth-evolution-vocabulary.ts`
- Route: `/app/growth-evolution-engine`
