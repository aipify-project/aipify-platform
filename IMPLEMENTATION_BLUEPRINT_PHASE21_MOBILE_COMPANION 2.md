# Implementation Blueprint — Phase 21: Mobile Companion Engine

**Feature owner:** Customer App  
**Implementation:** [Notification & Communication Engine — Phase A.17](./NOTIFICATION_COMMUNICATION_ENGINE_PHASE_A17.md)

This document defines **Phase 21 — Mobile Companion Engine** of the Aipify Business Operating System (ABOS). It aligns the existing Notification & Communication Engine with ABOS mobile companion standards — thoughtful presence wherever people work, without distraction or overload.

> **Mapping:** ABOS Implementation Blueprint Phase 21 maps to **Notification & Communication Engine Phase A.17** at `/app/notification-communication-engine`. Native mobile app is not built yet (see [DESKTOP_COMMAND_CENTER.md](./DESKTOP_COMMAND_CENTER.md) — mobile future). Phase 21 extends A.17 as the mobile-ready companion communication layer plus mobile dashboard metadata blocks. Cross-link Desktop Companion Phase 61 / Blueprint Phase 20, Companion Presence A.67 (mobile-web orb), Personal Productivity A.70, Command Center Phase 26. Do not duplicate Desktop Companion or native push delivery — extend A.17 RPCs, dashboard, and ILM vocabulary only.

## Mission

Extend Aipify beyond the desk — thoughtful mobile companion experiences; available wherever people work.

## Core philosophy

**Mobile creates clarity, not distraction** — the right information at the right moment. One thoughtful interaction at a time.

## Companion objectives

| Objective | Description | Cross-link |
|-----------|-------------|------------|
| **Since Last Time** | Pick up where you left off — metadata trends | Operations Center A.32 |
| **Mobile notifications** | Relevant, configurable, respectful alerts | This engine A.17 |
| **Support queue awareness** | Contextual support signals | Support AI A.7 |
| **Task follow-up** | Open tasks at the right moment | Unified Tasks A.62 |
| **Executive insights** | Brief highlights without demanding attention | Executive Insights A.35 |
| **Knowledge access** | Approved articles when relevant | Knowledge Center A.5 |
| **Companion conversations** | Thoughtful companion interactions | Proactive Companion A.79 |
| **Recognition** | Gratitude and Bell Moments | Gratitude Recognition A.89 |

## Companion experiences

Metadata examples from `_mcbp_blueprint_companion_experiences()`:

| Emoji | Experience | Example |
|-------|------------|---------|
| 🌹 | Morning attention | Good morning — priorities and support follow-up for today |
| 🔔 | Milestone | Team closed high-priority tasks — steady progress worth noting |
| 🦉 | Strategic development | Executive highlights surfaced before your review |
| ❤️ | Self Love intense week | It has been an intense week — would a quiet moment help? |

## Mobile Dashboard

Simplicity first — metadata blocks from `_mcbp_blueprint_mobile_dashboard()` with live counts (empty-safe):

| Block | Route |
|-------|-------|
| Today's priorities | `/app/personal-productivity-engine` |
| Open tasks | `/app/unified-task-follow-up-engine` |
| Support activity | `/app/support-ai-engine` |
| Executive highlights | `/app/executive-insights-engine` |
| Bell Moments | `/app/gratitude-recognition-engine` |
| Recognition opportunities | `/app/gratitude-recognition-engine` |

## Notification principles

Relevant, configurable, respectful, and timely — avoid excessive urgency, fatigue, and unnecessary interruptions.

- **Relevant** — explainable categories and recommended actions
- **Configurable** — category subscriptions, frequency, quiet hours
- **Respectful** — never alarmist; critical may bypass quiet hours
- **Timely** — immediate, daily digest, or weekly digest

## Self Love connection

Self Love supports sustainable mobile productivity:

- Quiet hours and reflection prompts during intense weeks
- Celebrate progress via Bell Moments — never guilt or pressure
- Sustainable productivity — one thoughtful interaction at a time

Route: `/app/self-love-engine` — principle only, not a feature toggle.

## Trust connection

Mobile Companion must stay **transparent**:

