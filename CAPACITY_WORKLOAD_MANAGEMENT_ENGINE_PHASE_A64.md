# Capacity & Workload Management Engine — Phase A.64

**Feature owner:** Customer App

Monitor workload, detect capacity pressure, and balance responsibilities across teams — metadata only.

## Extends

- Unified Task & Follow-Up (A.62)
- Resource Planning (A.63)
- Operations Center Foundation (A.32)
- Organizational Health (A.56)
- Organizational Memory (A.34)

## Route

`/app/capacity-workload-management-engine` — nav id `capacityWorkloadManagementEngine`

## Tables

- `organization_capacity_profiles` — user/team capacity limits
- `organization_workload_items` — effort from tasks, support, incidents, etc.
- `organization_workload_warnings` — overload and conflict alerts
- `organization_capacity_settings` — thresholds and preferences

## Permissions

`capacity.view` · `capacity.manage` · `workload.view` · `workload.reassign` · `capacity.export`

## RPCs (`_cwme_` helpers)

Dashboard, card, profile CRUD, workload tracking, warnings, rebalancing recommendations, reassign, export.

Reassignment requires human approval unless org explicitly enables auto-reassign in settings (scaffold only — default recommend-only).
