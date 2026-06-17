# AIPIFY – PHASE 327
## COMPANION WORK PRIORITIZATION ENGINE

**Feature owner:** CUSTOMER APP

## Purpose

Help users identify, organize and focus on the most important work across tasks, projects, approvals, meetings and organizational priorities — transparent, explainable, human-centered.

## Routes

- `/app/companion/work-prioritization` (canonical)
- `/dashboard/companion/work-prioritization` (legacy redirect)

## APIs

- `GET /api/aipify/work-prioritization`
- `GET /api/aipify/work-prioritization/focus`
- `GET /api/aipify/work-prioritization/workload`
- `GET /api/aipify/work-prioritization/dependencies`
- `POST /api/aipify/work-prioritization/recalculate`

## Principles

Aipify recommends priorities with reasoning. Users decide and execute. No hidden prioritization logic.

## Permissions

- Employees: personal priorities
- Managers: personal and team (when enabled)
- Owners / executives: organization-wide priorities
- Administrators: per assigned permissions

## Tables

`companion_work_prioritization_settings` · `companion_work_priority_records` · `companion_work_priority_dependencies` · `companion_work_priority_workload` · `companion_work_priority_timeline` · `companion_work_priority_audit_logs`

## Distinct from

`priorityFocusEngine` (Phase A.80) — organizational P1–P4 dimensions at `/app/priority-focus-engine`.
