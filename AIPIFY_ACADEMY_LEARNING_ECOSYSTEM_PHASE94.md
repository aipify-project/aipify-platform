# Aipify Academy & Learning Ecosystem — Phase 94

## Vision

**Empowering people to work smarter with AI.**

Aipify Academy transforms users from beginners into confident operators, specialists and strategic leaders capable of leveraging Aipify effectively.

## Distinction from Learning Engine

| Feature | `/app/learning` (Learning Engine) | `/app/academy` (Academy) |
|---------|-----------------------------------|--------------------------|
| Purpose | AI adaptive learning | Structured education & capability development |
| Focus | Personalized AI-driven paths | Courses, certifications, org readiness |
| Audience | Individual skill adaptation | Customers, partners, executives, admins |

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260623000000_aipify_academy_learning_ecosystem_phase94.sql` |
| Lib | `lib/aipify/academy/` |
| API | `/api/aipify/academy/*` |
| UI | `/app/academy` — Academy & Learning Ecosystem hub |
| KC FAQ | `content/knowledge/aipify/aipify-academy/faq/aipify-academy-faq.md` |

## Four pillars

1. **Customer Learning** — Getting started, support AI, knowledge centers, workflows
2. **Professional Development** — Administrator, governance, operations, commerce tracks
3. **Partner Education** — Implementation, deployment, integrations, commercial enablement
4. **Executive Education** — AI strategy, readiness, governance, risk, business value

## Database tables

- `academy_settings` — tenant academy configuration
- `academy_learning_paths` — structured learning journeys by pillar
- `academy_courses` — courses with formats (self-paced, instructor-led, workshops)
- `academy_course_progress` — user progress tracking
- `academy_assessments`, `academy_assessment_attempts`
- `academy_digital_badges` — completion and specialist badges
- `academy_learning_recommendations` — role-based recommendations
- `academy_organizational_reports` — org learning dashboard
- `academy_events` — workshops, webinars, campaigns
- `academy_community_resources` — user-generated and expert content
- `academy_content_reviews` — quality assurance
- `academy_briefings`, `academy_audit_log`

## RPCs

- `get_academy_dashboard()` — full learning ecosystem dashboard
- `get_academy_card()` — summary card
- `generate_academy_briefing()` — executive insight briefing
- `enroll_academy_course(uuid)` — start a course
- `complete_academy_course(uuid)` — mark course complete
- `dismiss_academy_recommendation(uuid)` — dismiss a recommendation

## Integrations

Knowledge Center (FAQ, contextual links), Partner Certification (Phase 91), Enterprise Deployment (Phase 92), Billing & Commercial (entitlement-based access), Learning Engine (distinct adaptive AI learning)

## Principle

People unlock the true value of technology. Education creates confidence. Confidence enables transformation.
