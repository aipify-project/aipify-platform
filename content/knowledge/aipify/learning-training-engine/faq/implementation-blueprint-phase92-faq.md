# Implementation Blueprint Phase 92 — Human Potential & Talent Development Engine FAQ

## What is Phase 92 of the Implementation Blueprint?

Phase 92 extends the Learning & Training Engine (Phase A.36) with human potential and talent development standards — strength-based development, Career Companion support, talent mobility, and empowerment-first privacy.

## Which engine is the primary surface?

**Learning & Training Engine Phase A.36** at `/app/learning-training-engine`. Phase 92 extends A.36 RPCs alongside Blueprint Phase 31 — do not duplicate a separate engine.

## How is Phase 92 different from Phase 31?

**Blueprint Phase 31** focuses on training and certification competence. **Phase 92** focuses on human potential — strength discovery, career development, talent mobility, and empowerment not control. Both live on the same A.36 route.

## What phase number collisions exist?

| Surface | Route |
|---------|-------|
| Human Potential Blueprint Phase 92 | `/app/learning-training-engine` |
| Enterprise Deployment Framework (Repo Phase 92) | `/app/enterprise/framework` |
| Hope Engine (Phase A.92) | `/app/hope-engine` |

## What development questions are documented?

🦉 Strengths emerging · 🌹 Learning milestones · ❤️ Supportive development · 🔔 Interest-led pathways — from `_hptdbp92_development_questions()`.

## What is Career Companion support?

**Career Companion** — development not evaluation. Aipify informs and prepares; humans decide pace. Not an "AI coach." From `_hptdbp92_career_companion_support()`.

## What learning pathways are documented?

Onboarding (EKE cross-link), role-specific, leadership development, Sales Expert certification (A.95), and cross-functional exposure — from `_hptdbp92_learning_pathways()`.

## What privacy principles apply?

No hidden scoring, no forced pathways, no reducing to metrics alone, no unfair comparison — empowerment not control. From `_hptdbp92_privacy_principles()`.

## How does Self Love connect?

Sustainable development pace, patient mastery, celebration of progress — principle only at `/app/self-love-engine` (A.76).

## How does Recognition connect?

Learning milestones, resilience through learning, meaningful contributions — cross-link Gratitude & Recognition A.89 at `/app/gratitude-recognition-engine`.

## What are the Phase 92 success criteria?

Computed live by `_hptdbp92_success_criteria(org_id, user_id)`: strength discovery, capability development, Career Companion support, talent mobility, recognition, privacy, trust, and cross-links.

## What does engagement summary show?

Pathway counts, development scaffold dimensions, and training engagement via `_hptdbp92_engagement_summary()` — metadata only, no hidden scoring.

## Where does dogfooding happen?

**Aipify Group** validates Sales Expert growth, leadership development, product team learning, and companion stewardship. **Unonight** is the first external pilot.

## Where is the dashboard?

`/app/learning-training-engine` — RPCs `get_learning_training_engine_dashboard()` and `get_learning_training_engine_card()`.

Migration: `supabase/migrations/20261115000000_implementation_blueprint_phase92_human_potential_talent_development.sql`
