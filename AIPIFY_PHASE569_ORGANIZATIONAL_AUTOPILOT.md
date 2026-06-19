# AIPIFY – PHASE 569

**TITLE:** Organizational Autopilot, Assisted Operations & Approval-Driven Automation Engine

**PURPOSE:** Create the Organizational Autopilot Engine that allows organizations to define approved operational boundaries where Companion may proactively assist, prepare, and coordinate recurring work with minimal human involvement — the assisted-autonomy layer of Aipify.

**Feature owner:** CUSTOMER APP

**Routes:**
- `/app/autopilot` — Autopilot Center
- `/app/autopilot/workflows` — Companion Workflow Library

## Objectives

- Autopilot Center (Overview, Policies, Automation Rules, Approval Chains, Prepared Actions, Execution Queue, Insights, Reports)
- Autopilot Profiles (Conservative, Balanced, Advanced, Enterprise, Custom)
- Policy Engine with Allowed, Approval Required, Restricted, Prohibited categories
- Routine Operations Engine, Approval-Based Automation, Pre-Approved Workflows
- Smart Scheduling Engine, Autopilot Watchtower, Assisted Decision Engine
- Companion Workflow Library, Boundary Framework (mandatory enforcement)
- Business Pack integration, Confidence Engine, Executive Dashboard, mobile access, audit logging

## Components

| Layer | Path |
|-------|------|
| Migration | `supabase/migrations/20261856900000_organizational_autopilot_assisted_operations_approval_driven_automation_engine_phase569.sql` |
| Library | `lib/customer-autopilot-operations/` |
| APIs | `/api/app/autopilot-operations/*`, `/api/assistant/companion-autopilot-advisor-context` |
| UI | `components/app/autopilot-operations/` |
| Pages | `app/app/autopilot/` |
| i18n | `autopilotOperations.*` in en/no/sv/da |

## Integration

- Phase 568 Proactive Operations: `/app/proactive`
- Approvals/Governance: `/app/approvals`
- Execution Engine: `/app/action-center`

## RPCs

- `get_organization_companion_autopilot_center(p_section)`
- `perform_organization_companion_autopilot_action(p_payload)`
- `get_organization_companion_autopilot_mobile_summary()`
- `get_assistant_companion_autopilot_advisor_context()`

## Principle

Automation should reduce workload, not reduce control. Companion prepares, coordinates, and assists — humans define boundaries and approve important decisions.

One Autopilot Engine. One Assisted Automation Framework. One Governance-Driven Execution Layer.

**END OF PHASE.**
