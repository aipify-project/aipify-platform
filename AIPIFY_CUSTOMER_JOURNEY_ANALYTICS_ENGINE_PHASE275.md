# Customer Journey Analytics Engine — Phase 275

**Feature owner:** Platform Admin  
**Route:** `/platform/analytics/customer-journeys`  
**Module:** `lib/customer-journey-analytics/`  
**Migration:** `supabase/migrations/20261462000000_customer_journey_analytics_engine_phase275.sql`

## Purpose

Understand how customers move through Aipify so the platform can continuously improve onboarding, adoption, retention, and growth.

## Journey stages

- Registration
- Email verification
- First login
- Onboarding started / completed
- First user invited
- First integration connected
- First AI interaction
- First business outcome achieved
- Subscription activated
- Expansion events

## Capabilities

| Area | Description |
|------|-------------|
| Funnel analytics | Conversion percentages between consecutive stages |
| Overview cards | Registrations, onboarding rate, trial conversion, time to first value, expansion, drop-off |
| Drop-off detection | Registration abandoned, verification incomplete, onboarding unfinished, integration incomplete, trial expired |
| Journey timelines | Per-customer milestones, dates, delays, support interactions |
| Common path analysis | Highest converting paths and abandonment points |
| Recommendations | Simplify onboarding, tooltips, documentation, outreach, automation |
| Segment filters | Country, industry, company size, plan, customer segment |
| Export | CSV, Excel, PDF |
| Audit logging | Journey events, funnel recalculations, exports, recommendations |

## APIs

| Method | Path | RPC |
|--------|------|-----|
| GET | `/api/customer-journey-analytics/overview` | `get_customer_journey_analytics(p_filters)` |
| POST | `/api/customer-journey-analytics/actions` | `record_customer_journey_action(p_payload)` |
| GET | `/api/customer-journey-analytics/export` | `get_customer_journey_analytics` + export log |

## Privacy

Journey analytics exist to improve customer outcomes. They must never be used for advertising or sold to third parties.

## Founding principle

Understanding where customers struggle is the first step toward creating extraordinary customer experiences.

Aipify Group AS — Bergen, Norway. For the world.
