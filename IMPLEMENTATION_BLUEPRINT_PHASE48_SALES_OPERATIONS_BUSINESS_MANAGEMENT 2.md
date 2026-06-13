# Implementation Blueprint — Phase 48: Sales Operations & Business Management Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Operations / Business**

> **Naming collision:** **Value Realization Engine Phase A.48** lives at `/app/value-realization-engine` (`20260824000000_value_realization_engine_phase_a48.sql`) — tenant outcome measurement with baselines and milestones. **Implementation Blueprint Phase 48 Sales Operations** is a distinct blueprint for independent Sales Expert business visibility — documented in `_sobmbp_distinction_note()`.

## Mission

Help independent Sales Experts see revenue, goals, capacity, and service obligations clearly — so they can build sustainable Aipify businesses.

## Core philosophy

**Operational visibility supports planning. Forecasts inform; they never pressure.** Sales Experts operate independent businesses — Aipify augments awareness, not judgment.

## Objectives

| Key | Focus |
|-----|-------|
| **Revenue visibility** | Implementation revenue, commission estimates, commercial partner metadata |
| **Goal management** | Realistic monthly customer, revenue, certification, and learning aspirations |
| **Capacity awareness** | Sustainable pacing — overload and preparation companion examples |
| **Forecasting support** | Informative metadata trends — never guilt or pressure |
| **Service tracking** | Implementations, training, outstanding invoice scaffolds, obligations |
| **Operational awareness** | Active customers, opportunities, follow-ups, support obligations |

## Business dashboard

Derived from `_sobmbp_operations_summary(organization_id)` using `_seos_engagement_summary`, customers, commissions, opportunities, follow-ups, and `_seos_commercial_commission_summary`:

- Implementation revenue estimate (implementation + consulting commission types)
- Training revenue estimate
- Commission estimates (pending, paid, forecasted, lifetime)
- Active customers and opportunities
- Support obligations (scheduled follow-ups within 30 days)
- Customers onboarding
- Trends note — metadata only
- Currencies: NOK, EUR, USD, SEK, DKK (display scaffold)

## Goal management

Optional table `sales_expert_business_goals` — `goal_key`, `target_value`, `period`, `status` (tenant scoped).

Default scaffolds seeded via `_sobmbp_ensure_business_goals`:

- `monthly_new_customers`
- `monthly_revenue_aspiration`
- `certification_progress`
- `learning_sessions`

Cross-link **Goals OKR A.65** — organizational goals are distinct from partner business goal scaffolds.

## Capacity awareness

Companion examples 🌹❤️🦉 for overload, preparation, and capacity checks. Cross-links **Resource Planning A.63** (capacity scaffold) and **Personal Productivity A.70**.

## Service tracking

Implementations in progress · Training sessions · Outstanding invoices (scaffold) · Support obligations — aligned with **portal independent-business notice**.

## Forecasting support

Companion examples 🦉🔔 — forecasts inform planning, never pressure. Signals from forecasted commissions, pipeline metadata, retention trends. Cross-link **Revenue Intelligence Phase 39** on `/app/commercial`.

## Self Love connection (A.76)

Sustainable pacing for independent businesses — growth at a humane pace. Route: `/app/self-love-engine`.

## Trust connection

Transparent forecast assumptions — metadata only, honest about scaffolds and distinction from Value Realization A.48.

## Cross-links

| Surface | Route | Purpose |
|---------|-------|---------|
| Customers / Commissions / Opportunities | `/app/sales-expert-engine` | Existing SEOS tabs |
| Revenue Intelligence Phase 39 | `/app/commercial` | Commercial partner commissions |
| Performance Phase 41 | `/app/sales-expert-engine` | Milestones and recognition |
| Renewal Phase 44 | `/app/sales-expert-engine` | Relationship-focused renewals |
| Goals OKR A.65 | `/app/goals-okr-engine` | Organizational goals |
| Personal Productivity A.70 | `/app/personal-productivity-engine` | Sustainable pacing |
| Resource Planning A.63 | `/app/resource-planning-engine` | Capacity scaffold |
| Self Love A.76 | `/app/self-love-engine` | Independent business wellbeing |
| Value Realization A.48 | `/app/value-realization-engine` | Tenant outcomes — **NOT** this blueprint |

## Distinction from Value Realization A.48

| Engine | Route | Purpose |
|--------|-------|---------|
| **Value Realization A.48** | `/app/value-realization-engine` | Tenant outcome measurement, baselines, milestones |
| **Sales Operations Blueprint Phase 48** | `/app/sales-expert-engine` (Operations tab) | Independent Sales Expert business visibility |

## Database

Migration: `supabase/migrations/20260998000000_implementation_blueprint_phase48_sales_operations_business_management.sql`

**Optional table:** `sales_expert_business_goals` — metadata scaffold only.

Extends `get_sales_expert_operating_system_dashboard()` and `get_sales_expert_operating_system_card()` via `_sobmbp_*` helpers — **all A.95 + Phase 41 + Phase 45 + Phase 46 + Phase 42 fields preserved**.

## UI

- `components/app/sales-expert-engine/SalesOperationsTab.tsx` — **Operations / Business** tab (`operations`)
- `components/app/sales-expert-engine/SalesExpertEngineDashboardPanel.tsx` — tab wiring
- Types: `lib/aipify/sales-expert-operating-system/types.ts`, `parse.ts`
- i18n: `customerApp.salesExpertEngine.tabOperations` + section labels in en/no/sv/da

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase48-sales-operations-business-management.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase48-vocabulary.ts`

## FAQ

`content/knowledge/aipify/sales-expert-engine/faq/implementation-blueprint-phase48-faq.md`

## Dogfooding

Aipify Group Sales Experts validate operations dashboard fields, goal scaffolds, and forecast tone internally before broader partner rollout.

## Success criteria

Operations summary · Business dashboard fields · Goal scaffold · Capacity awareness · Service tracking · Forecast inform-not-pressure · Trust forecast assumptions · Self Love · Value Realization distinction · Independent business messaging