- Why notifications appear — category, priority, recommended action
- What metadata was accessed — counts only, never raw customer content
- How to adjust preferences — categories, frequency, quiet hours
- Future native app — mobile permissions transparency when push ships

## Configuration options

Cross-linked settings (do not duplicate):

| Setting | Route |
|---------|-------|
| Notification categories | `/app/notification-communication-engine` |
| Bell Moments | `/app/gratitude-recognition-engine` |
| Companion tone / humor | `/app/personality` |
| Quiet hours | `/app/notification-communication-engine` |
| Recognition | `/app/gratitude-recognition-engine` |
| Proactive companion | `/app/proactive-companion-engine` |

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Desktop Companion Phase 61** | `/app/desktop` | Desk companion (+ Blueprint Phase 20) |
| **Desktop Command Center Phase 27** | `/app/command-center/connect` | Native Tauri desktop client pairing |
| **Companion Presence A.67** | `/app/settings/companion-presence` | Mobile-web orb |
| **Personal Productivity A.70** | `/app/personal-productivity-engine` | Personal priorities and reminders |
| **Proactive Companion A.79** | `/app/proactive-companion-engine` | Observes and recommends |
| **Operations Center A.32** | `/app/operations-center-foundation-engine` | Since Last Time via `_ocf_since_last_time_summary` |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — leadership awareness, task follow-up, support visibility, executive summaries |
| **Unonight** | First external pilot — operational mobile workflows |

## Success criteria (live)

Computed by `_mcbp_blueprint_success_criteria()`:

1. Companion objectives documented (≥8 categories)
2. Mobile dashboard blocks with live counts
3. Communication preferences configured
4. Reduce friction — actionable notifications
5. Informed without overwhelm — digest and quiet hours
6. Since Last Time when Operations Center function exists
7. Companion experiences (🌹🔔🦉❤️) documented
8. Trust transparency documented
9. Mobile-ready layer on A.17
10. Metadata-only privacy

## Engagement summary (live)

Computed by `_mcbp_engagement_summary(org_id, user_id)` from:

- `organization_communication_notifications` — unread, critical, delivered counts
- `communication_notification_preferences` — frequency, quiet hours, subscribed categories

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_mcbp_blueprint_companion_objectives()` | Eight companion objective categories |
| `_mcbp_blueprint_companion_experiences()` | 🌹🔔🦉❤️ experience examples |
| `_mcbp_blueprint_mobile_dashboard(org_id, user_id)` | Six dashboard blocks with live counts |
| `_mcbp_blueprint_notification_principles()` | Relevant, configurable, respectful, timely |
| `_mcbp_blueprint_self_love_connection()` | Sustainable mobile productivity cross-link |
| `_mcbp_blueprint_trust_connection()` | Transparency and permissions scaffold |
| `_mcbp_blueprint_configuration_options()` | Cross-linked settings |
| `_mcbp_since_last_time(org_id, user_id)` | Wraps `_ocf_since_last_time_summary` when available |
| `_mcbp_engagement_summary(org_id, user_id)` | Live notification engagement counts |
| `_mcbp_blueprint_success_criteria(org_id, user_id)` | Live structural checks |
| `get_notification_communication_engine_dashboard()` | Extended with Phase 21 fields — **all A.17 fields preserved** |
| `get_notification_communication_engine_card()` | Extended with mission and engagement summary |

Migration: `supabase/migrations/20260968000000_implementation_blueprint_phase21_mobile_companion.sql`  
Base engine: `supabase/migrations/20260722000000_notification_communication_engine_phase_a17.sql`

## Integration links

Desktop Companion Phase 61 · Command Center Connect · Companion Presence A.67 · Personal Productivity A.70 · Proactive Companion A.79 · Operations Center A.32 · Unified Tasks A.62 · Support AI A.7 · Knowledge Center A.5 · Executive Insights A.35 · Personality · Gratitude Recognition A.89 · Self Love A.76

## Vision phrases

- Trusted presence throughout the day — traveling, meetings, away from desk.
- Mobile creates clarity, not distraction — right information at the right moment.
- One thoughtful interaction at a time — companionship not limited to a desk.
- Informed without overwhelm — relevant, configurable, respectful notifications.
- Support travels with people who need it — wherever work happens.

## ABOS principle

> **Companionship is not limited to a desk — support travels with people who need it.**
