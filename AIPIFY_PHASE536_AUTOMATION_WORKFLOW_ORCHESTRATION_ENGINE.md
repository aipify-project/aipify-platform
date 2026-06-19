# AIPIFY – PHASE 536

**TITLE:** Automation, Workflow & Business Process Orchestration Engine  
**Feature owner:** CUSTOMER APP

## Purpose

Universal Automation & Workflow Engine — workflows, triggers, conditions, actions, approval-aware automation, templates, execution history, safety controls, and cross-module orchestration.

## Principle

Employees should not perform repetitive work when automation can perform it safely. Automation assists. Humans authorize.

## Routes

| Route | Surface |
|-------|---------|
| `/app/automation` | Automation Center |
| `/app/automation/workflows` | Workflow Engine |
| `/app/automation/templates` | Workflow Templates |
| `/app/approvals` | Approval Center (linked — governance never bypassed) |

## Database (Phase 536 delta)

**New tables:**
- `organization_automation_operations_settings`
- `organization_automation_operations_templates`
- `organization_automation_operations_workflows`
- `organization_automation_operations_executions`
- `organization_automation_operations_audit_logs`

## RPCs

- `get_automation_operations_center(p_section)` — center bundle with all sections
- `perform_automation_operations_action(p_action_type, p_payload)` — create, activate, execute, approve, emergency stop
- `_aops536_monitoring(p_org_id)` — execution monitoring
- `_aops536_seed_templates(p_org_id)` — default reusable templates
- `get_companion_automation_operations_context(p_query)`
- `get_my_automation_operations_summary()` — mobile-ready

## Module

`automation_operations` · permissions `automation_operations.view` / `automation_operations.manage`

## Migration

`supabase/migrations/20261853600000_automation_workflow_business_process_orchestration_engine_phase536.sql`

---

Aipify Group AS · Bergen. Norway. For the world.
