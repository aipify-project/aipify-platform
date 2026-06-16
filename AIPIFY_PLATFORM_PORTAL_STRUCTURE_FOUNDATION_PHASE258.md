# PLATFORM Portal Structure Foundation — Phase 258

## Purpose

Establish the foundational **PLATFORM** portal for Aipify Group AS — the operational heartbeat for internal staff managing daily operations across the ecosystem.

## Hierarchy

```
SUPER    → executive oversight & governance
PLATFORM → operational administration (this phase)
APP      → customer workspace
GROWTH   → Growth Partner surface
```

## Access

- **super_admin** and **platform_support** (Platform Administrator) only
- Enforced via `PlatformAuthGuard`, `getPlatformProfile()`, and `_ppsf258_require_platform_access()` RPCs
- Suspended Platform Administrators are denied

## PLATFORM navigation (Phase 258)

| Group | Modules |
|-------|---------|
| **Operations** | Operations Overview, Platform Health, Deployments, Audit Logs |
| **Customers** | Organizations, Customer Success, Support |
| **Commercial** | Payments, Subscriptions, Marketplace, Growth Partners |
| **Knowledge** | Knowledge Center, Translation Management, Documentation |
| **Product** | Business Packs, Product Management, Installation Oversight |
| **Audit & Governance** | Activity Logs, Governance Records, Security Reviews |

## Dashboard (`/platform`)

Aggregate operational metrics via `get_platform_portal_dashboard`:

- Organizations requiring attention
- Active subscriptions
- Open support workload
- Payment status summaries
- Customer Success indicators
- Marketplace moderation statistics
- Growth Partner performance summaries
- Product and deployment updates

## Implementation

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20261532000000_platform_portal_structure_foundation_phase258.sql` |
| Nav structure | `lib/platform/nav-groups.ts`, `lib/platform/nav-config.ts` |
| Module lib | `lib/platform-portal/` |
| UI | `components/platform/platform-portal/` |
| API | `/api/platform-portal/dashboard` |
| i18n | `platform.portalStructure.*`, `platform.nav.*`, `platform.navGroups.*` in `locales/{en,no,sv,da}/platform.json` |

## Distinction

- **SUPER** (`/super/*`) — executive metrics only; no daily operations
- **PLATFORM** (`/platform/*`) — support, finance, marketplace, customer success, deployments
- **APP** (`/app/*`) — customer-facing workspace (not implemented in this phase)

Foundation placeholder pages indicate modules awaiting full operational implementation in later phases.
