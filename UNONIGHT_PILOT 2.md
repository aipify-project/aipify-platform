# Unonight Pilot Installation (Phase 57)

Unonight is Aipify’s first live pilot tenant. All Unonight-specific configuration lives in the integration adapter and preset — not in Aipify core.

## Architecture

| Layer | Location |
|-------|----------|
| Generic pilot primitives | `supabase/migrations/20260614500000_unonight_pilot_installation_phase57.sql` |
| Unonight preset & adapter | `lib/aipify/integrations/unonight/` |
| Pilot types & jobs | `lib/aipify/pilot/` |
| Tenant knowledge seed | `content/knowledge/unonight/` |
| Platform install UI | `/platform/install/unonight` |
| Tenant pilot dashboard | `/platform/customers/[id]/pilot-status` |

## Tenant model

- `customers` remains the billing/tenant record.
- `aipify_tenant_profiles` extends customers with slug, pilot status, industry, and stage.
- `tenant_modules` gains a `mode` column (`draft_only`, `read_only`, `approval_required`, etc.).

## Pilot flow

1. **Create tenant** — `POST /api/aipify/install/unonight/create-tenant` calls `provision_pilot_tenant` with `UNONIGHT_PILOT_PRESET`.
2. **Enable safe modules** — knowledge, support AI (draft), governance, audit, discovery, insights (read-only).
3. **Seed knowledge** — imports `content/knowledge/unonight/**/*.md` via `import_tenant_knowledge_seed`.
4. **Run discovery** — Unonight adapter supplies findings; stored in `aipify_tenant_discovery_runs`.
5. **Connect integrations** — platform admin marks adapters connected (read-only first).
6. **Review checklist** — 20 seeded items in `aipify_tenant_pilot_checklist`.

## Safety (pilot stages 1–2)

- Support AI: `draft_only` — no external send.
- Governance: `enterprise_control` with blocked high-risk actions.
- Emergency stop seeded via TACC (`ensure_tacc_emergency_stop`).
- No automatic content approval, bans, refunds, or billing changes.

## Worker jobs (callable via API / future cron)

| Job | Function |
|-----|----------|
| `unonight_initial_discovery` | `runInitialDiscoveryJob` |
| `unonight_sync_workflow_events` | `runWorkflowEventSyncJob` |
| `unonight_pilot_health_check` | `runPilotHealthCheckJob` |

## APIs

- `GET /api/aipify/install/unonight/status`
- `POST /api/aipify/install/unonight/create-tenant`
- `POST /api/aipify/install/unonight/enable-safe-modules`
- `POST /api/aipify/install/unonight/seed-knowledge`
- `POST /api/aipify/install/unonight/run-discovery`
- `GET /api/aipify/tenants/:tenantId/pilot-status`
- `GET/PATCH /api/aipify/tenants/:tenantId/modules/:moduleKey`
- `GET/POST /api/aipify/tenants/:tenantId/integrations/...`
- `POST /api/aipify/tenants/:tenantId/discovery/run`

## Applying the migration

```bash
supabase db push
```
