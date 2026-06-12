# Implementation Blueprint Phase 20 — Desktop Companion Engine FAQ

## What is Phase 20 of the Implementation Blueprint?

Phase 20 aligns the Desktop Companion (Phase 61) with ABOS Desktop Companion Engine requirements — companion objectives, mini panel capabilities, notification principles, Self Love cross-links, trust transparency, and live success criteria.

## How is this different from Desktop Command Center?

| Surface | Route | Purpose |
|---------|-------|---------|
| **Desktop Companion Phase 61** | `/app/desktop` | Web companion — notifications, reminders, mini-chat, blueprint dashboard |
| **Desktop Command Center Phase 27** | `/app/command-center` | Native Tauri desktop client — presence and command center |
| **Proactive Companion A.79** | `/app/proactive-companion-engine` | Observes and recommends — desktop delivers notifications |
| **Companion Presence A.67** | `/app/companion-presence-indicator-engine` | Presence indicator — distinct surface |

## What are the companion experiences?

- 🌹 **Morning summary** — calm start-of-day context
- 🔔 **Small victory** — celebrate steady progress
- 🦉 **Developments worth attention** — thoughtful surfacing before reviews
- ❤️ **Self Love busy week** — suggest breaks during intense periods

## What is the Mini Companion Panel?

Six capability blocks: ask anything, tasks, notifications, Knowledge Center, support queues, and executive summaries — each cross-linked to the appropriate engine route.

## What are the notification principles?

Helpful, contextual, configurable, and respectful. Desktop Companion avoids excessive interruptions, constant urgency, and overload through modes (Silent, Balanced, Active Assistant, Focus), quiet hours, daily caps, and dedupe windows.

## What is the Self Love connection?

Self Love supports sustainable productivity — breaks, celebrate progress, reduce stress. Cross-linked to `/app/self-love-engine` as a principle, not a feature toggle. No ™ in product copy.

## How is trust maintained?

Users see source modules for each notification, can explain why they were notified, and adjust preferences. Audit events via `_tacc_log_audit()` — metadata only, no email, chat, orders, or PII.

## What is Since Last Time on the desktop dashboard?

When organization context is available, the dashboard reuses `_ocf_since_last_time_summary()` from Operations Center A.32 — support resolutions, KC updates, tasks, bottlenecks, bell moments. Counts only.

## What are the Phase 20 success criteria?

Preferences configured, four modes available, natural engagement, appropriate surfacing, productivity support, notification fatigue controls, Since Last Time when org context exists, companion experiences documented, trust transparency, and metadata-only privacy — computed live on the engine dashboard.

## Where does Unonight fit?

Unonight is the first external pilot for operational companion use — pilot events, support awareness, knowledge gaps, and calm notification modes. Aipify Group validates internally first.

## Does Phase 20 add new database tables?

No. Phase 20 extends `get_desktop_companion_engine_dashboard()` and `get_desktop_companion_card()` with blueprint metadata, `_dcbp_engagement_summary()`, and `_dcbp_blueprint_success_criteria()` only.
