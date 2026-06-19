# AIPIFY – PHASE 510
## License, Subscription & Capacity Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Complete commercial engine controlling APP licenses, domain licenses, Business Pack licenses, user capacity, subscription status, and access rules.

## Core principle

- **Business Packs** define functionality
- **Licenses** define capacity
- **Employees** consume capacity — they are not sold features
- Same Business Packs for all sizes; larger orgs pay for scale, not hidden features

## Layer

**Feature owner: CUSTOMER APP**

- Route: `/app/licenses` (commercial dashboard)
- Trust & ownership: `/app/license` (Phase 20 — unchanged)
- Business logic: Supabase RPCs — panels are thin clients

## Database

Migration: `supabase/migrations/20261851000000_license_subscription_capacity_engine_phase510.sql`

### Tables

| Table | Purpose |
|-------|---------|
| `organization_app_license_state` | APP license status (active, trial, grace, suspended, cancelled) |
| `organization_user_capacity_pool` | Included + purchased employee capacity |
| `organization_license_subscription_audit_logs` | Immutable commercial audit trail |

### RPCs

- `get_license_subscription_center` — unified license dashboard
- `perform_license_subscription_action` — purchase capacity, sync, upgrade flows
- `get_companion_license_context` — Companion licensing awareness
- `assert_organization_employee_capacity` — enforcement before employee add
- `get_customer_license_dashboard` — enhanced wrapper (App Store compat)

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/license-management/` |
| License Dashboard UI | `components/app/license-management/LicenseSubscriptionManagementPanel.tsx` |
| APIs | `/api/app/licenses`, `/api/app/licenses/action`, `/api/assistant/license-context` |

## Integrations

- **License Center (20)** — subscription trust at `/app/license`
- **Domain License (505A)** — domain pool and per-domain pack installs
- **App Store (502)** — marketplace; domain required before pack install
- **Employee Management (503)** — capacity enforcement on invite/reactivate
- **Companion** — `get_companion_license_context`

## Subscription statuses

| Status | Access |
|--------|--------|
| Active | Full access |
| Trial | Limited-time access |
| Grace Period | Warning; billing resolution allowed |
| Suspended | Billing, invoices, support, renewal only |
| Cancelled | Organization disabled; data retained per policy |

## i18n

`licenseManagement.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## Principle

> Business Packs provide functionality. Licenses provide scale. Domains define deployment. Employees consume capacity.

**END OF PHASE 510**
