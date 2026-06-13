# Implementation Blueprint — Phase 20: Desktop Companion Engine

**Feature owner:** Customer App  
**Implementation:** [Desktop Companion — Phase 61](./DESKTOP_COMPANION.md)

This document defines **Phase 20 — Desktop Companion Engine** of the Aipify Business Operating System (ABOS). It aligns the existing Desktop Companion with ABOS companion standards — accessible support, calm awareness, and assistance throughout the workday.

> **Mapping:** ABOS Implementation Blueprint Phase 20 maps to **Desktop Companion Phase 61** at `/app/desktop`. Do not duplicate Command Center, Proactive Companion, or Companion Presence — extend Phase 61 RPCs, dashboard, and ILM vocabulary only.

## Mission

Accessible desktop companion — support, awareness, and assistance throughout the workday; available when needed, not intrusive.

## Core philosophy

**Support available naturally; present without demanding attention.** Best companions contribute meaningfully when needed — they do not compete for attention.

## Companion objectives

| Objective | Description |
|-----------|-------------|
| **Quick conversations** | Mini-chat and ask-anything panel for natural support |
| **Since Last Time** | Metadata trends since last visit — reuses Operations Center pattern when org context available |
| **Task awareness** | Reminders and unified tasks cross-link without constant urgency |
| **Support notifications** | Contextual support queue signals — helpful and configurable |
| **Bell Moments** | Small victories and celebration — never alarmist |
| **Recognition** | Gratitude cross-links — celebrate progress sustainably |
| **Knowledge search** | KC gaps and articles surfaced when relevant |
| **Executive insights** | Briefing and executive summaries — present without demanding attention |

## Companion experiences

Metadata examples from `_dcbp_blueprint_companion_experiences()`:

| Emoji | Experience | Example |
|-------|------------|---------|
| 🌹 | Morning summary | Good morning — here is what matters today |
| 🔔 | Small victory | Team closed three high-priority tasks since yesterday |
| 🦉 | Developments worth attention | Before your review — quality and integration signals surfaced |
| ❤️ | Self Love busy week | It has been a busy week — would a short break help? |

## Mini Companion Panel

Six capability blocks from `_dcbp_blueprint_mini_panel_capabilities()`:

| Capability | Route |
|------------|-------|
| Ask anything | `/app/desktop` |
| Tasks | `/app/unified-task-follow-up-engine` |
| Notifications | `/app/desktop/history` |
| Knowledge Center | `/app/knowledge-center-engine` |
| Support queues | `/app/support-ai-engine` |
| Executive summaries | `/app/executive-insights-engine` |

## Notification principles

Helpful, contextual, configurable, and respectful — avoid excessive interruptions, constant urgency, and overload.

- **Helpful** — explainable source modules and recommendations
- **Contextual** — mode-aware delivery (Silent, Balanced, Active Assistant, Focus)
- **Configurable** — quiet hours, category filters, max per day, dedupe window
- **Respectful** — never alarmist; critical may bypass quiet hours

## Self Love connection

Self Love supports sustainable productivity:

- Suggest breaks during busy weeks — never judgmental
- Celebrate progress via Bell Moments
- Reduce stress — calm summaries instead of alarmist dashboards
- Sustainable productivity — modes and quiet hours respect focus time

Route: `/app/self-love-engine` — principle only, not a feature toggle. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md) (no ™).

## Trust connection

Desktop Companion must stay **transparent**:

- Users understand which source module contributed each notification
- Why notifications occur — `explain_desktop_notification()` with severity and recommendation
- How to adjust preferences — quiet hours, modes, category filters
- Tenant isolation — never cross-tenant data

## Configuration options

Cross-linked settings (do not duplicate):

| Setting | Route |
|---------|-------|
| Notification preferences | `/app/desktop/settings` |
| Humor levels | `/app/personality` |
| Bell Moments / recognition | `/app/gratitude-recognition-engine` |
| Companion tone | `/app/personality` |
| Quiet hours | `/app/desktop/settings` |
| Proactive companion prefs | `/app/proactive-companion-engine` |

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Desktop Command Center Phase 27** | `/app/command-center` | Native Tauri desktop client |
| **Proactive Companion A.79** | `/app/proactive-companion-engine` | Observes and recommends |
| **Companion Presence A.67** | `/app/companion-presence-indicator-engine` | Presence indicator |
| **Operations Center A.32** | `/app/operations-center-foundation-engine` | Since Last Time pattern reused |
| **Briefing Phase 60** | `/app/briefing` | Already in `get_desktop_companion_card()` |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — executive awareness, daily planning, support ops, knowledge surfacing |
| **Unonight** | First external pilot — operational companion for commerce support |

## Success criteria (live)

Computed by `_dcbp_blueprint_success_criteria()`:

1. Companion preferences configured
2. Four notification modes available
3. Natural engagement — enabled with mode-aware delivery
4. Appropriate surfacing — briefing and category filters
5. Productivity support — reminders and briefing
6. Notification fatigue controls — max per day and dedupe
7. Since Last Time when org context available
8. Companion experiences documented
9. Trust transparency — explain and audit available
10. Metadata-only privacy enforced

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_dcbp_engagement_summary(tenant_id, user_id)` | Live counts from desktop tables |
| `_dcbp_blueprint_success_criteria(tenant_id, user_id)` | Live structural checks |
| `get_desktop_companion_engine_dashboard()` | Full blueprint dashboard |
| `get_desktop_companion_card()` | Extended with compact blueprint metadata — **all Phase 61 fields preserved** |

Migration: `supabase/migrations/20260967000000_implementation_blueprint_phase20_desktop_companion.sql`  
Base engine: `supabase/migrations/20260615000000_desktop_companion_phase61.sql`

## Integration links

Command Center Phase 27 · Proactive Companion A.79 · Companion Presence A.67 · Operations Center A.32 · Unified Tasks A.62 · Support AI A.7 · Knowledge Center A.5 · Executive Insights A.35 · Personality Phase 8 · Gratitude A.89 · Self Love A.76 · Briefing Phase 60

## Vision phrases

- Trusted presence throughout the workday — support within reach without demanding attention.
- Best companions contribute meaningfully when needed — they do not compete for attention.
- Available when needed, not intrusive — calm notifications, explainable sources, user-controlled modes.
- Since Last Time — pick up where you left off with trends, not noise.
- Sustainable productivity — celebrate progress, suggest breaks, reduce notification fatigue.
