# Resource Planning Engine — Phase A.63

**Feature owner:** Customer App

Organizational resource visibility, allocation, utilization tracking, and proactive capacity planning — metadata only.

## Extends

- Operations Center Foundation (A.32)
- Decision Support Engine (A.54)
- Strategic Alignment Engine (A.55)
- Unified Task & Follow-Up Engine (A.62)
- Organizational Memory (A.34)

## Route

`/app/resource-planning-engine` — nav id `resourcePlanningEngine`

## Tables

- `organization_resource_plans` — plan_name, planning_period, owner_user_id, status
- `organization_resource_allocations` — resource_type, allocated_amount, utilized_amount, variance
- `organization_resource_scenarios` — alternative planning scenarios for comparison
- `organization_resource_settings` — org planning preferences

## Resource types

`personnel` · `time` · `budget` · `expertise` · `external_partner` · `technology`

## Permissions

`resources.view` · `resources.manage` · `resources.review` · `resources.export`

## RPCs (`_rpe_` helpers)

Dashboard, card, create/update plan, allocations, utilization override, scenario create/compare, approve plan, executive summary, export.

Metadata only — no PII or raw financial records in payloads.
