# Digital Employee Lifecycle Engine — FAQ

## What is a Digital Employee?

A Digital Employee is an organizational resource within Aipify — not a chatbot. Each employee has a name, department, role, capabilities, permissions, knowledge sources, supervisor, status, performance history, and governance accountability. Manage digital employees at `/app/digital-employees`.

## How are Digital Employees trained?

Training is assigned through the Training module in `digital_employee_lifecycle_training`. Supported types include knowledge, role, industry, compliance, workflow, skill, and continuous learning. Onboarding workflow: employee created → role assigned → knowledge connected → training assigned → permissions approved → activation → performance monitoring.

## How are Digital Employees evaluated?

Performance reviews in `digital_employee_lifecycle_reviews` track performance, governance, quality, compliance, and improvement plans. Metrics include tasks completed, success rate, response quality, automation success, escalation rate, user satisfaction, and business impact.

## How do promotions work?

The promotion framework supports career paths from Junior Digital Employee through Specialist, Senior Specialist, Lead Specialist, Department Lead, and Executive Agent. Promotions require skill, training, performance, governance, and approval requirements — approved via `approve_promotion` action with full audit logging.

## How is performance measured?

Employee health score combines performance, reliability, training coverage, governance compliance, task success, user feedback, and operational stability. Overview metrics display active employees, departments, assigned training, completed tasks, average performance, and training coverage.

## How is governance maintained?

Governance tracks permissions, approval rights, knowledge access, tool access, workflow access, and governance rules per role. Permission changes, performance reviews, and retirements are logged in `digital_employee_lifecycle_audit_logs`. Digital employees integrate with Agent Orchestration at `/app/orchestration` for task routing under human supervision.

## Digital Employees

Organizational resources with responsibilities, permissions, performance, history, and accountability — managed like human workforce members.

## Roles

Support Specialist, Sales Specialist, HR Specialist, Finance Specialist, Operations Specialist, Compliance Specialist, Industry Specialist, Executive Assistant, and custom roles.

## Training

Knowledge, role, industry, compliance, workflow, skill, and continuous learning with coverage tracking.

## Performance Reviews

Scheduled and completed reviews with improvement plans and review history.

## Lifecycle Management

Statuses: provisioning, training, active, paused, restricted, retired, archived — full lifecycle from creation to retirement.

## Digital Workforce Governance

Permission changes, governance reviews, and executive workforce dashboard at `/app/digital-employees/analytics`.
