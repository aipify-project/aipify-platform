# AIPIFY – PHASE 528
## EVENTS, BOOKINGS & SCHEDULING OPERATIONS ENGINE

**Aipify Group AS** · Bergen. Norway. For the world.

**Feature owner:** CUSTOMER APP

## Purpose

Universal Events, Bookings & Scheduling Engine — appointments, reservations, meetings, events, resources, and scheduling operations. Extends **Phase 507** calendar infrastructure.

## Core principle

Time is one of the most valuable resources an organization owns. Aipify helps organizations organize time efficiently.

## Routes

| Surface | Route |
|---------|-------|
| Scheduling Center | `/app/scheduling` |
| Calendar Engine | `/app/calendar` |
| Event Management | `/app/events` |
| Booking Engine | `/app/bookings` |

## Database

**Migration:** `supabase/migrations/20261852800000_events_bookings_scheduling_operations_engine_phase528.sql`

**New tables (extends Phase 507):**
- `organization_scheduling_settings`
- `organization_scheduling_availability_blocks`
- `organization_scheduling_meeting_notes`
- `organization_scheduling_workflow_links`
- `organization_scheduling_audit_logs`

**Phase 507 tables used:** `organization_calendar_events`, `organization_calendar_resources`, `organization_calendar_resource_bookings`, `organization_calendar_recurring`, `organization_calendar_sync_connections`

**RPCs:**
- `get_scheduling_operations_center(p_section)`
- `perform_scheduling_operations_action(p_action_type, p_payload)`
- `get_companion_scheduling_operations_context(p_query)`
- `get_my_scheduling_operations_summary()`

**Module:** `scheduling` · permissions `scheduling.view` / `scheduling.manage`

## App layer

- `lib/scheduling-operations/`
- `components/app/scheduling-operations/SchedulingOperationsPanel.tsx`
- `app/api/app/scheduling-operations/*`
- `app/api/assistant/scheduling-operations-context`

## Integrations

- **Phase 507 Calendar Engine** — events, resources, bookings, recurring, sync prep
- **Asset / Property / People / Project engines** — via workflow links and resource types
- **Business Packs** — `business_pack_key` on events and recurring schedules
- **Domain** — organization-wide and per-domain via `domain_id`
- **Companion** — schedule queries, resource booking context
- **External calendars** — Outlook, Microsoft 365, Google, Apple, Exchange (prepared via sync connections)

## Acceptance criteria

- ✅ Scheduling Center created
- ✅ Calendar Engine (Phase 507 + `/app/calendar` panel upgrade)
- ✅ Event Management created
- ✅ Appointment Engine created
- ✅ Booking Engine created
- ✅ Resource Booking created
- ✅ Availability Management created
- ✅ Recurring Scheduling created
- ✅ Calendar Integration prepared
- ✅ Companion Integration created
- ✅ Workflow Integration created
- ✅ Business Pack Integration created
- ✅ Domain Integration created
- ✅ Reporting created
- ✅ Executive Dashboard (overview metrics in center RPC)
- ✅ Mobile Access supported
- ✅ Audit Logging created

## Final principle

Time is a resource. Scheduling creates coordination. Coordination creates execution.

One Scheduling Engine. One Events & Booking Layer. Unlimited Organizations. Unlimited Business Packs.

**END OF PHASE 528**
