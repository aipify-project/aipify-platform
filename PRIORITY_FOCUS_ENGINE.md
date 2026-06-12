# Priority & Focus Engine

**Feature owner:** Customer App · **Phase:** A.80

See [PRIORITY_FOCUS_ENGINE_PHASE_A80.md](./PRIORITY_FOCUS_ENGINE_PHASE_A80.md) for implementation details.

## Purpose

Transform overwhelming workloads into clear priorities supporting organizational success and human wellbeing — five dimensions and a P1–P4 framework with gentle focus support.

## Philosophy

- Clarity over volume — fewer priorities with clear levels
- Human wellbeing first — capacity and rest are valid inputs
- Gentle focus cues — never shame, guilt, or urgency pressure
- ABOS Operations/Assistance pillar — augments people; humans decide

## Priority dimensions

Operational · Strategic · Human · Knowledge · Relationship

## Priority levels

| Level | Label | Meaning |
|-------|-------|---------|
| P1 | Critical | Organizational impact if delayed |
| P2 | Important | Significant value — schedule deliberately |
| P3 | Planned | Steady progress work |
| P4 | Optional | Safe to defer when capacity is limited |

## Boundaries

No guilt language · No urgency pressure · Metadata only · Self Love fatigue monitoring (A.76 planned)

## Related engines

| Engine | Role |
|--------|------|
| TAG (Phase 37) | Personal focus at `/app/assistant/attention` |
| Goals & OKR (A.65) | Objectives and key results |
| Unified Tasks (A.62) | Task follow-up integration |
| Proactive Companion (A.79) | Timely organizational nudges |
| Executive Insights (A.35) | Executive summary context |
| Capacity & Workload (A.64) | Workload and capacity signals |

## Code paths

- Migration: `supabase/migrations/20260925000000_priority_focus_engine_phase_a80.sql`
- Core: `lib/core/priority-focus.ts`
- Engine: `lib/aipify/priority-focus-engine/`
- ILM: `lib/internal-language-model/priority-focus-vocabulary.ts`
- Route: `/app/priority-focus-engine`
