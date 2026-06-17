# Partner Self-Billing & Compliance Center — Phase 335

**Feature owner:** GROWTH PARTNER PORTAL

**Route:** `/partner/compliance`

**Migration:** `20261669000000_partner_self_billing_compliance_center_phase335.sql`

## Purpose

Enterprise-grade financial governance for Growth Partner settlements — legal invoice generation, compliance verification, tax and banking management, and settlement eligibility at scale.

## APIs

- `GET /api/partner/compliance`
- `GET /api/partner/compliance/documents`
- `GET /api/partner/compliance/tax-profile`
- `GET /api/partner/compliance/agreements`
- `POST /api/partner/compliance/verify`
- `PATCH /api/partner/compliance/profile`

## Permissions

| Role | Access |
|------|--------|
| Partner Owner | Full read/write |
| Partner Manager | Read only |
| Sales Representative | No access |
| Viewer | No access |

## Eligibility engine

Settlement generation (Phase 334) validates `_gpc335_assert_settlement_eligible` before draft or invoice creation.

Statuses: `eligible` · `partially_eligible` · `not_eligible`

## RPCs

Helpers: `_gpc335_*`

- `get_partner_compliance`
- `get_partner_compliance_documents`
- `get_partner_compliance_tax_profile`
- `get_partner_compliance_agreements`
- `submit_partner_compliance_verification`
- `update_partner_compliance_profile`

## Tables

`growth_partner_portal_compliance_records` · `growth_partner_portal_compliance_business` · `growth_partner_portal_compliance_tax_profiles` · `growth_partner_portal_compliance_banking` · `growth_partner_portal_compliance_documents` · `growth_partner_portal_compliance_timeline` · `growth_partner_portal_compliance_alerts` · `growth_partner_portal_compliance_audit_logs`

## KC FAQ

`content/knowledge/aipify/partners-portal/faq/partner-self-billing-compliance-center-faq.md`

## Design principle

**Compliance by default** — transparency, global scalability, auditability, low administrative burden.
