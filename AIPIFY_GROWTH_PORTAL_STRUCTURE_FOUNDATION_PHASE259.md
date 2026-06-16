# GROWTH Portal Structure Foundation — Phase 259

> **Superseded by [Aipify Partners / PARTNERS portal](./AIPIFY_PARTNERS_PORTAL_STRUCTURE.md).** See [AIPIFY_PORTAL_STRUCTURE_UPDATE.md](./AIPIFY_PORTAL_STRUCTURE_UPDATE.md). Canonical route: `/partners/*`.

## Purpose

Establish the foundational **GROWTH** portal for Aipify Growth Partners — acquire customers, manage pipeline, improve sales skills, and grow with Aipify.

## Hierarchy

```
SUPER    → executive oversight
PLATFORM → Aipify Group operations
GROWTH   → Growth Partner workspace (this phase)
APP      → customer workspace
```

## Access

- **growth_partner** — active `growth_partner_portal_members` with `partner_owner` or `sales_member`
- **growth_manager** — active members with `partner_manager` team role
- **super_admin** — active `platform_admins` super_admin role

All other roles denied.

## Terminology

Use **Growth Partners** — never Affiliate.

## GROWTH navigation (Phase 259)

| Group | Modules |
|-------|---------|
| **Dashboard** | Overview, Performance Summary, Goals |
| **Customers** | Leads, Pipeline, Prospects, Follow-ups |
| **Referrals** | Referral Links, Referral Performance, Referral Rewards |
| **Academy** | Certifications, Training Programs, Sales Playbooks, Knowledge Materials |
| **Marketing** | Marketing Assets, Campaign Templates, Email Templates, Product Catalog |
| **Performance** | Rankings, Revenue Attribution, Growth Metrics, Historical Performance |
| **Account** | Profile, Team Members, Notifications, Settings |

## Dashboard (`/growth`)

Metrics via `get_growth_portal_dashboard`:

- Leads assigned · Conversion metrics · Pipeline overview
- Upcoming follow-ups · Growth Partner rankings
- Monthly performance · Referral statistics · Certification progress

## Implementation

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20261533000000_growth_portal_structure_foundation_phase259.sql` |
| Nav structure | `lib/growth-portal/nav-config.ts` |
| Module lib | `lib/growth-portal/` |
| UI | `components/growth-portal/` |
| APIs | `/api/growth-portal/access`, `/api/growth-portal/dashboard` |
| i18n | `growthPortal.*` in `locales/{en,no,sv,da}/growthPortal.json` |
| Legacy redirects | `/growth-partner/*` → `/growth/*` |

## Distinction

- **PLATFORM** governs Growth Partner programs operationally
- **GROWTH** is the dedicated partner sales workspace
- **APP** remains customer-facing — not implemented in this phase
