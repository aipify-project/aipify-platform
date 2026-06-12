# Implementation Blueprint Phase 38 — Innovation & Experimentation Lab FAQ

## What is Phase 38 of the Implementation Blueprint?

Phase 38 aligns the Innovation Lab & Experimentation Engine (Phase 96) with ABOS preparation standards — structured experimentation, idea management, learning capture, psychological safety, and governance visibility before broad release.

## How is this different from Simulation & Decision Lab (Phase 78 / Blueprint 22)?

**Simulation & Decision Lab** at `/app/simulations` **predicts** outcomes in an isolated environment — simulation **never acts**. **Innovation Lab** at `/app/innovation-lab` **validates** ideas through controlled experiments, pilots, and feature flags with human approval gates. Phase 38 extends Phase 96 — do not duplicate Simulation Lab workflows.

## What innovation objectives does Phase 38 cover?

Idea generation, experiment tracking, pilot programs, controlled testing, learning documentation, and innovation recognition — from `_ielbp_blueprint_objectives()`.

## How does idea management work?

Submit, categorize, prioritize, collaborate, and monitor status — with example domains for support workflows, Knowledge Center improvements, customer experience enhancements, and process innovations. Metadata from `_ielbp_blueprint_idea_management()`.

## What experimentation principles are required?

Objectives, success criteria, timeframes, risks, evaluation methods, and responsible stakeholders — experiments remain visible. From `_ielbp_blueprint_experimentation_principles()`.

## What companion innovation support examples are included?

🦉 Aligned with priorities · 🌹 Collaboration opportunity · 🔔 Experiment milestone · ❤️ Learning from unsuccessful experiments — failure defines learning, not people.

## How does learning capture connect to Organizational Memory?

Lessons learned capture what worked, what did not, unexpected observations, next steps, and reusable insights — cross-linked to Organizational Memory A.34 at `/app/organizational-memory-engine`. Metadata only, no PII in RPC payloads.

## How does Self Love connect?

Psychological safety, healthy curiosity, celebrate learning, compassion toward imperfection. Route: `/app/self-love-engine` — principle only.

## What recognition experiences are documented?

🔔 Innovation Contributor · 🌹 Collaboration Champion · 🦉 Insight Discovery — effort and learning, not only outcomes. Cross-link Gratitude & Recognition A.89 at `/app/gratitude-recognition-engine`.

## What should users understand about trust?

Experimental vs production separation, documented risks, transparent evaluation, and clear approval ownership via Governance A.14. Innovation audit logs use metadata only.

## What are the Phase 38 success criteria?

Computed live by `_ielbp_blueprint_success_criteria(tenant_id)`: idea pipeline, experiments, pilots, lessons, objectives, experimentation framework, companion examples, Self Love principle, recognition, trust, Simulation Lab distinction, and integration links.

## What does engagement summary show?

Live counts from `innovation_ideas`, `innovation_experiments`, `innovation_pilot_programs`, `innovation_feature_flags`, and `innovation_lessons_learned` via `_ielbp_engagement_summary(tenant_id)` — counts only, no PII.

## Where does dogfooding happen?

**Aipify Group AS** validates governance UX pilots, messaging experiments, and feature flag framework internally. **Unonight** is the first external pilot for support workflow and advisory board co-creation experiments.

## Where is the dashboard?

`/app/innovation-lab` — RPCs `get_innovation_lab_dashboard()` and `get_innovation_lab_card()`.

Migration: `supabase/migrations/20260989000000_implementation_blueprint_phase38_innovation_experimentation_lab.sql`
