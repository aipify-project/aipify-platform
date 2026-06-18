# Digital Workforce Governance Engine — FAQ

## What can Digital Employees do?

Digital Employees operate within assigned authority levels (1–7) defined at `/app/governance/digital-workforce`. Levels range from Observation Only (Level 1) through Executive Authority (Level 6). Level 7 — Human Reserved — permits no automation. The Action Authority Matrix maps specific actions (create task, approve expense, bank transfers, etc.) to minimum authority levels and risk classes.

## What requires human approval?

Actions marked `requires_human_approval` in the Action Authority Matrix, all Level 7 Human Reserved actions, and any action classified as `high`, `critical`, or `human_reserved` risk require explicit human approval before execution. Approval Policies define department, finance, compliance, executive, and multi-step approval chains.

## How does decision authority work?

Authority is assigned per digital employee via `digital_workforce_authority_assignments`, synced from Digital Employee Lifecycle. Each assignment maps to an authority level with defined permissions: view, recommend, create, modify, approve, execute, delete, and escalate. Use `assign_authority` action to update assignments.

## How are risks classified?

The Risk Classification Engine uses five classes: Low Risk, Medium Risk, High Risk, Critical Risk, and Human Reserved. Actions, policies, and decision logs carry risk class metadata. Log risk events via `log_risk_event` action — events are tracked in `digital_workforce_risk_events` with full audit trail.

## How are approvals governed?

Approval Policies in `digital_workforce_approval_policies` support department, manager, finance, compliance, executive, and multi-step approval workflows. Decisions are recorded in `digital_workforce_decision_logs` via `record_approval` action. All approval grants and rejections are audited.

## How is accountability maintained?

Every governance event is logged in `digital_workforce_governance_audit_logs`: authority assigned/changed, policy created/updated, approval granted/rejected, escalation triggered, and risk events. Decision Logging tracks recommendation → decision → action → approval → execution → outcome → review lifecycle.

## Decision Authority

Seven-level authority model from observation through executive authority, with Level 7 reserved for humans only.

## Approval Policies

Department, manager, finance, compliance, executive, and multi-step approval chains with configurable steps.

## Risk Classification

Low, medium, high, critical, and human reserved — applied to actions, policies, and events.

## Digital Ethics

Transparency, human oversight, accountability, auditability, privacy, security, fairness, and responsible automation.

## Governance Reviews

Policy, authority, risk, ethics, compliance, and exception reviews with scheduled due dates.

## Human Oversight

Humans remain responsible. Aipify enables execution only within approved governance frameworks.
