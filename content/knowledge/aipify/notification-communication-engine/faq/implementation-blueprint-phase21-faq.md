# Implementation Blueprint Phase 21 — Mobile Companion Engine FAQ

## What is Phase 21 of the Implementation Blueprint?

Phase 21 aligns the Notification & Communication Engine (Phase A.17) with ABOS mobile companion requirements — thoughtful presence wherever people work, without distraction or overload.

## How is this different from Desktop Companion (Phase 61 / Blueprint Phase 20)?

**Desktop Companion** at `/app/desktop` focuses on desk-side companion experiences. **Mobile Companion Phase 21** extends **Notification & Communication Engine A.17** as the mobile-ready communication layer. Native mobile app is not built yet — A.17 provides metadata, dashboard blocks, and preferences now.

## What companion objectives does Phase 21 cover?

Since Last Time, mobile notifications, support queue awareness, task follow-up, executive insights, knowledge access, companion conversations, and recognition — cross-linked to existing engines, not duplicated.

## What are the mobile dashboard blocks?

Today's priorities, open tasks, support activity, executive highlights, Bell Moments, and recognition opportunities — live counts from existing tables with empty-safe `to_regclass` checks.

## What companion experiences are documented?

🌹 Morning attention · 🔔 Milestone · 🦉 Strategic development · ❤️ Self Love intense week — examples in `_mcbp_blueprint_companion_experiences()`.

## How does Since Last Time work?

`_mcbp_since_last_time()` wraps `_ocf_since_last_time_summary()` from Operations Center Phase 18 when that function exists — counts only, no PII.

## How does Self Love connect?

Self Love supports sustainable mobile productivity — quiet hours, reflection prompts, celebrate progress. Route: `/app/self-love-engine`. Principle only — Mobile Companion does not store wellbeing content.

## What should users understand about trust?

Why notifications appear, what metadata was accessed, how to adjust preferences, and future mobile permissions transparency when native push ships.

## What are the Phase 21 success criteria?

Computed live: companion objectives documented, mobile dashboard blocks, preferences configured, friction reduction, informed without overwhelm, Since Last Time when available, companion experiences, trust transparency, mobile-ready layer, metadata-only privacy.

## What does engagement summary show?

Live counts from `organization_communication_notifications` and `communication_notification_preferences` — unread, critical, delivered, frequency, quiet hours, subscribed categories.

## Where does dogfooding happen?

**Aipify Group** validates leadership awareness, task follow-up, support visibility, and executive summaries. **Unonight** pilots operational mobile workflows.

## Where is the dashboard?

`/app/notification-communication-engine` — RPCs `get_notification_communication_engine_dashboard()` and `get_notification_communication_engine_card()`.

Migration: `supabase/migrations/20260968000000_implementation_blueprint_phase21_mobile_companion.sql`
