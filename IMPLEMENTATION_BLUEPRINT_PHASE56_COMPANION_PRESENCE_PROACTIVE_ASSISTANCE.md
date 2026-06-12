# Implementation Blueprint — Phase 56: Companion Presence & Proactive Assistance Engine

**Feature owner:** Customer App  
**Implementation:** [Proactive Companion Engine — Phase A.79](./PROACTIVE_COMPANION_ENGINE_PHASE_A79.md)  
**Builds on:** [Phase 25 — Proactive Assistance Engine](./IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_ASSISTANCE.md)

This document defines **Phase 56 — Companion Presence & Proactive Assistance Engine** of the Aipify Business Operating System (ABOS). It unifies companion presence awareness with proactive assistance framing on the existing Proactive Companion Engine — thoughtful availability without surveillance, guidance without pressure.

> **Mapping:** ABOS Implementation Blueprint Phase 56 maps to **Proactive Companion Engine Phase A.79** at `/app/proactive-companion-engine`. Builds on Phase 25 (`_paebp_*` helpers). Do not duplicate Companion Presence A.67 orb UI, TAG focus mode, Personal Productivity A.70, or Notification Communication A.17 delivery — extend A.79 RPCs, dashboard, and ILM vocabulary only.

## Mission

Unify companion presence awareness with responsible proactive assistance — timely guidance that observes context, respects preferences, and prepares humans before urgency arrives.

## Core philosophy

**Presence means being thoughtfully available — not always visible.** Aipify observes operational context, recognizes help opportunities, and offers respectful nudges without interruption, fear, or dependency.

## ABOS principle

**Aipify Business Operating System (ABOS) companions observe, inform, and recommend — humans decide.** Companion presence and proactive assistance work together: awareness without surveillance, guidance without pressure.

## Phase 56 objectives

| Objective | Description |
|-----------|-------------|
| **Proactive recommendations** | Surface timely suggestions from metadata patterns — explainable, optional, never auto-executed |
| **Contextual reminders** | Gentle reminders aligned with calendar, tasks, and operational context |
| **Timely assistance** | Offer help before difficulties escalate — preparation creates confidence |
| **Prioritization** | Highlight what matters most today — calm focus without guilt |
| **Human nudges** | Respectful interventions — dismiss, snooze, or act; never silent execution |
| **Respectful interventions** | Honor quiet hours, frequency caps, and Self Love pacing |

## Companion presence principles

From `_cpaebp_companion_presence_principles()`:

- **Observe** — metadata summaries across operational, support, knowledge, and executive signals
- **Recognize** help opportunities — preparation windows before deadlines and bottlenecks
- **Respect** preferences — frequency, channels, quiet hours, category toggles
- **User control** — every nudge optional; high-risk actions require explicit approval

**Should avoid:** unnecessary interruptions, fear-driven messaging, dependency framing, surveillance, auto-execution.

## Proactive support examples

| Emoji | Scenario | Example |
|-------|----------|---------|
| 🦉 | Trend before escalation | Support response times rose — trend deserves attention before backlog grows |
| 🌹 | Opportunity to prepare | Renewal review window opens — metadata summary prepared |
| 🔔 | Gentle deadline reminder | Two commitments share a deadline — handoff now may prevent bottleneck |
| ❤️ | Priorities with peace | Before your meeting — three priorities that matter most today |

## Operational awareness (awareness not control)

| Domain | Signals | Route |
|--------|---------|-------|
| **Support** | Queue trends, escalation readiness, topic clusters | `/app/support-ai-engine` |
| **Deadlines** | Due dates, overdue risk, shared deadline conflicts | `/app/unified-task-follow-up-engine` |
| **Commitments** | SLA windows, meeting preparation, handoffs | `/app/meeting-collaboration-intelligence-engine` |
| **Renewals** | Subscription windows, contract review, expansion readiness | `/app/sales-expert-engine` |
| **Approvals** | Pending counts, Trust & Action queue, workflow bottlenecks | `/app/approvals` |
| **Knowledge review** | Articles needing review, documentation gaps | `/app/knowledge-center-engine` |

Workflow Phase 40 (`/app/workflow-orchestration-engine`) owns orchestration approval tiers — Phase 56 surfaces awareness only.

## Sales Expert connection

Proactive awareness for pipeline preparation, engagement follow-up, and renewal windows — metadata nudges only. Sales Expert OS owns workflows at `/app/sales-expert-engine`.

