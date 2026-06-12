# Implementation Blueprint Phase 96 — Employee Experience & Wellbeing Companion Engine

**Feature owner:** CUSTOMER APP  
**Route:** `/app/organizational-health-engine` (extends Organizational Health A.56 + Blueprint Phase 61 — no new route)  
**Migration:** `supabase/migrations/20261119000000_implementation_blueprint_phase96_employee_experience_wellbeing.sql`  
**Helpers prefix:** `_eewcbp96_*`

## Mission

Healthier workplaces — wellbeing, engagement, sustainable performance.

## Philosophy

People not machines — wellbeing supports performance.

## Privacy

Support not control — no surveillance, no diagnosis.

## Vision

Building an environment where people can do exceptional work without sacrificing their humanity.

## Phase number collisions

| Surface | Route |
|---------|-------|
| Innovation Lab & Experimentation (repo Phase 96) | `/app/innovation-lab` |
| Blueprint Phase 38 | extends Innovation Lab Phase 96 |
| Companion Device Ecosystem (Phase A.96) | `/app/companion-device-ecosystem-engine` |
| Blueprint Phase 61 Organizational Health | on A.56 — preserved |
| **This blueprint** | employee experience & wellbeing on A.56 |

## Cross-links (not duplicate)

- Self Love A.76 `/app/self-love-engine`
- Gratitude & Recognition A.89, Presence & Comfort A.90
- Human Success repo Phase 82 `/app/human-success`
- Attention Guardian `/app/assistant/attention`
- Purpose & Values A.82 / Blueprint Phase 95
- Inclusion & Humanity A.83
- Learning & Training / Phase 92 talent journeys
- EKE employee onboarding `/app/settings/employee-knowledge`

## RPCs

- `get_organizational_health_engine_dashboard()` — preserves ALL A.56 + Phase 61 fields; appends `employee_experience_wellbeing_blueprint`
- `get_organizational_health_engine_card()` — preserves A.56 + Phase 61; appends Phase 96 framing

## Key helpers

`_eewcbp96_distinction_note`, `_eewcbp96_mission`, `_eewcbp96_philosophy`, `_eewcbp96_objectives`, `_eewcbp96_employee_experience_questions`, `_eewcbp96_wellbeing_observations`, `_eewcbp96_recognition_practices`, `_eewcbp96_companion_check_ins`, `_eewcbp96_self_love_connection`, `_eewcbp96_leadership_connection`, `_eewcbp96_employee_journey_connection`, `_eewcbp96_trust_connection`, `_eewcbp96_privacy_principles`, `_eewcbp96_dogfooding`, `_eewcbp96_success_criteria`, `_eewcbp96_blueprint_block`
