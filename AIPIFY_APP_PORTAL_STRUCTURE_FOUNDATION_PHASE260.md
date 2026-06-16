# AIPIFY – PHASE 260 — APP Portal Structure Foundation

**Feature owner:** CUSTOMER APP  
**Route:** `/app/*`  
**Access:** `organization_owner`, `organization_admin`, `organization_manager`, `organization_member` (mapped from tenant `users.role`)

## Purpose

Structural foundation for the customer-facing APP portal — subscriptions, Business Packs navigation, team collaboration, operational visibility, and license enforcement. No Business Pack runtime functionality in this phase.

## Hierarchy

```
SUPER
↓
PLATFORM
↓
├── APP   ← this phase
└── PARTNERS
```

## Deliverables

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20261534000000_app_portal_structure_foundation_phase260.sql` |
| Nav config | `lib/app-portal/nav-config.ts` (7 groups, 25 routes) |
| Portal lib | `lib/app-portal/*` |
| UI | `components/app/app-portal/*` |
| APIs | `/api/app-portal/dashboard`, `/access`, `/feature-access` |
| Dashboard | `app/app/page.tsx` |
| Foundation pages | `app/app/{since-last-login,organization,business-packs,operations,billing,support,account}/**` |
| Nav wiring | `lib/app/nav-groups.ts`, `lib/app/build-nav.ts` |
| License gate | `AppPortalLicenseGate` + `get_app_portal_feature_access()` |
| Since Last Login | `/app/since-last-login` (reuses `SinceLastLoginSummaryPanel`) |
| Knowledge FAQ | `content/knowledge/aipify/app-portal/faq/app-portal-knowledge-center-faq.md` |
| i18n | `customerApp.portalStructure.*` in en/no/sv/da |

## RPCs

- `get_app_portal_access()` — tenant role + subscription check
- `get_app_portal_feature_access(p_feature)` — plan-gated features
- `get_app_portal_dashboard()` — org overview, team, subscription, packs, tasks, SLL summary

## License enforcement

Gated features: `business_packs`, `workflows`, `advanced_insights`, `billing`, `team_management`, `integrations`. Unlicensed direct URLs show upgrade panel — no hidden bypass.

## Phase 260 addon — Integrations & self-onboarding

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20261535000000_app_portal_integrations_self_onboarding_phase260_addon.sql` |
| Nav | APP → Platform → Integrations (`lib/app-portal/nav-config.ts`) |
| Lib | `lib/app-portal/integrations/*` |
| UI | `AppPortalIntegrationsHubPanel`, `AppPortalIntegrationSetupPanel` |
| Routes | `/app/platform/integrations`, `/connect`, `/connected`, `/api-access` |
| APIs | `/api/app-portal/integrations/*` |
| FAQ | `content/knowledge/aipify/app-portal/faq/app-portal-integrations-knowledge-center-faq.md` |

Setup framework supports OAuth and manual API key flows with read-only default, scope approval, masked credentials, test/remove/replace, and audit logging. Provider adapters not implemented in this phase.

## Apply migration

```bash
supabase db push
# or apply 20261534000000_app_portal_structure_foundation_phase260.sql
```