## Executive connection

Strategic opportunities, briefing preparation, and leadership alignment cues (📈🦉🌹) — metadata only. Executive Insights A.35 at `/app/executive-insights-engine`.

## Self Love wellbeing proactivity

Sustainable pacing, reduced urgency, peace of mind. Fatigue signals may reduce nudge frequency. Route: `/app/self-love-engine` — principle only. Ethics Phase 54 cross-linked for companion safety.

## Presence settings

Cross-links proactive companion preferences with Companion Presence A.67 metadata:

| Setting | Source |
|---------|--------|
| Frequency, channels, quiet hours | `organization_proactive_companion_user_preferences` |
| Priority categories, daily cap | `organization_proactive_companion_settings` |
| Orb indicator, heartbeat, quiet mode | `companion_presence_settings` / `companion_presence_user_preferences` |

Escalation: low/normal respects quiet hours; high may surface in Command Center; critical through Notification Engine; high-risk via Trust & Action `/app/approvals`.

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Companion Presence A.67** | `/app/settings/companion-presence` | Floating orb heartbeat — Phase 56 is guidance layer, not orb UI |
| **Desktop Presence Phase 25** | Notification infrastructure | Delivery foundation — not nudge generation |
| **Attention Guardian TAG** | `/app/assistant/attention` | Personal focus mode |
| **Personal Productivity A.70** | `/app/personal-productivity-engine` | Individual productivity — distinct from org nudges |
| **Command Center A.26** | `/app/command-center` | Executive feed — consumes proactive signals |
| **Notification Communication A.17** | `/app/notification-communication-engine` | Delivery channels |
| **Ethics Phase 54** | `/app/ai-ethics-responsible-use-engine` | Companion ethics and emotional safety |
| **Workflow Phase 40** | `/app/workflow-orchestration-engine` | Orchestration approval tiers |

## Trust connection

- Why nudges appear and which signals contributed
- Presence summary shows counts — no activity content
- Quiet hours and preferences fully under user control
- High-risk suggestions route to Trust & Action — never auto-execute
- Ethics Phase 54 companion governance cross-linked

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — unified presence awareness, executive preparation, support health, approval queue awareness |
| **Unonight** | First external pilot — commerce support, renewal preparation, sales engagement awareness |

## Presence summary (live)

Computed by `_cpaebp_presence_summary(org_id)` from `organization_proactive_nudges` and `companion_presence` — counts only, no PII.

## Success criteria (live)

Computed by `_cpaebp_blueprint_success_criteria(org_id, user_id)`:

1. Presence + proactive assistance unified on A.79
2. Companion presence principles documented
3. Phase 56 objectives documented
4. Proactive support examples (🦉🌹🔔❤️)
5. Operational awareness domains documented
6. Sales Expert and Executive connections
7. Presence settings cross-linked
8. Developments surface early
9. Proactive resolution
10. Low notification fatigue
11. Trust in proactive guidance
12. Self Love wellbeing proactivity
13. Integration links distinct
14. Engine enabled
15. Presence summary live

**Phase 25 success criteria** remain available via `_paebp_blueprint_success_criteria()` on dashboard as `success_criteria`.

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `get_proactive_companion_engine_dashboard()` | Full dashboard — A.79 + Phase 25 + Phase 56 fields |
| `get_proactive_companion_engine_card()` | Summary card with presence summary |
| `_cpaebp_presence_summary(org_id)` | Nudge + companion device counts |
| `_cpaebp_*` helpers | Phase 56 blueprint metadata |

Migration: `supabase/migrations/20261006000000_implementation_blueprint_phase56_companion_presence_proactive_assistance.sql`

## Related documentation

- [PROACTIVE_COMPANION_ENGINE_PHASE_A79.md](./PROACTIVE_COMPANION_ENGINE_PHASE_A79.md)
- [IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_ASSISTANCE.md](./IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_ASSISTANCE.md)
- [IMPLEMENTATION_BLUEPRINT_PHASE54_ETHICS_SAFETY_COMPANION_GOVERNANCE.md](./IMPLEMENTATION_BLUEPRINT_PHASE54_ETHICS_SAFETY_COMPANION_GOVERNANCE.md)
- [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md)
- FAQ: `content/knowledge/aipify/proactive-companion-engine/faq/implementation-blueprint-phase56-faq.md`
