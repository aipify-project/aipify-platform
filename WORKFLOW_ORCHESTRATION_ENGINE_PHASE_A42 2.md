# Workflow Orchestration Engine (Phase A.42)

Route: `/app/workflow-orchestration-engine`

Migration: `supabase/migrations/20260818000000_workflow_orchestration_engine_phase_a42.sql`

## Feature owner

**CUSTOMER APP** — business logic in Supabase RPCs (`_woe_` prefix); panels and API routes are thin clients.

## Extends

- **A.32 Operations Center** — `_woe_emit_operations_event()` surfaces workflow failures and escalations
- **A.40 Human Oversight** — `_woe_request_step_oversight()` calls `submit_oversight_approval_request()` for approval-required steps
- **A.41 Delegated Trust (scaffold)** — `_dt_resolve_workflow_trust()` and `_dt_has_delegated_scope()` hook into `enterprise_delegated_admins`

## Distinction

Org-scoped workflow orchestration (`lib/aipify/workflow-orchestration-engine/`) is separate from platform orchestration (`lib/aipify/orchestration/`, Phase 68).

## Permissions

`workflows.view` · `workflows.manage` · `workflows.approve` · `workflows.pause`

## Templates (seed)

Support Escalation · New Employee Onboarding · Incident Response · Knowledge Review · Customer Risk Follow-Up
