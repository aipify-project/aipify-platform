# Enterprise Workflow Automation Engine — FAQ (Phase 231)

## What is the Enterprise Workflow Automation Engine?

The Enterprise Workflow Automation Engine enables organizations to automate repetitive business processes through secure, governed workflows at `/app/aipify-enterprise-workflow-automation-engine`.

## What workflow features are included?

Visual workflow builder, trigger-based automations, scheduled automations, approval workflows, conditional logic, multi-step execution, notification automations, escalation automations, cross-module automation, workflow templates, execution history, and performance analytics.

## What triggers are supported?

New employee onboarding, new support request, document approval required, meeting completed, customer risk detected, contract nearing expiration, task overdue, customer milestone achieved, executive review required, and custom triggers — all governed by RBAC.

## What actions can workflows perform?

Create tasks, send notifications, request approvals, generate documents, update records, assign ownership, schedule follow-ups, create executive briefings, launch predefined workflows, and trigger external integrations — with approval controls where required.

## Who can manage workflows?

Super Admin (full access), Tenant Admin (organization workflows), Managers (department workflows), and Employees (authorized participation) — all governed by enterprise RBAC.

## Are workflow changes audited?

**Yes.** Workflow changes must be logged. Sensitive workflows require approval controls and all execution follows RBAC policies.

## How does this integrate with other Aipify surfaces?

Cross-link only: Action Center, Decision Center, Executive Cockpit Phase 200, Document Intelligence, Communication Center, Customer Success Center, and Knowledge Center — never duplicate their RPCs.

## Does the Workflow Companion replace human oversight?

**No.** Workflow Companion prepares workflow design and execution visibility — it does **NOT** bypass workflow RBAC, skip approval controls, or execute sensitive workflows without governance.
