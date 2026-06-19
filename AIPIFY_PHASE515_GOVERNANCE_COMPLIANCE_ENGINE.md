# AIPIFY – PHASE 515
## Governance, Compliance & Organizational Control Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Governance framework ensuring organizations maintain control, accountability, compliance, security, and operational trust.

## Core principle

Aipify helps organizations operate efficiently. Governance ensures they operate responsibly.

## Layer

**Feature owner: CUSTOMER APP**

- Route: `/app/governance`
- Business logic: Supabase RPCs — panels are thin clients

## Structure

```
PLATFORM → APP → GOVERNANCE ENGINE → DEPARTMENTS → EMPLOYEES
```

## Database

Migration: `supabase/migrations/20261851500000_governance_compliance_organizational_control_engine_phase515.sql`

### Tables

| Area | Tables |
|------|--------|
| Settings | `organization_governance_settings` |
| Policies | `organization_governance_policies`, `_policy_versions`, `_policy_acknowledgements` |
| Access reviews | `organization_governance_access_reviews`, `_access_review_items` |
| Compliance | `organization_governance_compliance_records` |
| Risks | `organization_governance_risks` |
| Controls | `organization_governance_controls` |
| Approvals | `organization_governance_approval_requests` |
| Audit | `organization_governance_audit_logs` |

### RPCs

- `get_governance_management_center`
- `perform_governance_management_action`
- `search_governance_audit`
- `get_companion_governance_context`
- `get_my_governance_summary`

## Routes

| Surface | Path |
|---------|------|
| Governance Center | `/app/governance` |
| Policy Management | `/app/governance/policies` |
| Access Reviews | `/app/governance/access-reviews` |
| Compliance | `/app/governance/compliance` |
| Risk Management | `/app/governance/risk` |
| Audit Center | `/app/governance/audit` |
| Controls | `/app/governance/controls` |

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/governance-management/` |
| UI | `components/app/governance-management/GovernanceManagementPanel.tsx` |
| APIs | `/api/app/governance/*`, `/api/assistant/governance-context` |

## Integrations

Companion governance · Domain governance · Business Pack governance · Links to TACC (`/app/governance/trust`), Approval Center, Permissions

## i18n

`governanceManagement.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## Note

Prior TACC Governance Center preserved at `/app/governance/approval-control` and existing sub-routes (`trust`, `approval-center`, etc.).

## Principle

> Operations create activity. Governance creates trust. Companion assists. Humans remain accountable.

**END OF PHASE 515**
