# Module Marketplace Foundation Engine — Phase A.23

## Vision

**Module Marketplace Foundation Engine** — Customer App engine with Core RPCs in Supabase.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260727000000_module_marketplace_foundation_engine_phase_a23.sql` |
| Prefix | `_mmf_` |
| Lib | `lib/aipify/module-marketplace-foundation-engine/` |
| API | `/api/aipify/module-marketplace-foundation-engine/*` |
| UI | `/app/module-marketplace-foundation-engine` |
| KC FAQ | `content/knowledge/aipify/module-marketplace-foundation-engine/faq/module-marketplace-foundation-engine-faq.md` |

## Core tables

- `marketplace_modules`
- `organization_modules`
- `module_dependencies`
- `module_configurations`

## RPCs

- `activate_organization_module()`
- `deactivate_organization_module()`
- `configure_organization_module()`
- `get_module_marketplace_foundation_engine_dashboard()`
- `get_module_marketplace_foundation_engine_card()`

## Permissions

- `modules.view`
- `modules.activate`
- `modules.configure`
- `modules.update`
- `modules.deactivate`

## Integration notes

Extends tenant_modules and commercial packages — syncs activation via _mmf_sync_tenant_module().

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via organizations.id = customers.id.
