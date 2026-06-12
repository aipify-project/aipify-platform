# Implementation Blueprint — Phase 45: Sales Coach & Enablement Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Coach & Enablement**

> **Mapping:** Blueprint Phase 45 extends **Sales Expert OS A.95** — not a separate engine route. Cross-links Self Love A.76, Certification A.37, Learning & Training A.36, and Phase 41 Performance & Recognition (bell moments overlap — reference, don't duplicate).

## Mission

Equip Sales Experts with supportive coaching, enablement guidance, and sustainable pacing — never punitive judgment.

## Core philosophy

**Coaching strengthens confidence. Guidance should inspire thoughtful action. Success should never come at the expense of wellbeing or integrity.**

People thrive when they feel equipped and respected. Coaching should reinforce professional growth, not pressure.

## Sales Companion roles

| Role | Emoji | Focus |
|------|-------|-------|
| **Mentor** | 🌹 | Patient guidance and professional development |
| **Strategist** | 🦉 | Pipeline priorities and thoughtful planning |
| **Motivator** | 🔔 | Encouragement and momentum — never shaming |
| **Companion** | ❤️ | Supportive presence through setbacks |
| **Performance advisor** | 📈 | Transparent metrics — strengths first |

## Coach dashboard fields

Monthly commission overview · New customers · Renewal stats · Conversion rates · Upcoming follow-ups · Scheduled demos · Personal goals · Suggested next actions.

Live summary from `_scebp_coach_summary()` — tenant-scoped customer, opportunity, commission, and follow-up metadata only.

## Daily sales briefing

Supportive morning guidance derived from `_scebp_daily_briefing()`:

- Open opportunities that may benefit from follow-up
- Upcoming follow-ups in the next two weeks
- New customer relationships this month
- Consistency reminder when pipeline is quiet

## Activity recommendations

Supportive suggestions from `_scebp_activity_recommendations()`:

- Contact local businesses
- Thoughtful follow-ups
- Schedule or prepare demos
- Revisit inactive opportunities
- Ask for introductions — always optional

**Never punitive.** Principle embedded in RPC response.

## Field sales coaching

Personal visit · Sector demos · In-person meeting nudges — gentle, never pressure.

## Demonstration guidance

Checklists · Industry talking points · Discovery questions · Recommended next steps.

## Objection handling library

Scaffold examples for:

- "We do not have time"
- "We already use another system"
- "We cannot afford it"
- "We need to think about it"

Honest, professional, customer-focused responses.

## Communication coaching

Email · Meeting prep · Discovery · Follow-up · Proposal guidance.

## Personal performance insights

Strengths and development opportunities from `_scebp_performance_insights()` — encourage growth, never shame.

## Self Love connection (A.76)

Healthy boundaries · Sustainable pacing · Recovery after setbacks.

Route: `/app/self-love-engine`. Coach stores metadata and suggestions only.

## Coach bell moments

First demo · First customer · First renewal · First enterprise opportunity · First year — cross-link Phase 41 `_sprbp_*` milestones where appropriate. Team celebrations remain on Performance tab.

## Sales Training Center integration

Links Training Center tab · Learning & Training A.36 · Certification A.37.

## Roleplay & simulation

Metadata scaffold — practice conversations, demo prep, objection scenarios. Cross-link Simulation Lab Phase 22 at `/app/simulations`.

## Trust connection

Transparent metrics · Optional suggestions · How insights are generated from `_seos_engagement_summary` and `_sprbp_milestone_progress` — metadata only.

## Distinctions

| Surface | Route | Purpose |
|---------|-------|---------|
| Performance & Recognition Phase 41 | `/app/sales-expert-engine` (Performance tab) | Milestones, leaderboards, Recognition Roses |
| Coach & Enablement Phase 45 | `/app/sales-expert-engine` (Coach tab) | Daily coaching, enablement, demo guidance |
| Self Love A.76 | `/app/self-love-engine` | Sustainable pacing and wellbeing |
| Learning & Training A.36 | `/app/learning-training-engine` | Foundations and sales training |

## Dogfooding

Initially serves **Aipify Group** Sales Reps and Experts internally — validates coaching tone before broader rollout.

## Success criteria

Evaluated via `_scebp_blueprint_success_criteria(organization_id)` — companion roles, coach dashboard, daily briefing, activity recommendations, objection library, training integration, Self Love, trust transparency, dogfooding readiness.

## Implementation

- Migration: `20260985000000_implementation_blueprint_phase45_sales_coach_enablement.sql`
- Types/parse: `lib/aipify/sales-expert-operating-system/`
- UI: `components/app/sales-expert-engine/SalesExpertEngineDashboardPanel.tsx` — `CoachEnablementTab`
- ILM: `implementation-blueprint-phase45-sales-coach-enablement.txt`, `implementation-blueprint-phase45-vocabulary.ts`
- i18n: `customerApp.salesExpertEngine.*` in en/no/sv/da
