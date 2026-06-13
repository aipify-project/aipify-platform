# Innovation Lab & Experimentation Engine — Phase 96

## Vision

**Innovation without chaos.**

Aipify shall foster experimentation in a manner that is structured, measurable and aligned with customer value.

## Distinction from Decision Lab

| Feature | `/app/simulations` (Decision Lab) | `/app/innovation-lab` (Phase 96) |
|---------|-----------------------------------|----------------------------------|
| Purpose | Strategic decision simulation | Idea validation & feature experimentation |
| Focus | What-if scenarios | Controlled pilots, feature flags, co-creation |
| Outcome | Decision recommendations | Validated innovations ready for rollout |

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260625000000_innovation_lab_experimentation_phase96.sql` |
| Lib | `lib/aipify/innovation-lab/` |
| API | `/api/aipify/innovation-lab/*` |
| UI | `/app/innovation-lab` — Innovation Lab hub |
| KC FAQ | `content/knowledge/aipify/innovation-experimentation/faq/innovation-lab-faq.md` |

## Lab structure

1. **Idea Management** — structured collection from employees, customers, partners, analytics
2. **Experimentation Management** — hypothesis → design → execution → analysis → recommendation
3. **Pilot Programs** — limited customer participation with success criteria
4. **Validation Frameworks** — scorecards and measurement planning
5. **Innovation Governance** — approvals, risk assessments, ethical evaluations

## Database tables

- `innovation_lab_settings` — tenant lab configuration
- `innovation_ideas`, `innovation_idea_reviews`
- `innovation_experiments`, `innovation_experiment_hypotheses`
- `innovation_pilot_programs`, `innovation_pilot_feedback`
- `innovation_feature_flags`, `innovation_scorecards`
- `innovation_lessons_learned`, `innovation_briefings`, `innovation_audit_log`

## RPCs

- `get_innovation_lab_dashboard()` — full innovation lab dashboard
- `get_innovation_lab_card()` — summary card
- `generate_innovation_lab_briefing()` — executive innovation briefing
- `approve_innovation_idea(uuid)` — approve idea for experimentation
- `advance_innovation_experiment(uuid)` — advance experiment stage

## Integrations

Governance Framework, Marketplace Governance, Academy (methodology training), Partners (co-creation), Simulation Lab (distinct purpose)

## Principle

Progress requires experimentation. Experimentation requires structure. Structure enables sustainable innovation.
