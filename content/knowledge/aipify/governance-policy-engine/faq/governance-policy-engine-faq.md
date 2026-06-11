# Governance & Policy Engine — FAQ

## What is the Governance & Policy Engine?

A tenant-aware policy framework that defines how AI autonomy, approvals, support, access, knowledge publishing, integrations, and retention work in your organization — with human oversight for sensitive actions.

## How is this different from action_policies?

`organization_policies` define org-wide governance rules by category. `action_policies` (Trust & Action Engine) remain skill-specific execution rules. The Governance Engine reads both when checking approval requirements.

## Who can manage policies?

Owners and administrators can create, update, activate, and archive policies. Managers can view policies and schedule reviews. Violation acknowledgements require `governance.approve`.

## What are AI autonomy levels?

- **advisory_only** — AI suggests only; humans execute
- **approval_required** — default; approvals required for most actions
- **limited_automation** — low-risk actions may run automatically
- **organization_defined** — custom rules per active policies

## Are high-risk and critical actions ever auto-approved?

No. High-risk actions always require human approval. Critical (Level 4) actions are prohibited for AI per Trust & Action Engine rules.

## How are violations detected?

`detect_policy_violations()` scans for drift such as pending high-risk approvals and knowledge articles awaiting review when publishing policies require it.

## Is governance activity audited?

Yes. Policy creation, updates, activation, archival, violation scans, acknowledgements, and review scheduling are recorded via `_mta_create_audit_log` when `_ala_should_audit` applies.
