# Orchestration Engine — Phase 68

Cross-module coordination layer that turns Aipify from isolated modules into one coordinated AI business operating system.

## Philosophy

Modules emit events. Orchestration evaluates context, matches rules, runs flows, and dispatches safe actions — always traceable, permission-safe, tenant-isolated, and stoppable.

**Orchestration never bypasses Emergency Stop, Policy Engine, or Governance.**

## Routes

| Route | Purpose |
|-------|---------|
| `/app/orchestration` | Dashboard |
| `/app/orchestration/events` | Event log |
| `/app/orchestration/flows` | Flow tracking |
| `/app/orchestration/rules` | Rule management |
| `/app/orchestration/settings` | Tenant settings |

## API

| Endpoint | Method | RPC |
|----------|--------|-----|
| `/api/aipify/orchestration/events` | GET, POST | `list_orchestration_events`, `emit_orchestration_event` |
| `/api/aipify/orchestration/flows` | GET | `list_orchestration_flows` |
| `/api/aipify/orchestration/dashboard` | GET | `get_orchestration_dashboard` |
| `/api/aipify/orchestration/process` | POST | `process_orchestration_events` |
| `/api/aipify/orchestration/unonight/seed` | POST | `seed_unonight_orchestration_rules` |

## Library

`lib/aipify/orchestration/` — types, parse, module constants.

## Migration

`supabase/migrations/20260615800000_orchestration_engine_phase68.sql`

Tables: `orchestration_events`, `orchestration_rules`, `orchestration_flows`, `orchestration_steps`, `orchestration_dispatches`, `orchestration_settings`, `orchestration_audit_log`.

## Dispatch targets (V1)

- Action Center (`_ach_upsert_item`)
- Desktop Companion (`_dk_upsert_event`)
- Briefing (`_bs_upsert_event`)
- Knowledge Center gaps (`_kc_upsert_gap`)
- Security incidents (`create_security_incident`)
- Governance approvals (`aipify_approval_requests`)
- Memory observations (`_mem_upsert_observation`)
- Learning events (`record_learning_event`)
- Quality developer reports (`aipify_quality_reports`)

## Emitting events

```typescript
await supabase.rpc("emit_orchestration_event", {
  p_payload: {
    source_module: "quality",
    source_type: "quality_incident",
    source_id: incidentId,
    event_type: "quality.incident.created",
    severity: "critical",
    payload: { title: "Upgrade flow broken", type: "upgrade_flow" },
  },
});
```

## Unonight pilot

`POST /api/aipify/orchestration/unonight/seed` seeds tenant-specific rules for verification queue, support drafts, upgrade flow, knowledge gaps, and marketplace approval delays.

## Knowledge Center

Import FAQ: `POST /api/aipify/knowledge/import-seed-content` with `{ "overwrite": true }`

Category: `orchestration-engine`  
Path: `content/knowledge/aipify/orchestration/faq/orchestration-engine-faq.md`

## Out of scope (V1)

- Autonomous production changes
- Automatic deploys, billing changes, account bans
- Cross-tenant orchestration
- Visual flow builder
- ML-based routing
