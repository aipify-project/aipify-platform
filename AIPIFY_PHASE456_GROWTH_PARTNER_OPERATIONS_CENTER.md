# AIPIFY – PHASE 456
## TITLE: Growth Partner Operations Center
## PURPOSE
Create a complete operational environment for certified Growth Partners at `/app/growth-partner` — leads, customers, commissions, payouts, training, and marketing resources in one partner-scoped workspace.

## OBJECTIVES
- Growth Partner Operations Center with eleven sections
- Lead Management, Opportunity Pipeline, Customer Portfolio
- Commission Center, Payout Center, Marketing Resources
- Training, Certifications, Performance, Support
- Governance: audit log, partner attribution, commission and payout traceability
- Role security: `growth_partner` sees only own data

## REQUIREMENTS
- Route hub: `/app/growth-partner/*`
- RPC: `get_growth_partner_operations_center()`
- API: `GET /api/growth-partner/operations-center`
- i18n: `customerApp.growthPartnerOperationsCenter` in en/no/sv/da
- Status standard: completed, not_allowed, requires_attention, information, restricted, verified, waiting

## COMPONENTS
- Migration: `20261845600000_growth_partner_operations_center_phase456.sql`
- Lib: `lib/growth-partner-operations-center/`
- Panel: `components/app/growth-partner-operations-center/`
- Layout nav: `app/app/growth-partner/layout.tsx`
- Section pages: dashboard, leads, opportunities, customers, commissions, payouts, resources, training, certifications, performance, support

## SECURITY REQUIREMENTS
GitHub-style 2FA, enterprise permissions, audit logging remain active. Growth Partners may not access Platform Admin, Super Admin, other partner data, or customer internal systems.

## AIPIFY PRINCIPLES
People First. Technology Second. Build businesses. Build partners. Build growth.

**Feature owner: CUSTOMER APP**

END OF PHASE.
