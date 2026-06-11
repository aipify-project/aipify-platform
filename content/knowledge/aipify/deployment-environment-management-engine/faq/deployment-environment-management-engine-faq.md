# Deployment & Environment Management Engine — FAQ

## What is the Deployment & Environment Management Engine?

A framework for safe deployments, environment isolation, controlled releases, tenant-scoped feature flags, and rollback readiness across Aipify Core phases.

## How does it relate to the Update Engine?

The Update Engine (Phase 18) schedules and tracks Aipify software updates via `platform_updates`. A.20 adds environment-level deployment tracking, organization feature flags, and rollout strategies. Both share the core principle: updates only change Aipify software — never silently alter customer data.

## What environments are supported?

local · development · staging · pilot (Unonight) · production · enterprise (dedicated/hybrid/on-prem scaffold)

## What is the pilot deployment flow?

Development → Staging → Aipify Internal → Unonight Pilot → General Availability. Unonight is the first pilot customer environment, linked to the Unonight Pilot Operations Engine (A.15).

## Can I toggle feature flags for my organization?

Yes. Owners, administrators, and managers with `feature_flags.manage` can toggle tenant-scoped flags per environment. Flags complement commercial package module licensing — they do not bypass plan gates.

## Are deployments and rollbacks audited?

Yes. Deployments initiated, completed, or failed; rollbacks executed; feature flag changes; and rollout adjustments are recorded via audit logs and may trigger notifications through the Notification & Communication Engine (A.17).
