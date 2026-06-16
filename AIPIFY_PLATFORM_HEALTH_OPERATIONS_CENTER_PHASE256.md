# Platform Health & Operations Center — Phase 256

## Purpose

Centralized operational visibility for Aipify Group AS inside **Platform Admin**. Monitor ecosystem health, manage incidents, review deployments, and audit all center actions before customer impact.

## Layer

**Platform Admin** — `/platform/operations/platform-health`

## Access

- `super_admin` (via `platform_admins`)
- Platform Admin staff (`is_platform_admin()`)
- Customers and Growth Partners: **never**

## Features

1. **System health overview** — authentication, database, email, payments, background jobs, storage, marketplace, notifications
2. **Incident center** — create, update status, internal notes, severity levels
3. **Deployment visibility** — current version, history, initiator, status
4. **Platform alerts** — failed jobs, interruptions, auth anomalies, payment/email issues
5. **Executive summary** — organizations, subscriptions, uptime, incidents, critical alerts
6. **Audit logging** — user, timestamp, action, previous/new state

## Implementation

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20261529000000_platform_health_operations_center_phase256.sql` |
| RPCs | `get_platform_health_operations_center`, `perform_platform_health_operations_action` |
| Module | `lib/platform-health-operations-center/` |
| UI | `components/platform/platform-health-operations-center/` |
| APIs | `/api/platform-health-operations-center/overview`, `/actions` |
| i18n | `platform.platformHealthOperationsCenter.*` in `locales/{en,no,sv,da}/platform.json` |

## Distinction

Distinct from Customer App **Observability & Platform Health Engine (A.19)** — tenant-scoped customer visibility. This center is **internal Aipify Group AS operations only**.
