# AIPIFY Phase 538 — Universal Activity Feed, Timeline & Since Last Login Engine

**Feature owner:** CUSTOMER APP  
**Module:** `activity_operations`  
**Permissions:** `activity_operations.view` · `activity_operations.manage`

## Purpose

Universal organizational timeline used across the Aipify platform. Every employee, manager, executive, Growth Partner, and administrator immediately understands what happened since their last visit.

**Principle:** Users should never need to search for what changed. Aipify should tell them.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/activity` | Universal Activity Center |
| `/app/since-last-login` | Since Last Login Engine |

## Sections (Activity Center)

Overview · Since Last Login · Organization Activity · My Activity · Team Activity · Approvals · Business Packs · Domains · Companion Insights · Reports

## Database

Migration: `supabase/migrations/20261853800000_universal_activity_feed_timeline_since_last_login_engine_phase538.sql`

| Table | Purpose |
|-------|---------|
| `organization_activity_operations_settings` | Per-org activity engine settings |
| `organization_activity_operations_events` | Timeline events with category, priority, scope |
| `organization_activity_operations_summaries` | Since-last-login and digest summaries |
| `organization_activity_operations_highlights` | Companion highlights of the day |
| `organization_activity_operations_audit_logs` | Audit trail |

## RPCs

- `get_activity_operations_center(p_section)`
- `perform_activity_operations_action(p_action_type, p_payload)`
- `search_activity_operations(p_query, p_limit)`
- `get_companion_activity_operations_context(p_query)`
- `get_my_activity_operations_summary()`

## Code

| Layer | Path |
|-------|------|
| Lib | `lib/activity-operations/` |
| Panel | `components/app/activity-operations/ActivityOperationsPanel.tsx` |
| APIs | `/api/app/activity-operations/*`, `/api/assistant/activity-operations-context` |
| i18n | `customerApp.activityOperations` in en/no/sv/da |
| Nav | `appActivityOperations` in `lib/app/nav-config.ts` |

## Integrations

- **Since Last Login Engine (Phase 258):** wraps `get_since_last_login_engine('customer')` in summary builder
- **Executive Briefing:** links to `/app/intelligence/briefing`
- **Universal Search (Phase 537):** activity search + Cmd+K via `searchActivityForCommandBar()`
- **Approvals:** `/app/approvals` approval feed
- **Notifications:** digest and briefing channel metadata
- **Mobile:** `get_my_activity_operations_summary()` mobile-ready routes

## Acceptance criteria

- Universal Activity Center at `/app/activity`
- Since Last Login Engine at `/app/since-last-login`
- Personal, organization, and team timelines
- Activity categories and prioritization (ℹ️ ⚠️ 🚨 🛡 ✅ ⏳)
- Executive briefing integration payload
- Activity intelligence (trends, patterns, anomalies)
- Companion integration and highlights
- Approval, Business Pack, and domain activity feeds
- Search integration and audit logging

**END OF PHASE 538.**
