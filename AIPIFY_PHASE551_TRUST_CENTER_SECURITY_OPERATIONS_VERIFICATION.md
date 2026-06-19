# AIPIFY – PHASE 551

**TITLE:** Trust Center, Security Operations & Verification Engine  
**PURPOSE:** Trust layer providing organizations complete visibility into security, access, identity, verification, audit history, and trust-related activities.

## Feature owner

**CUSTOMER APP** — `/app/trust`

## Routes

| Route | Purpose |
|-------|---------|
| `/app/trust` | Trust Center hub |
| `/app/trust/devices` | Device Trust Center |
| `/app/trust/2fa` | 2FA Center |
| `/app/trust/audit` | Audit History Center |
| `/app/trust-action-engine` | Legacy Trust & Action explainability (relocated from `/app/trust`) |

## RPCs

- `get_organization_trust_center(p_section)`
- `perform_organization_trust_center_action(p_action_type, p_payload)`
- `get_organization_trust_center_mobile_summary()`
- `get_companion_trust_advisor_context(p_query)`

Integrates Risk Engine (534), Governance Engine (515), Quality Engine (533).

## Tables

`organization_trust_center_settings` · `organization_trust_identities` · `organization_trust_verifications` · `organization_trust_devices` · `organization_trust_sessions` · `organization_trust_security_events` · `organization_trust_partner_verifications` · `organization_trust_org_verifications` · `organization_trust_permission_snapshots` · `organization_trust_compliance_links` · `organization_trust_score_snapshots` · `organization_trust_center_audit_logs`

## APIs

- `GET /api/app/trust-center-operations`
- `POST /api/app/trust-center-operations/action`
- `GET /api/app/trust-center-operations/mobile`
- `GET /api/assistant/trust-advisor-context`

**END OF PHASE.**
