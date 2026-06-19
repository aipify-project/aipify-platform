# AIPIFY – PHASE 509
## Communications, Messaging & Notification Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Universal communication layer for APP organizations and Business Packs — inbox, messaging, announcements, notifications, approvals, activity feed, search, domain scoping, Companion integration, and audit logging.

## Layer

**Feature owner: CUSTOMER APP**

- Routes: `/app/communications`, `/app/notifications`, `/app/activity`
- Unified approvals API: `/api/app/approvals/unified` (extends existing Trust & Action `/app/approvals`)
- Business logic: Supabase RPCs — panels are thin clients

## Database

Migration: `supabase/migrations/20261850900000_communications_messaging_notification_engine_phase509.sql`

### Tables

| Table | Purpose |
|-------|---------|
| `organization_communication_messages` | Inbox, DMs, team chat, system messages |
| `organization_communication_announcements` | Org/department/role/pack announcements |
| `organization_communication_notifications` | Unified notification store |
| `organization_communication_activity` | Activity feed events |
| `organization_communication_audit_logs` | Immutable audit trail |

### RPCs

- `get_communication_management_center`
- `get_notification_management_center`
- `get_activity_feed_center`
- `get_unified_approval_center`
- `perform_communication_management_action`
- `search_communications`
- `create_business_pack_communication`
- `get_companion_communication_context`

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/communication-management/` |
| Communication Center UI | `components/app/communication-management/CommunicationManagementPanel.tsx` |
| Notification Center UI | `components/app/communication-management/NotificationManagementPanel.tsx` |
| Activity Feed UI | `components/app/communication-management/ActivityFeedPanel.tsx` |
| APIs | `/api/app/communications/*`, `/api/app/notifications-center`, `/api/app/activity`, `/api/app/approvals/unified`, `/api/assistant/communication-context` |

## Integrations

- **Tasks (506)** — task notifications and approvals aggregated
- **Calendar (507)** — schedule approvals aggregated
- **Documents/Knowledge (508)** — document notifications and approvals aggregated
- **Business Packs** — `create_business_pack_communication` RPC
- **Companion** — `get_companion_communication_context` for briefings and summaries
- **Domains** — messages/notifications scoped by `domain_id`

## i18n

`communicationManagement.*`, `notificationManagement.*`, `activityFeed.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## Principle

> Tasks create work. Calendar manages time. Knowledge stores experience. Communication keeps people connected. Companion helps everyone stay informed.

**END OF PHASE 509**
