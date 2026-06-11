# Admin Assistant Engine — Phase A.6

## Vision

**Provide a practical AI assistant that saves time, improves awareness, and reduces administrative workload.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260711000000_admin_assistant_engine_phase_a6.sql` |
| Prefix | `_aae_` · decision type: `admin_assistant_engine` |
| Lib | `lib/aipify/admin-assistant-engine/`, `lib/core/admin-assistant.ts` |
| API | `/api/aipify/admin-assistant-engine/*`, `/api/assistant/*` |
| UI | `/app/admin-assistant-engine` |
| KC FAQ | `content/knowledge/aipify/admin-assistant-engine/faq/admin-assistant-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `admin_tasks` | Organization-scoped task center with priority and AI-generated flag |
| `admin_assistant_recommendations` | Explainable AI recommendations with accept/reject workflow |
| `admin_assistant_notifications` | Notification center for support, approvals, tasks, reminders |
| `admin_assistant_sessions` | Per-user since-last-login tracking |

## Assistant principles

- Tenant-aware operation
- Explainable recommendations
- Approval before sensitive actions
- Audit logging for important events
- Knowledge-driven responses

## RPCs

- `get_admin_assistant_engine_dashboard()` — full assistant dashboard with all widgets
- `get_admin_assistant_engine_card()` — summary card
- `get_since_last_login_summary()` — since-last-login engine
- `create_admin_task(...)` / `update_admin_task(...)` — task management
- `accept_assistant_recommendation(uuid)` / `reject_assistant_recommendation(uuid, text)`
- `generate_admin_daily_briefing()` — daily operational summary
- `get_assistant_knowledge_suggestions(text)` — Knowledge Center integration
- `mark_assistant_notification_read(uuid)`

## Permissions

- `assistant.view`, `assistant.recommend`, `assistant.manage_tasks`, `assistant.view_notifications`

## TypeScript helpers (`lib/core/admin-assistant.ts`)

- `getSinceLastLoginSummary()`, `createAdminTask()`, `updateAdminTask()`
- `acceptRecommendation()`, `rejectRecommendation()`, `generateDailyBriefing()`
- `getKnowledgeSuggestions()`, `priorityRank()`, `isUrgentTask()`

## API endpoints

- `GET /api/aipify/admin-assistant-engine/dashboard`
- `GET /api/aipify/admin-assistant-engine/card`
- `GET /api/assistant/since-last-login`
- `POST /api/assistant/tasks`
- `POST /api/assistant/recommendations/[id]/accept|reject`

## Dashboard widgets

Since Last Login, Pending Tasks, Pending Approvals, Support Overview, Recommended Actions, Recent Notifications, Knowledge Suggestions, Daily Briefing.

## Audit events

AI-generated tasks, recommendation accept/reject, task assignments, daily briefing generation.

## Principle

The Admin Assistant improves awareness without bypassing permissions — sensitive actions always require human approval.
