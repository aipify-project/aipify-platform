# Certification & Achievement Engine — Phase A.37

## Vision

**Certification & Achievement Engine** — Customer App engine extending Learning & Training (A.36). Issues internal certifications, achievement badges, team readiness summaries, and certificate export scaffolds when training requirements are met.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260808000000_certification_achievement_engine_phase_a37.sql` |
| Prefix | `_cae_` |
| Lib | `lib/aipify/certification-achievement-engine/` |
| Core | `lib/core/certification-achievement.ts`, `lib/core/date.ts` (`formatEuropeanDate`) |
| API | `/api/aipify/certification-achievement-engine/*`, `/api/certifications/badges` |
| UI | `/app/certification-achievement-engine`, team profile badge scaffold at `/app/team` |
| KC FAQ | `content/knowledge/aipify/certification-achievement-engine/faq/certification-achievement-engine-faq.md` |

## Core tables

- `certification_definitions` — programs with expiration policy and validity
- `user_certifications` — issued certificates with `AIP-{PREFIX}-{######}` numbers
- `achievement_badges` — module-linked badges for profile display
- `user_achievement_badges` — awarded badges per user
- `certification_requirements` — links to A.36 `learning_paths` and `training_assessments`

## RPCs

- `get_certification_achievement_engine_dashboard()`
- `get_certification_achievement_engine_card()`
- `issue_user_certification()`
- `revoke_user_certification()`
- `export_user_certificate()` — structured JSON + HTML PDF scaffold
- `get_user_achievement_badges()`

## Permissions

- `certifications.view`
- `certifications.issue`
- `certifications.revoke`
- `certifications.export`
- `certifications.manage`

## Integration notes

- Requires completed A.36 learning paths where configured (`_cae_check_eligibility`)
- European date format (DD.MM.YYYY) via `_cae_european_date()` and `formatEuropeanDate()`
- Team readiness aggregates (e.g. Support 12/15 certified)
- Distinct from Partner Certification Ecosystem (Phase 91)

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via `organizations.id = customers.id`.
