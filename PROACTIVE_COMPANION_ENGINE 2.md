# Proactive Companion Engine

**Feature owner:** Customer App · **Phase:** A.79

See [PROACTIVE_COMPANION_ENGINE_PHASE_A79.md](./PROACTIVE_COMPANION_ENGINE_PHASE_A79.md) for implementation details.

## Purpose

Deliver timely, relevant, responsible proactive guidance before things become urgent — across operational, support, knowledge, executive, and team awareness categories.

## Philosophy

- Supportive companion communication — never intrusive or anxiety-inducing
- Human control — users dismiss, snooze, or act on every nudge
- Metadata only — no surveillance, no colleague monitoring
- ABOS Assistance pillar — augments people; humans decide

## Boundaries

No anxiety language · No flooding · No surveillance · Quiet hours and frequency preferences · Self Love fatigue monitoring (A.76 planned)

## Related engines

| Engine | Role |
|--------|------|
| Companion Presence (A.67) | Floating orb and heartbeat — presence UI |
| ILM proactive guidance | Assistant reply language patterns |
| Command Center (A.26) | Delivery surface for actionable nudges |
| Notification Engine (A.12) | Channel distribution |
| Quality Guardian (A.13) | Quality signals for knowledge/operational nudges |

## Code paths

- Migration: `supabase/migrations/20260924000000_proactive_companion_engine_phase_a79.sql`
- Core: `lib/core/proactive-companion.ts`
- Engine: `lib/aipify/proactive-companion-engine/`
- ILM: `lib/internal-language-model/proactive-companion-vocabulary.ts`
- Route: `/app/proactive-companion-engine`
