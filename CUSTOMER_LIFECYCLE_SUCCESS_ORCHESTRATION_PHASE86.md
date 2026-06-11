# Customer Lifecycle & Success Orchestration Engine — Phase 86

## Core principle

**Customer success comes before expansion.**

Expansion follows value. No pressure. No manipulation.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260617800000_customer_lifecycle_success_orchestration_phase86.sql` |
| Lib | `lib/aipify/customer-lifecycle/` |
| API | `/api/aipify/customer-lifecycle/*` |
| UI | `/app/customer-lifecycle` — Customer Success Journey Dashboard |
| KC FAQ | `content/knowledge/aipify/customer-success/faq/customer-lifecycle-faq.md` |

## Database tables

- `customer_profiles` — lifecycle stage, success score, score components
- `customer_milestones` — achievements and quick wins
- `customer_health_scores` — score history
- `customer_recommendations` — supportive actions (no pressure)
- `customer_playbooks` — Support, Executive, Knowledge, SMB, Enterprise
- `customer_success_briefings` — executive success briefings
- `customer_success_settings` — org configuration
- `customer_success_audit_log` — audit trail

## Lifecycle stages

Discovery → Onboarding → Activation → Adoption → Expansion → Optimization → Advocacy

## Customer Success Score (0–100)

| Score | Band |
|-------|------|
| 90–100 | Thriving Customer |
| 75–89 | Healthy Customer |
| 60–74 | Support Opportunity |
| 40–59 | At-Risk Customer |
| Below 40 | Critical Intervention Recommended |

## Score components

- Onboarding Completion (15%)
- Adoption Strength (25%)
- Value Realization (20%)
- Learning Participation (15%)
- Expansion Readiness (10%)
- Retention Indicators (15%)

## Quick Wins Engine

Auto-detects milestones from Value Engine events: first FAQ, first briefing, first automation, first value outcome, knowledge gap resolved.

## Integrations

- **Human Success** — adoption scores and onboarding progress
- **Value Engine** — time savings and quick win detection
- **Outcomes** — validated value realization
- **Strategic Intelligence** — expansion when readiness is high
- **Learning Engine** — learning path recommendations
- **Marketplace** — value-first pack suggestions
- **Desktop Companion** — milestone celebrations via `generate_lifecycle_desktop_message()`
- **Executive Briefing** — `generate_customer_success_briefing()`
- **Trust Engine** — transparent score explanations

## Safety guarantees

- No aggressive upselling
- No manipulative retention
- No hidden scoring
- No forced expansion campaigns
- Recommendations dismissible without penalty

## RPCs

- `get_customer_lifecycle_dashboard()` — main journey dashboard
- `get_customer_lifecycle_card()` — summary card
- `accept_customer_recommendation(uuid)` / `dismiss_customer_recommendation(uuid)`
- `generate_customer_success_briefing()` — executive briefing
- `generate_lifecycle_desktop_message()` — Desktop Companion messages
