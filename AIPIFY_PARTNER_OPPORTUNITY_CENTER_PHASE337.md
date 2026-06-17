# Partner Opportunity Center — Phase 337

**Feature owner:** GROWTH PARTNER PORTAL

**Route:** `/partner/opportunities`

**Migration:** `20261671000000_partner_opportunity_center_phase337.sql`

## Purpose

Central sales pipeline and opportunity management for Growth Partners — track prospects, forecast revenue, and never lose a lead.

## APIs

- `GET /api/partner/opportunities`
- `GET /api/partner/opportunities/[id]`
- `GET /api/partner/opportunities/forecast`
- `GET /api/partner/opportunities/pipeline`
- `POST /api/partner/opportunities`
- `PATCH /api/partner/opportunities/[id]`

## Pipeline stages

`lead` · `contacted` · `discovery` · `qualified` · `demo_scheduled` · `proposal_sent` · `negotiation` · `closed_won` · `closed_lost`

Platform Admin configurable via `growth_partner_portal_opportunity_stages`.

## RPCs

Helpers: `_gpo337_*`

- `get_partner_opportunities`
- `get_partner_opportunity`
- `get_partner_opportunities_pipeline`
- `get_partner_opportunities_forecast`
- `create_partner_opportunity`
- `update_partner_opportunity`

## Tables

`growth_partner_portal_opportunity_stages` · `growth_partner_portal_opportunities` · `growth_partner_portal_opportunity_activities` · `growth_partner_portal_opportunity_stage_history` · `growth_partner_portal_opportunity_audit_logs`

## Partner rule

Always answer: Who am I talking to? What stage? What next? How much is it worth? What commission?

## KC FAQ

`content/knowledge/aipify/partners-portal/faq/partner-opportunity-center-faq.md`
