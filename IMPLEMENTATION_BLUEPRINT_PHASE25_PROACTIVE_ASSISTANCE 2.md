# Implementation Blueprint — Phase 25: Proactive Assistance Engine

**Feature owner:** Customer App  
**Implementation:** [Proactive Companion Engine — Phase A.79](./PROACTIVE_COMPANION_ENGINE_PHASE_A79.md)

This document defines **Phase 25 — Proactive Assistance Engine** of the Aipify Business Operating System (ABOS). It aligns the existing Proactive Companion Engine with ABOS preparation standards — timely, valuable support before users ask, while preserving human control, trust, and Phase A.79 boundaries.

> **Mapping:** ABOS Implementation Blueprint Phase 25 maps to **Proactive Companion Engine Phase A.79** at `/app/proactive-companion-engine`. Do not duplicate Companion Presence A.67, ILM proactive guidance, Notification Communication A.17, or Dedication Engine A.91 — extend Phase A.79 RPCs, dashboard, and ILM vocabulary only.

## Mission

Move beyond reactive assistance — timely, valuable support before users ask; anticipate needs responsibly.

## Core philosophy

**The most valuable assistance arrives before difficulties escalate — proactive, not intrusive.**

## ABOS principle

**Best companions help prepare before emergencies — preparation creates confidence.**

## Proactive objectives

| Objective | Description |
|-----------|-------------|
| **Early risk detection** | Surface escalating volumes, bottlenecks, and workload imbalances before crises |
| **Opportunity identification** | Identify strategic opportunities, positive trends, and simplification wins |
| **Reminder generation** | Timely reminders for deadlines, follow-ups, and preparation windows |
| **Workflow improvement** | Suggest operational improvements from metadata patterns — human approval required |
| **Follow-up recommendations** | Thoughtful follow-ups on tasks, support cases, and executive milestones |
| **Knowledge gap awareness** | Surface topics lacking documentation and articles needing review |

## Proactive examples (metadata)

From `_paebp_blueprint_proactive_examples()`:

| Domain | Signals |
|--------|---------|
| **Support** | Escalating volumes, increasing response times, repeated customer concerns |
| **Operational** | Tasks approaching deadlines, unbalanced workloads, bottlenecks |
| **Knowledge** | Topics lacking documentation, articles needing review, critical dependencies |
| **Executive** | Strategic opportunities, performance trends, milestones approaching |

## Companion examples

| Emoji | Scenario | Example |
|-------|----------|---------|
| 🦉 | Trend deserves attention | Support response times rose 15% — trend deserves attention before backlog grows |
| 🌹 | Opportunity to simplify | Three approval steps overlap — opportunity to simplify when you review |
| 🔔 | Small intervention prevents bottleneck | Two tasks share a deadline — a small handoff now may prevent a bottleneck |
| ❤️ | Three priorities that matter most | Before your meeting — three priorities that matter most today |

## Boundaries (should avoid)

From `_paebp_blueprint_boundaries()`:

- Excessive recommendations — daily caps and frequency preferences enforced
- Fear-driven messaging — no anxiety-inducing urgency language
- Notification overload — quiet hours and Self Love fatigue signals respected
- Acting without approvals — nudges suggest; users dismiss, snooze, or act
- Surveillance — metadata summaries only, never colleague monitoring

**Phase A.79 preserved:** five assistance categories, org/user preferences, companion style examples.

## Self Love connection

Self Love prevents crises, encourages preparation, supports healthier workloads, and reduces urgency — peace of mind, not constant alerts.

Route: `/app/self-love-engine` — principle only, not a feature toggle. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md) (no ™).

## Trust connection

Proactive Assistance must stay **transparent**:

- Why recommendations appear and which signals contributed
- Uncertainty acknowledged — guidance is preparation, not a guarantee
- Actions optional — dismiss, snooze, or act; never silent auto-execution
- Daily caps and quiet hours protect attention

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Companion Presence A.67** | `/app/settings/companion-presence` | Floating orb heartbeat — not proactive nudges |
| **ILM proactive guidance** | `lib/internal-language-model/proactive-guidance.ts` | Assistant language patterns |
| **Notification Communication A.17** | `/app/notification-communication-engine` | Delivery channels |
| **Command Center A.26** | `/app/command-center` | Executive feed and quick actions |
| **Quality Guardian A.13** | `/app/quality-guardian-engine` | Quality signals for risk detection |
| **Dedication Engine A.91** | `/app/dedication-engine` | Follow-through philosophy — distinct |
| **Desktop Companion Phase 20** | `/app/desktop` | Desktop awareness — cross-link only |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — executive awareness, support health, knowledge maintenance, task follow-up |
| **Unonight** | First external pilot — commerce and support proactive assistance |

## Success criteria (live)

Computed by `_paebp_blueprint_success_criteria(org_id, user_id)`:

1. Developments surface early — proactive nudges across categories
2. Proactive resolution — users act on or manage nudges
3. Recommendation quality — categories and signals documented
4. Low notification fatigue — daily caps and healthy dismiss rates
5. Trust in proactive guidance — explainability and optional actions
6. Proactive objectives documented
7. Proactive examples documented
8. Companion examples documented (🦉🌹🔔❤️)
9. Self Love connection — preparation over urgency
10. Blueprint boundaries enforced
11. Integration links distinct from related engines
12. Engine enabled for organization

## Engagement summary (live)

Computed by `_paebp_engagement_summary(org_id, user_id)` from `organization_proactive_nudges`, `organization_proactive_companion_settings`, and `organization_proactive_companion_audit_logs` — counts only, no PII.

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_paebp_engagement_summary(org_id, user_id)` | Live counts from proactive tables |
| `_paebp_blueprint_success_criteria(org_id, user_id)` | Live structural checks |
| `get_proactive_companion_engine_dashboard()` | Full blueprint dashboard — **all Phase A.79 fields preserved** |
| `get_proactive_companion_engine_card()` | Extended with compact blueprint metadata |

Migration: `supabase/migrations/20260972000000_implementation_blueprint_phase25_proactive_assistance.sql`  
Base engine: `20260924000000_proactive_companion_engine_phase_a79.sql`

## Integration links

Companion Presence A.67 · ILM proactive guidance · Notification Communication A.17 · Command Center A.26 · Quality Guardian A.13 · Support AI A.7 · Knowledge Center A.5 · Unified Tasks A.62 · Executive Insights A.35 · Dedication Engine A.91 · Desktop Companion Phase 20 · Self Love A.76

## Vision phrases

- Move from reactive assistance to intentional leadership — glad Aipify brought that early.
- The most valuable assistance arrives before difficulties escalate — proactive, not intrusive.
- Preparation creates confidence — best companions help prepare before emergencies.
- Developments surface early; proactive resolution reduces urgency and builds trust.
- Peace of mind through timely guidance — helpful never overwhelming.
