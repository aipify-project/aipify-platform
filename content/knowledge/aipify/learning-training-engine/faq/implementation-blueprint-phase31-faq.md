# Implementation Blueprint Phase 31 — Training & Certification Engine FAQ

## What is Phase 31 of the Implementation Blueprint?

Phase 31 aligns the Learning & Training Engine (Phase A.36) with ABOS guided learning and certification standards — competence, confidence, and practical adoption.

## Which engine is the primary surface?

**Learning & Training Engine Phase A.36** at `/app/learning-training-engine`. Certification pathways cross-link **Certification & Achievement Engine Phase A.37** at `/app/certification-achievement-engine`. Phase 31 extends A.36 RPCs — do not duplicate a separate engine.

## How is A.36 different from the Learning Engine at /app/learning?

**Learning Engine Phase 65/29** at `/app/learning` handles operational learning from feedback and metadata (`customer_learning_memory`). **A.36** provides user education paths for module adoption — distinct purposes.

## What blueprint learning paths are documented?

Aipify Foundations (all users), Support Specialist Certification, Executive Companion Certification, and Administrator Certification — from `_tcbp_blueprint_learning_paths()`, mapped to existing `learning_paths` path_keys.

## What training objectives does Phase 31 cover?

Self-paced learning, guided onboarding, role-based paths, interactive experiences, companion-assisted education, and certification opportunities — from `_tcbp_blueprint_training_objectives()`.

## What certification principles apply?

Completion requirements, knowledge assessments, practical demonstrations, and recertification — meaningful competence via A.37, from `_tcbp_blueprint_certification_principles()`.

## What companion learning examples are documented?

🌹 Excellent progress · 🔔 Learning milestone · 🦉 Practice makes easier · ❤️ Mastery over time — from `_tcbp_blueprint_companion_examples()`.

## How does Self Love connect?

Sustainable learning — encourage patience, normalize mistakes, celebrate progress, reduce fear of failure. Route `/app/self-love-engine`, principle only.

## How does Knowledge Center connect?

Training modules reference KC articles via `content_ref` — FAQs, procedures, organizational knowledge at `/app/knowledge-center-engine`.

## What are the Phase 31 success criteria?

Computed live by `_tcbp_blueprint_success_criteria(org_id, user_id)`: onboarding success, learning confidence, certification value, adoption acceleration, long-term success, and documented objectives/paths.

## What does engagement summary show?

Live counts from `user_learning_progress`, `learning_paths`, `training_assessments`, and certification tables via `_tcbp_engagement_summary()` — counts only, no PII.

## Where does dogfooding happen?

**Aipify Group** validates employee onboarding, product understanding, support readiness, and executive enablement. **Unonight** is the first external pilot.

## Where is the dashboard?

`/app/learning-training-engine` — RPCs `get_learning_training_engine_dashboard()` and `get_learning_training_engine_card()`.

Migration: `supabase/migrations/20260978000000_implementation_blueprint_phase31_training_certification.sql`
