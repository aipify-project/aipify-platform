# AI Cost Governance Engine — Phase A.74

**Feature owner:** Customer App — CRITICAL FOR V1

Budget enforcement, usage tracking, and cost optimization with model-agnostic task-tier routing in customer UI.

## Integrates

- Secure AI Actions Engine (A.3)
- Analytics Insights Engine (A.16)
- Document Output Engine (A.59)

## Route

`/app/ai-cost-governance-engine` — nav id `aiCostGovernanceEngine`

## Tables

- `ai_usage_events` — per-request usage metadata (provider/model stored for routing, not shown in UI)
- `ai_budgets` — scoped soft/hard limits by organization, module, user, workflow, api_key, or integration
- `ai_budget_alerts` — threshold alerts (50%, 75%, 90%, hard_limit, spike)
- `ai_cost_optimization_recommendations` — savings recommendations
- `ai_cost_governance_settings` — org defaults, routing rules, context limits

## Permissions

`ai_costs.view` · `ai_costs.manage` · `ai_costs.export` · `ai_budgets.manage` · `ai_overages.approve` · `ai_usage.block`

## Model-agnostic UI

Customer-facing surfaces show task tiers only: **cost-efficient**, **standard**, **high-accuracy**. Provider and model names remain in database for routing per model-agnostic-intelligence rules.

## RPCs

- `get_ai_cost_governance_engine_dashboard()`
- `get_ai_cost_governance_engine_card()`
- `upsert_ai_budget(jsonb)`
- `update_ai_budget_status(uuid, text)`
- `record_ai_usage_event(jsonb)`
- `check_ai_budget_capacity(text, numeric)`
- `approve_ai_overage(uuid, text)`
- `emergency_ai_budget_override(uuid, text, timestamptz)`
- `generate_ai_cost_optimization_recommendations()`
- `acknowledge_ai_budget_alert(uuid)`
- `export_ai_cost_governance_manifest(text)`
- `get_executive_ai_cost_summary()`

Metadata only — no raw prompts or customer content in usage payloads.
