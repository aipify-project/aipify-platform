# Implementation Blueprint Phase 25 — Proactive Assistance Engine FAQ

## What is Phase 25 of the Implementation Blueprint?

Phase 25 aligns the Proactive Companion Engine (Phase A.79) with ABOS preparation standards — timely, valuable support before users ask, while preserving human control, trust, and existing A.79 categories.

## How is this different from Companion Presence (A.67)?

**Companion Presence A.67** at `/app/settings/companion-presence` is the floating orb heartbeat indicator. **Proactive Companion A.79** at `/app/proactive-companion-engine` generates organizational proactive nudges across five categories. Phase 25 extends A.79 — do not duplicate the orb.

## How is this different from ILM proactive guidance?

**ILM proactive guidance** in `lib/internal-language-model/proactive-guidance.ts` provides assistant language patterns for chat. **Proactive Companion Engine** manages org-level nudges, preferences, and audit. Phase 25 extends A.79 RPCs — distinct surfaces.

## What is the core philosophy?

**The most valuable assistance arrives before difficulties escalate — proactive, not intrusive.** Best companions help prepare before emergencies.

## What proactive objectives does Phase 25 cover?

Early risk detection, opportunity identification, reminder generation, workflow improvement suggestions, follow-up recommendations, and knowledge gap awareness — from `_paebp_blueprint_proactive_objectives()`.

## What proactive examples are documented?

Support (volumes, response times, repeated concerns), operational (deadlines, workloads, bottlenecks), knowledge (documentation gaps, article review), and executive (opportunities, trends, milestones) — metadata from `_paebp_blueprint_proactive_examples()`.

## What companion examples are included?

🦉 Trend deserves attention · 🌹 Opportunity to simplify · 🔔 Small intervention prevents bottleneck · ❤️ Three priorities that matter most.

## What boundaries should Aipify avoid?

Excessive recommendations, fear-driven messaging, notification overload, acting without approvals, and surveillance — from `_paebp_blueprint_boundaries()`. Phase A.79 categories and preferences are preserved.

## How does Self Love connect?

Self Love prevents crises, encourages preparation, supports healthier workloads, and reduces urgency — peace of mind, not constant alerts. Route: `/app/self-love-engine` — principle only.

## What should users understand about trust?

Why recommendations appear, which signals contributed, uncertainty acknowledged, and actions optional. Nudges suggest; users dismiss, snooze, or act.

## What are the Phase 25 success criteria?

Computed live by `_paebp_blueprint_success_criteria(org_id, user_id)`: early surfacing, proactive resolution, recommendation quality, low notification fatigue, trust transparency, objectives, examples, companion examples, Self Love connection, boundaries, integration links, and engine enabled.

## What does engagement summary show?

Live counts from `organization_proactive_nudges`, settings, and audit logs via `_paebp_engagement_summary(org_id, user_id)` — counts only, no PII.

## Where does dogfooding happen?

**Aipify Group AS** validates executive awareness, support health, knowledge maintenance, and task follow-up internally. **Unonight** is the first external pilot for commerce and support proactive assistance.

## Where is the dashboard?

`/app/proactive-companion-engine` — RPCs `get_proactive_companion_engine_dashboard()` and `get_proactive_companion_engine_card()`.

Migration: `supabase/migrations/20260972000000_implementation_blueprint_phase25_proactive_assistance.sql`
