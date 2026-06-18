# AIPIFY — PHASE 409
## Legal, Compliance & Case Operations Pack Foundation

**Feature owner:** Customer App  
**Route:** `/app/legal`  
**Migration:** `20261689000000_legal_compliance_case_operations_pack_foundation_phase409.sql`  
**Helpers:** `_glcco409_*`

## Purpose

Legal and compliance operations for law firms, legal departments, and advisory organizations — cases, clients, contracts, compliance, document governance, deadlines, and risk with confidentiality-first design.

## Critical design

- Aipify supports legal professionals — **does not provide legal advice**
- Strict client and document isolation
- Access grants with revoke audit
- Immutable legal audit logs
- Document governance and compliance review scaffolds

## Modules

- Legal Overview
- Cases
- Clients
- Contracts
- Compliance
- Documents
- Legal Intelligence
- Governance

## Tables

`legal_pack_settings` · `legal_clients` · `legal_cases` · `legal_contracts` · `legal_compliance_reviews` · `legal_deadlines` · `legal_access_grants` · `legal_advisor_signals` · `legal_audit_logs`

## RPCs

- `get_legal_compliance_case_operations_center()`
- `legal_compliance_case_operations_action()`

## Permissions

- `legal.view`
- `legal.manage`

## i18n

`customerApp.legalComplianceCaseOperationsPack.*` — core locales: en, no, sv, da, pl, uk

## Knowledge Center

FAQ: `content/knowledge/aipify/legal-compliance-case-operations-pack/faq/`

## END OF PHASE
