# AIPIFY – PHASE 547

**TITLE:** Self-Service, Customer Success & Companion Guidance Engine  
**PURPOSE:** Platform Customer Success layer — guide, teach, recommend, and assist before support tickets are needed.

## Feature owner

**PLATFORM ADMIN** — `/platform/customer-success`

## Objectives

- Unified Customer Success Center for platform operators
- Customer Health Engine with healthy / needs attention / at-risk status
- Onboarding Engine with milestone tracking and completion %
- Companion Guidance Engine with step-by-step workspace guidance
- Success Plans, Business Pack success tracking, Knowledge Center integration
- Risk Detection and proactive Companion assistance
- Success Playbooks, expansion opportunities, Growth Partner attribution
- Customer journey timeline, executive dashboard, reports, mobile summary, audit logging

## Routes

| Route | Purpose |
|-------|---------|
| `/platform/customer-success` | Main hub — overview, health, guidance, risks, reports |
| `/platform/customer-success/onboarding` | Onboarding tracker focus |
| `/platform/customer-success/playbooks` | Success playbooks library |
| `/platform/customers/success-operations` | Legacy Phase 270 operations center |

## Components

- Migration: `supabase/migrations/20261854700000_self_service_customer_success_companion_guidance_engine_phase547.sql`
- Lib: `lib/platform-customer-success-hub/`
- Panel: `components/platform/platform-customer-success-hub/`
- APIs: `/api/platform-customer-success-hub/overview`, `actions`, `mobile`

## RPCs

- `get_platform_customer_success_hub_center(p_section)`
- `perform_platform_customer_success_hub_action(p_payload)`
- `get_platform_customer_success_mobile_summary()`

## Principle

The best support ticket is the one that never needs to be created.

**END OF PHASE.**
