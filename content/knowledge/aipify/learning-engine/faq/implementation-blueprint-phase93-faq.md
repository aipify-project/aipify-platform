# Implementation Blueprint Phase 93 — Adaptive Learning & Organizational Capability Engine FAQ

## What is Phase 93 of the Implementation Blueprint?

Phase 93 extends the Learning Engine (Phase 65 + Phase 29 + Blueprint Phase 23) with adaptive learning and organizational capability standards — capability signal detection, adaptive pathways, companion-guided coaching, and empowerment-first privacy.

## Which engine is the primary surface?

**Learning Engine Phase 65/29** at `/app/learning`. Phase 93 extends existing RPCs alongside Blueprint Phase 23 — do not duplicate a separate engine or route.

## How is Phase 93 different from Phase 23?

**Blueprint Phase 23** focuses on operational learning adaptation — feedback loops, adaptation principles, and learning sources. **Phase 93** focuses on adaptive capability needs, daily-work learning capture, organizational capability pathways, and empowerment not surveillance. Both live on the same `/app/learning` route.

## What phase number collisions exist?

| Surface | Route |
|---------|-------|
| Adaptive Learning Blueprint Phase 93 | `/app/learning` |
| Billing & Commercial (Repo Phase 93) | `/app/commercial` |
| Wisdom Engine (Phase A.93) | `/app/wisdom-engine` |
| Learning & Training A.36 / Phase 92 | `/app/learning-training-engine` |

## What learning signals are documented?

Support requests, mistakes & corrections, strategic initiatives, new technology, Sales Expert observations, and customer feedback trends — from `_alocbp93_learning_signals()`.

## What capability questions are documented?

🦉 Capability gaps · 🌹 Learning progress · ❤️ Empowering learning · 🔔 Adaptive pathways — from `_alocbp93_capability_questions()`.

## What adaptive learning pathways are available?

Micro-learning, Knowledge Center recommendations, companion-guided coaching, peer learning, simulation-based, and leadership pathways — from `_alocbp93_adaptive_learning_pathways()`.

## What is companion-guided coaching?

**Companion-guided coaching** — growth not compliance. Aipify observes capability signals and suggests adaptive pathways; humans decide whether and when to learn. Not an "AI coach." From `_alocbp93_companion_guidance()`.

## What privacy principles apply?

No surveillance-based mandatory learning, no hidden evaluations, no public ranking, no punishment framing — empowerment not control. From `_alocbp93_privacy_principles()`.

## How does Self Love connect?

Normalize learning curves, celebrate progress, reduce fear of mistakes — principle only at `/app/self-love-engine` (A.76).

## How does community learning connect?

Peer insights via Community Phase 89 at `/app/community` — voluntary participation, no public leaderboards.

## What are the Phase 93 success criteria?

Computed live by `_alocbp93_success_criteria(tenant_id)`: capability detection, adaptive pathways, companion guidance, knowledge reinforcement, community learning, leadership insights, privacy, trust, and cross-links.

## What does engagement summary show?

Signal counts, pathway scaffolds, and operational learning engagement via `_alocbp93_engagement_summary()` — metadata only, no surveillance tracking.

## Where does dogfooding happen?

**Aipify Group** validates Sales Expert Academy, leadership development, product capability, Meeting Companion, and KC evolution. **Unonight** is the first external pilot.

## Where is the dashboard?

`/app/learning` — RPCs `get_learning_engine_dashboard()` and `get_learning_engine_card()`.

Migration: `supabase/migrations/20261116000000_implementation_blueprint_phase93_adaptive_learning_organizational_capability.sql`
