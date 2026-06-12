# Operations Center Foundation Engine (Phase A.32)

**Route:** `/app/operations-center-foundation-engine`  
**Feature owner:** Customer App  
**Migration:** `supabase/migrations/20260814000000_operations_center_foundation_engine_phase_a32.sql`

Cross-module operational command center — aggregates events from Admin Assistant, Support AI, Quality Guardian, Integrations, and Governance into `operations_events` with acknowledge/resolve workflows and full audit via `_ocf_log()`.

## Implementation Blueprint Phase 18

ABOS **Implementation Blueprint Phase 18 — Operations Center Engine Foundation** extends A.32 without new tables. See [IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md) and migration `supabase/migrations/20260965000000_implementation_blueprint_phase18_operations_center.sql`.

Phase 18 adds:

- `_ocf_module_overviews()` — Support, Task, Knowledge, Executive, and Recognition overview blocks (metadata counts only)
- `_ocf_since_last_time_summary()` — Since Last Time counts since previous login or 7-day fallback (pattern from Executive Insights Phase 13)
- `_ocf_blueprint_success_criteria()` — live validation checks
- Extended `get_operations_center_foundation_engine_dashboard()` and card RPCs — **all A.32 fields preserved**

## Distinctions (do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Operations Dashboard A.9** | `/app/operations-dashboard-engine` | Role-aware widget dashboard |
| **Command Center Phase 26** | `/app/command-center` | Presence and notifications |
| **AOC Phase 79** | `/app/operations` | Autonomous operations watchers |
| **Executive Insights A.35** | `/app/executive-insights-engine` | Executive summaries — Since Last Time pattern reused |

## Core tables

`operations_events` — tenant-scoped operational events with category, priority, status, assignment, and metadata.

## Permissions

`operations.view` · `operations.manage` · `operations.assign` · `operations.resolve` · `operations.escalate`

## RPCs

- `get_operations_center_foundation_engine_dashboard()`
- `get_operations_center_foundation_engine_card()`
- `acknowledge_operations_event(p_event_id)`
- `resolve_operations_event(p_event_id)`
- `_ocf_aggregate_events(p_organization_id)`
- `_ocf_module_overviews(p_organization_id)` (Phase 18)
- `_ocf_since_last_time_summary(p_organization_id, p_user_id)` (Phase 18)
- `_ocf_blueprint_success_criteria(p_organization_id)` (Phase 18)

## Lib / UI

- `lib/aipify/operations-center-foundation-engine/`
- `components/app/operations-center-foundation-engine/OperationsCenterFoundationEngineDashboardPanel.tsx`

## Trust

Metadata and counts only — no customer email, chat, order content, or PII. Panels are thin clients; business logic lives in Core RPCs.

## Self Love

Self Love (A.76) cross-linked as a principle — reduce stress, clarify priorities, highlight accomplishments. No ™ in product copy. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md).
