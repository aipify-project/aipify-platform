# Growth & Evolution Engine — Phase A.81

**Feature owner:** Customer App

Organizational ABOS engine for sustainable growth orchestration, learning cycles, evolution signals, and transparent recommendations.

## Distinctions

- **Phase 84 Evolution Governance** — change proposals/approval matrix at `/app/evolution`. Do not replace.
- **A.57 Capability Maturity Engine** — domain maturity levels 1–5 at `/app/capability-maturity-engine`.
- **A.56 Organizational Health Engine** — aggregate health indicators at `/app/organizational-health-engine`.
- **Learning Engine** — customer learning memory at `/app/learning`.
- **A.81 Growth & Evolution** — this engine: growth dimensions, learning cycles, signals, evolution recommendations.

## Route

`/app/growth-evolution-engine` — nav id `growthEvolutionEngine`

## Tables

- `organization_growth_evolution_settings` — enabled, focus_dimensions jsonb, learning_cycle_cadence, celebrate_progress
- `organization_growth_signals` — dimension, signal_type, summary, trend_direction, confidence (metadata only)
- `organization_growth_recommendations` — dimension, title, summary, evidence_summary, trade_offs, risk_level, status

## Growth dimensions

`operational` · `knowledge` · `human` · `customer` · `strategic`

## Learning cycle

Observe → Understand → Improve → Implement → Measure → Learn → Repeat

## Permissions

`growth_evolution.view` · `growth_evolution.manage` · `growth_evolution.recommendations.review` · `growth_evolution.export`

## RPCs

Dashboard, card, list recommendations, review recommendation, update settings, export report.

## Integrations

Proactive Companion (A.79) · Continuous Improvement · Organizational Health · Capability Maturity · Learning Engine · Decision Support · Trust & Action.

ABOS **Growth** pillar. Metadata only. Self Love (A.76 planned) balances ambition and wellbeing.
