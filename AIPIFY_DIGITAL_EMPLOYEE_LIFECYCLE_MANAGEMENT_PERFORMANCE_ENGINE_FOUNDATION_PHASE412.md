# AIPIFY — PHASE 412
## Digital Employee Lifecycle, Management & Performance Engine Foundation

**Feature owner:** Customer App  
**Route:** `/app/digital-employees`  
**Migration:** `20261692000000_digital_employee_lifecycle_management_performance_engine_foundation_phase412.sql`  
**Helpers:** `_gdelmp412_*`

## Purpose

The HR system for digital workers — create, configure, govern, evaluate, improve, and retire digital employees with the same seriousness as human workforce management.

## Core principle

A digital employee is not a chatbot. A digital employee is an organizational resource with responsibilities, permissions, performance, history, governance, and accountability.

## Relationship to Phase 411

Distinct from Agent Orchestration (`/app/orchestration`) which routes tasks and workflows. This engine manages employee lifecycle, training, performance reviews, career paths, and retirement.

## Modules

- Employee Overview
- Employee Directory
- Roles & Responsibilities
- Performance
- Training
- Lifecycle
- Governance
- Analytics

## Tables

`digital_employee_lifecycle_settings` · `digital_employee_lifecycle_employees` · `digital_employee_lifecycle_role_definitions` · `digital_employee_lifecycle_training` · `digital_employee_lifecycle_reviews` · `digital_employee_lifecycle_advisor_signals` · `digital_employee_lifecycle_audit_logs`

## RPCs

- `get_digital_employee_lifecycle_management_center()`
- `digital_employee_lifecycle_management_action()`

## Actions

`create_employee` · `assign_role` · `assign_training` · `complete_training` · `complete_performance_review` · `approve_promotion` · `update_permissions` · `retire_employee`

## Permissions

- `digital_employees.view`
- `digital_employees.manage`

## Plan gate

Business and Enterprise plans required.

## i18n

`customerApp.digitalEmployeeLifecycleEngine.*` — core locales: en, no, sv, da, pl, uk

## Knowledge Center

FAQ: `content/knowledge/aipify/digital-employee-lifecycle-management-performance-engine/faq/`

## END OF PHASE
