# Self Love Engine — Phase A.76

**Feature owner:** Customer App · **Phase:** A.76

See [IMPLEMENTATION_BLUEPRINT_PHASE7_SELF_LOVE_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE7_SELF_LOVE_FOUNDATION.md) for blueprint alignment.

## Purpose

Unify wellbeing principles across user, team, organization, and system health with explainable recommendations — turning Self Love from philosophy into functional behavior.

## Philosophy

- Self Love is a **value** — care, reflection, recovery, balance
- Support hard work without glorifying exhaustion
- Metadata only — no raw chat, emotions, or PII
- ABOS Assistance pillar — informs and prepares; humans decide

## Application areas

| Area | Focus |
|------|-------|
| User Wellbeing | Pacing, breaks, reflection |
| Team Health | Coordination without surveillance |
| Organization Health | Operational rhythm, KC, workflows |
| System Health | Aggregate Quality/Observability signals |

## Boundaries

Never intrusive · Never infantilizing · Never blocking work · Never replacing professional help · Settings control *how* reminders appear

## Related engines

| Engine | Role |
|--------|------|
| Companion Identity (A.84) | Orchestration context |
| Proactive Companion (A.79) | Timely assistance categories |
| Quality Guardian (A.13) | Aggregate quality check counts |
| Observability (A.19) | Aggregate platform health counts |
| Attention Guardian | Personal focus (`/app/assistant/attention`) |

## Code paths

- Migration: `supabase/migrations/20260954000000_self_love_engine_phase_a76.sql`
- Core: `lib/core/self-love.ts`
- Engine: `lib/aipify/self-love-engine/`
- ILM: `lib/internal-language-model/self-love-engine-vocabulary.ts`
- Naming: [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md)
- Route: `/app/self-love-engine`

## Permissions

`self_love.view` · `self_love.manage` · `self_love.preferences.manage` · `self_love.export`
