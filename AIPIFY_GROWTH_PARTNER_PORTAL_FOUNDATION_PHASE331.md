# Growth Partner Portal Foundation — Phase 331

**Feature owner:** GROWTH PARTNER PORTAL (external partner layer)

**Route:** `/partner`

**Migration:** `20261665000000_growth_partner_portal_foundation_phase331.sql`

## Purpose

Establishes the foundational architecture for the Aipify Growth Partner ecosystem — separate from Customer Portal, Platform Admin, and Super Admin.

Growth Partners are independent business operators who help organizations discover, implement, and grow with Aipify. This is **not** an affiliate program.

## Architecture

| Surface | Path |
|---------|------|
| Partner Portal UI | `app/partner/` |
| Components | `components/partner-portal/` |
| Library | `lib/partner-portal/` |
| Core RPCs | `lib/core/partner-portal.ts` |
| APIs | `/api/partner/*` |
| Database | Extends `growth_partner_portal_*` (Foundation 05) |

## Navigation

Dashboard · Opportunities · Customers · Academy · Materials · Commissions · Settlements · Performance · Advisor · Settings

## APIs

- `GET /api/partner/profile`
- `PATCH /api/partner/profile`
- `GET /api/partner/dashboard`
- `GET /api/partner/team`
- `GET /api/partner/activity`
- `POST /api/partner/onboarding`

## Database additions

- `growth_partner_portal_profiles`
- `growth_partner_portal_verifications`
- `growth_partner_portal_onboarding`
- `growth_partner_portal_member_permissions`
- `growth_partner_portal_activity`
- `growth_partner_portal_notifications`

## RPCs

Helpers: `_gpp331_*` · Blueprint: `_gpp331bp_*`

- `get_partner_portal_profile`
- `get_partner_portal_dashboard`
- `get_partner_portal_team`
- `get_partner_portal_activity`
- `update_partner_portal_profile`
- `advance_partner_portal_onboarding`

## Security

- Business verification required before activation
- 2FA required for partner owners, settlement access, and banking changes
- Role-based permissions with audit logging

## Legacy redirects

`/growth-partner/*` → `/partner/*`
