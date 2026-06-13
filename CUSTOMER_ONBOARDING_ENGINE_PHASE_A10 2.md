# Customer Onboarding Engine — Phase A.10

## Vision

**Guide new organizations through Aipify setup with a structured 10-step flow, actionable checklist, and Knowledge Center recommendations.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260715000000_customer_onboarding_engine_phase_a10.sql` |
| Prefix | `_cob_` · decision type: `customer_onboarding_engine` |
| Lib | `lib/aipify/customer-onboarding-engine/`, `lib/core/customer-onboarding.ts` |
| API | `/api/aipify/customer-onboarding-engine/*` |
| UI | `/app/customer-onboarding-engine` |
| KC FAQ | `content/knowledge/aipify/customer-onboarding-engine/faq/customer-onboarding-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `organization_onboarding` | Current step, completion percentage, completed_at |
| `onboarding_checklist_items` | Per-org checklist with completion tracking |

## 10-step flow

1. Welcome
2. Organization Profile
3. Team Setup
4. Module Activation
5. Knowledge Center
6. Integrations
7. Support AI
8. Secure AI Actions
9. Admin Assistant
10. Go Live

## Checklist items

- Complete organization profile
- Invite team member
- Activate core module
- Publish first knowledge article
- Connect first integration
- Configure support channels
- Review AI action policies
- Complete security review
- Explore operations dashboard
- Acknowledge getting started guide

## RPCs

- `get_customer_onboarding_engine_dashboard()` / `get_customer_onboarding_engine_card()`
- `advance_onboarding_step()`
- `complete_checklist_item(text)`
- `get_onboarding_recommendations()` — integrates KC via `retrieve_knowledge_for_ai`
- `complete_onboarding()`

## Permissions

- `onboarding.view`, `onboarding.manage`

## TypeScript helpers (`lib/core/customer-onboarding.ts`)

- `advanceOnboardingStep()`, `completeChecklistItem()`
- `getOnboardingRecommendations()`, `completeOnboarding()`
- `isOnboardingComplete()`, `canManageOnboarding()`

## API endpoints

- `GET /api/aipify/customer-onboarding-engine/dashboard`
- `GET /api/aipify/customer-onboarding-engine/card`
- `GET /api/aipify/customer-onboarding-engine/recommendations`
- `POST /api/aipify/customer-onboarding-engine/advance`
- `POST /api/aipify/customer-onboarding-engine/checklist`
- `POST /api/aipify/customer-onboarding-engine/complete`

## Audit events

`onboarding_started`, `onboarding_step_advanced`, `checklist_completed`, `onboarding_completed`

## Principle

Onboarding tracks progress metadata — operational data remains in respective modules.
