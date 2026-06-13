# Context Intelligence Engine

**Phase A.77 · Organizational ABOS context intelligence**

Context Intelligence enables the Aipify Business Operating System (ABOS) to understand organizational situations before assisting: organizational, workspace, user, historical, operational, permission, strategic, and temporal context.

**Mission:** Right assistance, right people, right time, right context.

**Feature owner:** Customer App · Route `/app/context-intelligence-engine` · APIs `/api/aipify/context-intelligence-engine/*`

**Prerequisites:** [ORGANIZATION_WORKSPACE_ENGINE_PHASE_A75.md](./ORGANIZATION_WORKSPACE_ENGINE_PHASE_A75.md) · [ORGANIZATIONAL_MEMORY_ENGINE_PHASE_A34.md](./ORGANIZATIONAL_MEMORY_ENGINE_PHASE_A34.md) · [HUMAN_OVERSIGHT_ENGINE_PHASE_A40.md](./HUMAN_OVERSIGHT_ENGINE_PHASE_A40.md)

**Distinct from Phase 35:** [CONTEXT_ENGINE.md](./CONTEXT_ENGINE.md) — calendars and UCL at `/app/assistant/context`; A.77 is organizational ABOS context intelligence.

---

## Philosophy

Context before assistance — Aipify composes organizational intelligence from structure, memory, permissions, and operational signals. Metadata only; humans retain control.

## Eight context dimensions

| Dimension | Scope | Primary signals |
|-----------|--------|-----------------|
| Organizational | Tenant boundary | `organization_users`, role permissions |
| Workspace | Operational contexts | `organization_workspaces`, `workspace_members` |
| User | Acting identity | Active users, `workspace_user_context` |
| Historical | Wisdom & precedents | `organization_memory_records`, decision register |
| Operational | In-flight work | `organization_tasks`, pending oversight approvals |
| Permission | Access boundaries | `organization_role_permissions` |
| Strategic | Goals & alignment | `organization_objectives`, decisions |
| Temporal | Time-bound context | `calendar_events` (Phase 35 integration) |

## Context gaps

Table `organization_context_gaps` — gap_type, dimension, summary (max 500 chars), severity, status. Auto-detection via `_cie_refresh_gaps()` when settings allow. Resolution requires `context_intelligence.gaps.resolve`.

## Permissions

- `context_intelligence.view`
- `context_intelligence.manage`
- `context_intelligence.gaps.resolve`

## RPCs

- `get_context_intelligence_engine_dashboard()`
- `get_context_intelligence_engine_card()`
- `list_organization_context_gaps(p_status, p_limit)`
- `resolve_organization_context_gap(p_gap_id, p_resolution_note, p_status)`
- `export_context_intelligence_summary(p_format)`

## Integration links

Dashboard returns links to Context Engine Phase 35, Organizational Memory, Organization & Workspace, and Human Oversight.

## Self Love (A.76)

Self Love monitors context quality — stale dimensions, contradictions, gap patterns — and suggests improvements without storing prohibited content.

## Code

- Migration: `supabase/migrations/20260922000000_context_intelligence_engine_phase_a77.sql`
- Core: `lib/core/context-intelligence.ts`
- Client: `lib/aipify/context-intelligence-engine/`
- Panel: `components/app/context-intelligence-engine/`
- ILM: `aipify-core/knowledge/internal-language-model/context-intelligence-engine.txt`

## Tables

`organization_context_intelligence_settings` · `organization_context_gaps`

## i18n

`customerApp.contextIntelligenceEngine.*` · `customerApp.nav.contextIntelligenceEngine` in en/no/sv/da.
