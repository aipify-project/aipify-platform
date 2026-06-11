# Experience, Adoption & Human Success Engine — Phase 82

Build an Experience, Adoption & Human Success Engine that ensures Aipify is not only powerful, but understandable, valuable and embraced by the people using it.

## Core principle

**Technology succeeds when people succeed.**

Aipify should encourage, educate, guide, and celebrate progress.

Aipify must never shame users, publicly rank employees, use hidden productivity scoring, create unnecessary pressure, or manipulate behavior.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/human-success` | Adoption score, Human Success score, onboarding, journeys, friction, champions |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/human-success/card` | `get_human_success_card` |
| `GET /api/aipify/human-success/dashboard` | `get_human_success_dashboard` |
| `POST /api/aipify/human-success/briefings/generate` | `generate_human_success_briefing` |
| `POST /api/aipify/human-success/recommendations/[id]/complete` | `complete_hs_learning_recommendation` |
| `POST /api/aipify/human-success/recommendations/[id]/dismiss` | `dismiss_hs_learning_recommendation` |
| `POST /api/aipify/human-success/journeys/advance` | `advance_hs_journey` |
| `POST /api/aipify/human-success/onboarding/advance` | `advance_hs_onboarding` |
| `POST /api/aipify/human-success/champions/recognize` | `recognize_hs_champion` |

## Adoption Score (0–100)

Components: usage consistency, feature discovery, knowledge engagement, learning completion, value recognition, workflow success.

| Band | Range |
|------|-------|
| Exceptional Adoption | 90–100 |
| Strong Adoption | 75–89 |
| Growth Opportunity | 60–74 |
| Adoption Challenges | 40–59 |
| Critical Adoption Risk | Below 40 |

## Human Success Score (0–100)

Evaluates confidence, progress, learning, value realization, and reduced friction. Personal score visible only to the current user.

## Migration

`supabase/migrations/20260617300000_experience_adoption_human_success_phase82.sql`

Tables: `user_adoption_scores`, `human_success_scores`, `hs_friction_events`, `success_milestones`, `hs_learning_recommendations`, `hs_onboarding_progress`, `hs_success_journeys`, `hs_champions`, `hs_value_reinforcements`, `hs_adoption_settings`, `hs_briefings`, `hs_audit_log`

## Privacy safeguards

- No employee rankings or public leaderboards
- Personal scores visible only to the current user
- Org adoption shown as aggregate average, not individual comparison
- Champions are recognition, not performance rankings

## Integrations

| Module | Use |
|--------|-----|
| Desktop Companion | Learning opportunities, milestones, tips |
| Knowledge Center | Contextual articles and guides |
| Learning Engine | Onboarding and recommendation quality |
| Value Engine | Time savings and ROI reinforcement |
| Strategic Intelligence | Adoption opportunities |
| Executive Briefing | Adoption trends and friction insights |
| Friction Intelligence | Workflow friction patterns (read-only) |

## Library

`lib/aipify/human-success/` — types, parse, jobs

## Knowledge Center

Category: `human-success`  
FAQ: `content/knowledge/aipify/human-success/faq/human-success-faq.md`

## Out of scope (V1)

- Employee ranking systems
- Public leaderboards
- Punitive scoring mechanisms
- Hidden monitoring capabilities
- Surveillance-oriented analytics
