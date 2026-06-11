# Notification & Communication Engine — Phase A.17

## Vision

**Centralized organization communication across Aipify Core — tenant-aware, role-aware, preference-driven, and auditable.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260722000000_notification_communication_engine_phase_a17.sql` |
| Prefix | `_nce_` · decision type: `notification_communication_engine` |
| Lib | `lib/aipify/notification-communication-engine/`, `lib/core/notification-communication.ts` |
| API | `/api/aipify/notification-communication-engine/*`, `/api/notifications/*` |
| UI | `/app/notification-communication-engine` |
| KC FAQ | `content/knowledge/aipify/notification-communication-engine/faq/notification-communication-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `organization_communication_notifications` | Full notification lifecycle with category, priority, action URLs, delivery state |
| `communication_notification_preferences` | Per-user channels, frequency, quiet hours, category subscriptions |
| `communication_digests` | Daily/weekly/approval/support digests with metadata-only summaries |

## Categories

support · approvals · tasks · integrations · governance · quality · onboarding · billing · system_alerts

## Delivery channels

Initial: in-app, dashboard (mirrors to A.9 `organization_notifications`), email (scaffold). Future hooks documented: push, SMS, messaging, desktop.

## RPCs

- `send_organization_notification()` — generic entry for other phase modules
- `send_notification()` / `send_critical_alert()`
- `mark_notification_read()` / `dismiss_notification()`
- `get_notification_unread_count()`
- `get_communication_preferences()` / `save_communication_preferences()`
- `generate_communication_digest()` / `get_communication_digests()`
- `get_notification_communication_engine_dashboard()` / `get_notification_communication_engine_card()`

## Permissions

- `notifications.view`, `notifications.manage`, `notifications.send`, `notifications.configure`

## TypeScript helpers (`lib/core/notification-communication.ts`)

- `sendNotification()`, `sendCriticalAlert()`, `markAsRead()`, `dismissNotification()`
- `getUnreadCount()`, `generateDigest()`, `saveCommunicationPreferences()`

## API endpoints

- `GET /api/aipify/notification-communication-engine/dashboard`
- `GET /api/aipify/notification-communication-engine/card`
- `POST /api/notifications/[id]/read|dismiss`
- `GET|POST /api/notifications/preferences`
- `GET|POST /api/notifications/digests`

## Audit events

`notification_sent`, `notification_dismissed`, `notification_preferences_saved`, `notification_digest_generated`, `critical_alert_sent`, `notification_delivery_failed`

## Integration notes

- **A.9 Operations Dashboard:** `send_organization_notification()` mirrors to `organization_notifications` for widget compatibility
- **Phase 25 Presence:** Quiet hours align with `presence_notification_preferences` (tenant_id = organization_id)
- **Phase 26 Command Center / Notification Engine:** A.17 is org-scoped communication; Presence handles customer-facing delivery surfaces
- **Trust Architecture:** Payloads store metadata only — no email content, chat, or PII

## Principle

Communication informs and prepares — humans decide. Professional tone, no enthusiasm spam.
