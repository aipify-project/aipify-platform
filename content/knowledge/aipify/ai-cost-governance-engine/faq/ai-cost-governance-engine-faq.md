# AI Cost Governance Engine — FAQ

## What is the AI Cost Governance Engine?

It helps organizations track AI usage costs, enforce budgets, and receive optimization recommendations. Customer UI shows task tiers (cost-efficient, standard, high-accuracy) — never provider brand names.

## How are budgets enforced?

Each budget has soft and hard limits. Soft limit triggers warnings; hard limit blocks new usage unless an administrator approves an overage or applies an emergency override.

## Can usage be blocked automatically?

Yes. When projected spend exceeds a hard limit, `check_ai_budget_capacity` returns blocked and `record_ai_usage_event` records the request as `blocked_by_budget` without executing the underlying AI call.

## What task tiers does the UI show?

Three tiers only: cost-efficient (routine tasks), standard (default), and high-accuracy (complex or sensitive outputs). Provider and model routing details stay in the database.

## Who can approve budget overages?

Users with `ai_overages.approve` permission (typically owners and administrators). Every approval is audited with rationale.

## Are cost decisions audited?

Yes. Budget changes, usage recording, blocked requests, overage approvals, emergency overrides, alert acknowledgements, and exports are recorded via `acge_*` audit events.
