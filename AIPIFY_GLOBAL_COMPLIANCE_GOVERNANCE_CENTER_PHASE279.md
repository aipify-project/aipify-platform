# Global Compliance & Governance Center — Phase 279

**Feature owner:** Platform Admin  
**Route:** `/platform/governance/compliance-center`  
**Module:** `lib/compliance-governance-center/`  
**Migration:** `supabase/migrations/20261466000000_global_compliance_governance_center_phase279.sql`

## Purpose

Provide organizations with visibility and control over compliance-related activities, governance settings, approvals, and policy enforcement.

## Capabilities

| Area | Description |
|------|-------------|
| Overview cards | Compliance alerts, policies requiring review, pending approvals, exceptions, audit findings, high-risk activities |
| Governance modules | Policy management, approval workflows, data retention, access governance, security governance, compliance reporting |
| Policy registry | Name, category, owner, effective/review dates, status, risk level |
| Policy categories | Security, privacy, data handling, billing, communications, AI governance, operational standards |
| Approval center | Pending requests with approve, reject, request changes, escalate actions |
| Data retention | Configurable periods for support data, audit logs, feedback, activity logs, knowledge articles |
| Access governance | Role assignments, privileged users, Super Admin access, permission exceptions |
| Governance alerts | Overdue reviews, expired approvals, excessive privilege, high-risk actions, violations |
| Compliance reporting | Governance activities, approval histories, policy compliance, audit summaries |
| Export | PDF, Excel, CSV |
| Audit logging | Policy created/updated, approval completed, exception raised, access review, report generated |
| Filters | Category, status, risk level, owner, review window |

## APIs

| Method | Path | RPC |
|--------|------|-----|
| GET | `/api/compliance-governance-center/overview` | `get_compliance_governance_center(p_filters)` |
| POST | `/api/compliance-governance-center/actions` | `record_compliance_governance_action(p_payload)` |
| GET | `/api/compliance-governance-center/export` | Overview + `record_compliance_governance_action` (generate_report) |

## Founding principle

Trust is built through accountability. Governance should enable responsible growth, not unnecessary complexity.

Aipify Group AS — Bergen, Norway. For the world.
