# Priority & Focus Engine — Phase A.80

**Feature owner:** Customer App

Organizational ABOS engine for priority dimensions and P1–P4 framework with gentle focus support.

## Distinctions

- **TAG Phase 37** — personal focus at `/app/assistant/attention`. Do not modify.
- **Goals & OKR A.65** — objectives/key results at `/app/goals-okr-engine`. Integrate via dashboard links only.
- **A.80 Priority & Focus** — this engine: five dimensions, P1–P4 levels, focus recommendations.

## Route

`/app/priority-focus-engine` — nav id `priorityFocusEngine`

## Tables

- `organization_priority_focus_settings` — org defaults, enabled dimensions
- `organization_priority_items` — dimension, priority_level 1–4, title, summary (max 500), status, due_hint
- `organization_focus_recommendations` — recommendation_type, summary, priority_level, status
- `organization_priority_focus_audit_logs` — metadata-only audit

## Priority dimensions

`operational` · `strategic` · `human` · `knowledge` · `relationship`

## Priority levels

P1 Critical · P2 Important · P3 Planned · P4 Optional

## Permissions

`priority_focus.view` · `priority_focus.manage` · `priority_focus.recommendations.resolve`

## RPCs

Dashboard, card, list items, create/update item, list recommendations, resolve recommendation, export.

## Integrations

TAG personal focus (A.37) · Goals & OKR (A.65) · Unified Tasks (A.62) · Proactive Companion (A.79) · Executive Insights (A.35) · Capacity & Workload (A.64)

ABOS **Operations/Assistance** pillar. Metadata only. Self Love (A.76 planned) monitors fatigue — never guilt or pressure language.
