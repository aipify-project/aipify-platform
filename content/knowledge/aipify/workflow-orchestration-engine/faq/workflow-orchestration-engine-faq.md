# Workflow Orchestration Engine FAQ

## FAQ 1

**Question:** What is the Workflow Orchestration Engine?

**Answer:** It lets organizations define multi-step operational workflows with triggers, actions, and optional human approvals — distinct from platform event orchestration.

## FAQ 2

**Question:** Does Aipify automatically create workflows?

**Answer:** No. Workflows are human-defined only. Templates require explicit human instantiation — AI never auto-creates workflows.

## FAQ 3

**Question:** How do approvals work in workflows?

**Answer:** Steps marked `approval_required` integrate with the Human Oversight Engine (A.40). Role-based approvers and escalation rules apply per step configuration.

## FAQ 4

**Question:** How is this different from platform orchestration?

**Answer:** Platform orchestration (`/app/orchestration`) routes cross-module events at the install level. Workflow Orchestration is organization-scoped process design for tenant operations.

## FAQ 5

**Question:** Are workflow actions audited?

**Answer:** Yes. Create, pause, execute, and approval events are recorded in the audit log for accountability.
