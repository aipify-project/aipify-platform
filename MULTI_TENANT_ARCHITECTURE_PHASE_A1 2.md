# Multi-Tenant Architecture Engine — Phase A.1

## Vision

**Enable Aipify to support multiple customer organizations securely from one central platform.**

Aipify is built as a standalone SaaS platform. Unonight connects as the first pilot customer — not as embedded logic inside Aipify.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260706000000_multi_tenant_architecture_phase_a1.sql` |
| Prefix | `_mta_` · decision type: `multi_tenant_architecture` |
| Lib | `lib/aipify/multi-tenant-architecture/`, `lib/core/organization.ts` |
| API | `/api/aipify/multi-tenant-architecture/*`, `/api/organizations/*` |
| UI | `/app/multi-tenant`, organization switcher in dashboard shell |
| KC FAQ | `content/knowledge/aipify/multi-tenant-architecture/faq/multi-tenant-architecture-faq.md` |

## Architecture bridge

`organizations.id` references `customers.id` — the canonical tenant identifier used across all Aipify engines. This preserves existing `tenant_id` scoping while introducing the spec-aligned organization model.

## Core tables

| Table | Purpose |
|-------|---------|
| `organizations` | Customer organization record (name, slug, plan, status, branding) |
| `organization_users` | Multi-org membership with roles |
| `organization_user_context` | Selected organization session |
| `organization_modules` | Per-org module activation |
| `organization_settings` | Key-value tenant settings |
| `organization_audit_logs` | Tenant-aware immutable audit history |
| `organization_integrations` | Tenant-scoped integrations |
| `knowledge_faq_items` | Tenant-scoped FAQ items |

## Roles

| Role | Access |
|------|--------|
| Owner | Full access including billing |
| Administrator | Users, settings, modules, audit, AI approvals |
| Manager | Operational overview, tasks, support visibility |
| Support Agent | Support cases, KC search, draft responses |
| Viewer | Read-only |

## RPCs

- `get_multi_tenant_architecture_dashboard()` — full tenant architecture dashboard
- `get_multi_tenant_architecture_card()` — summary card
- `get_user_organizations()` — list orgs for current user
- `get_current_organization()` — resolved org context + role
- `switch_organization(uuid)` — change selected org session
- `toggle_organization_module(text, boolean)` — enable/disable module per org
- `_mta_require_organization()` — validate tenant access (internal)
- `_mta_require_role(text)` — validate permission (internal)
- `_mta_create_audit_log(...)` — write tenant audit entry (internal)

## API endpoints

- `GET /api/aipify/multi-tenant-architecture/dashboard`
- `GET /api/aipify/multi-tenant-architecture/card`
- `GET /api/organizations`
- `POST /api/organizations/switch`

## Seed tenants

| Organization | Slug | Plan | Purpose |
|--------------|------|------|---------|
| Aipify Group AS | `aipify-group` | internal | Internal dogfooding tenant |
| Unonight | `unonight` | internal (pilot) | First external pilot customer |

## Success criteria

- Organizations can be created and backfilled from existing customers
- Users belong to organizations with enforced roles
- Tenant-owned data scoped by `organization_id` (= `customers.id`)
- RLS enabled with RPC-only access pattern
- Modules enabled per organization
- Knowledge Center tenant-scoped
- Audit logs include organization context
- Dashboard shows selected organization with switcher for multi-org users

## Principle

Never allow cross-tenant access. Never query tenant-owned data without organization context. Never hardcode Unonight-specific logic into Aipify Core.
