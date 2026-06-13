# Action Center (Phase 64)

Aipify Action Center is the operational execution layer where users decide what to do next — turning detections, predictions, and recommendations into structured actions.

## Philosophy

Observe → Understand → Prioritize → Recommend → Act → Learn

## Customer App routes

| Route | Purpose |
|-------|---------|
| `/app/actions` | Dashboard — My, Team, Recommended, Critical, Completed, Blocked |
| `/app/actions/inbox` | My assigned actions |
| `/app/actions/assigned` | Team assigned queue |
| `/app/actions/recommended` | Open recommendations |
| `/app/actions/completed` | Recently completed |
| `/app/actions/settings` | Tenant action hub settings |
| `/app/actions/[id]` | Action detail, decisions, feedback |

Note: `/app/action-center` remains the Phase 44 Autonomous Execution Framework (AEF). Phase 64 Decision Hub lives at `/app/actions`.

## Database tables

- `action_settings` — tenant configuration
- `action_templates` — reusable action templates
- `action_items` — prioritized actionable tasks
- `action_assignments` — delegation history
- `action_decisions` — approve, complete, dismiss, block audit
- `action_feedback` — helpful / not helpful signals

## API (`/api/aipify/action-hub/*`)

- `GET card` — home summary widget
- `GET dashboard` — six dashboard sections
- `GET queue` — filtered action list (`?status=`, `?assigned_to_me=true`)
- `GET [id]` — detail with assignments and decisions
- `POST [id]/status` — update status
- `POST [id]/dismiss` — dismiss action
- `POST [id]/feedback` — record feedback
- `POST collect` — collect from Quality, Governance, Knowledge, Memory
- `GET/PATCH settings`
- `POST unonight/seed` — Unonight pilot actions

## Action statuses

Open · Assigned · In Progress · Waiting Approval · Blocked · Completed · Dismissed

## Priority levels

Critical · High · Medium · Low · Informational

## Sources

Support AI, Quality Guardian, Executive Briefing, Knowledge Center, Governance, Memory Engine, Predictions, Desktop Companion

## Unonight pilot

`seed_unonight_pilot_actions` seeds: pending verifications, marketplace listings, support drafts, quality alerts, knowledge gaps.

## Integrations

- **Governance (Phase 54)** — approval-required actions, `_tacc_log_audit` on decisions
- **Memory Engine (Phase 62)** — memory recommendations → action items
- **Quality Guardian** — open incidents → quality actions
- **Knowledge Center** — knowledge gaps → follow-up actions
- **Executive Briefing / Desktop Companion** — configurable collectors

## Library

`lib/aipify/action-hub/` — `types.ts`, `parse.ts`, `presets/unonight-actions.ts`, `jobs.ts` (server-only, not barrel-exported)

## Migration

`supabase/migrations/20260615300000_action_hub_phase64.sql`

## Knowledge Center import

```bash
POST /api/aipify/knowledge/import-seed-content
{ "overwrite": true }
```
