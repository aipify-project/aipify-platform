# Multi-Agent Collaboration System — Phase 74

Build a safe, explainable, and auditable Multi-Agent Collaboration System where specialized Aipify agents work together as a coordinated team under Governance and Orchestration control.

## Philosophy

Agents are specialists — not autonomous employees. They collaborate through Orchestration, are constrained by Policy Engine, monitored by Security, and audited continuously. Governance decides when agents disagree.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/agents` | Agent registry, health dashboard, recent collaboration events |
| `/app/agents/[id]` | Agent detail — responsibilities, capabilities, permissions, metrics, events |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/agents/card` | `get_agents_card` |
| `GET /api/aipify/agents/dashboard` | `get_agents_dashboard` |
| `GET /api/aipify/agents` | `list_collaboration_agents` |
| `GET/PATCH /api/aipify/agents/[id]` | `get_collaboration_agent` / `update_tenant_agent_status` |
| `POST /api/aipify/agents/coordinate` | `coordinate_agent_collaboration` |
| `POST /api/aipify/agents/dispatch` | `dispatch_agent_message` |
| `POST /api/aipify/agents/[id]/precheck` | `evaluate_agent_action` |

## Initial agent registry

Support, Knowledge, Quality, Governance, Security, Action, Desktop, Briefing, Learning, Marketplace, Blueprint — each with risk level, capabilities, and permissions.

## Message types

`request_information`, `provide_information`, `request_approval`, `provide_recommendation`, `create_action`, `escalate`, `record_learning`, `request_review`

## Sample workflow

Support low-confidence scenario: Support → Knowledge → Governance → Action → Desktop → Learning. All steps logged and orchestration event emitted.

## Migration

`supabase/migrations/20260616400000_multi_agent_collaboration_phase74.sql`

Tables: `collaboration_agents`, `collaboration_agent_capabilities`, `collaboration_agent_permissions`, `tenant_agent_settings`, `collaboration_agent_events`, `collaboration_agent_metrics`, `collaboration_agent_audit_log`

Note: Uses `collaboration_agents` to avoid conflict with enterprise deployment `aipify_agents` (Phase 66).

## Integrations

- **Orchestration Engine:** `emit_orchestration_event` on coordinated flows
- **Policy Engine:** `evaluate_policy` in `evaluate_agent_action`
- **Governance:** approval requirements for high/restricted risk agents
- **Audit:** `_tacc_log_audit` via `_mag_log_audit`

## Knowledge Center

Category: `agents`  
FAQ: `content/knowledge/aipify/agents/faq/agents-faq.md`

## Out of scope (V1)

- Fully autonomous agents
- Self-replicating agents
- Agents modifying Core code
- Agents bypassing Governance or sharing secrets
