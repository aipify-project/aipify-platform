# Aipify Install Engine — Phase A.22

## Vision

**Aipify Install Engine** — Customer App engine with Core RPCs in Supabase.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260726000000_aipify_install_engine_phase_a22.sql` |
| Prefix | `_ain_` |
| Lib | `lib/aipify/aipify-install-engine/` |
| API | `/api/aipify/aipify-install-engine/*` |
| UI | `/app/aipify-install-engine` |
| KC FAQ | `content/knowledge/aipify/aipify-install-engine/faq/aipify-install-engine-faq.md` |

## Core tables

- `organization_installations`
- `install_discovery_results`
- `install_recommendations`
- `install_permission_reviews`

## RPCs

- `start_installation()`
- `advance_install_step()`
- `run_install_discovery()`
- `approve_install_permissions()`
- `accept_install_recommendations()`
- `complete_installation()`
- `get_aipify_install_engine_dashboard()`
- `get_aipify_install_engine_card()`

## Permissions

- `install.view`
- `install.manage`
- `install.discover`
- `install.approve_permissions`

## Integration notes

Extends Install Engine (Phase 17) — lib/install/, /api/install/, /app/install. KC initialization on completion.

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via organizations.id = customers.id.
