# AIPIFY – PHASE 507
## Calendar, Scheduling & Resource Management Engine

**Feature owner:** CUSTOMER APP  
**Route:** `/app/calendar`  
**Migration:** `supabase/migrations/20261850700000_calendar_scheduling_resource_management_engine_phase507.sql`

## Purpose

Universal Calendar & Scheduling Engine for all APP organizations and Business Packs. Org-scoped planning layer — distinct from Phase 35 personal calendar (`calendar_events` at `/app/assistant/calendars`).

## Core principle

Aipify helps organizations organize time. Aipify does not replace people.

## Structure

```
PLATFORM → APP → CALENDAR ENGINE → EMPLOYEES
```

## Components

| Layer | Path |
|-------|------|
| Migration & RPCs | `supabase/migrations/20261850700000_*.sql` |
| Library | `lib/calendar-management/` |
| Calendar Center UI | `app/app/calendar`, `components/app/calendar-management/` |
| APIs | `/api/app/calendar`, `/api/app/calendar/action`, `/api/assistant/calendar-context` |

## Calendar Center sections

My Calendar · Team Calendar · Department Calendar · Resource Calendar · Bookings · Approvals · Schedules · Reports

## Views (UI)

Day · Week · Month · Agenda (+ quarter, year, timeline, resource in RPC metadata)

## RPCs

- `get_calendar_management_center()` — dashboard bundle
- `perform_calendar_management_action()` — create, book, cancel, approve, reject, recurring, leave
- `create_business_pack_calendar_event()` — Business Pack entry point
- `get_companion_calendar_context()` — availability, scheduling intents

## Tables

`organization_calendar_resources` · `organization_calendar_events` · `organization_calendar_event_assignees` · `organization_calendar_resource_bookings` · `organization_calendar_recurring` · `organization_calendar_approvals` · `organization_calendar_leave` · `organization_calendar_sync_connections` · `organization_calendar_notifications` · `organization_calendar_audit_logs`

## Resource conflict rules

Resources cannot be double-booked without override. `_cal507_detect_resource_conflict()` warns; managers may override when permitted.

## External sync (prepared)

Outlook · Google · Apple · Microsoft 365 · Teams — `connection_status: pending` until OAuth phases ship.

## Integration

- **Domain (505A):** `domain_id` on events
- **Business Packs:** `create_business_pack_calendar_event()`
- **Module registry:** `calendar` route → `/app/calendar`
- **Personal calendar:** Phase 35 remains at `/app/assistant/calendars`

## i18n

`customerApp.calendarManagement.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## Final principle

Tasks manage work. Calendar manages time. Resources manage availability. Companion coordinates everything.

---

Aipify Group AS · Bergen · Norway · For the world.
