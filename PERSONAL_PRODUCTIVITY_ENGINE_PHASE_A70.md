# Personal Productivity Engine — Phase A.70

**Feature owner:** Customer App

Per-user productivity: preferences, daily briefings, reminders, focus recommendations — metadata only.

## Critical distinction

- **NOT** organizational `organization_tasks` (A.62)
- **NOT** PAME `personal_memories` at `/app/assistant/memory`
- Personal per-user productivity metadata with user control

## Extends

- Desktop Companion (A.38)
- Meeting & Collaboration Intelligence (A.61)
- Unified Task & Follow-Up (A.62) — read-only hooks
- Companion Presence (A.67)

## Route

`/app/personal-productivity-engine` — nav id `personalProductivityEngine`

## Tables

- `personal_productivity_profiles` — user preferences, quiet hours, reminder settings
- `personal_productivity_briefings` — daily briefing records
- `personal_productivity_reminders` — personal reminder metadata
- `personal_productivity_settings` — org-level defaults (optional)

## Permissions

`productivity.view` · `productivity.manage` · `productivity.configure`

## RPCs (`_ppe_` helpers)

- `get_personal_productivity_engine_dashboard()`
- `get_personal_productivity_engine_card()`
- `get_daily_productivity_briefing()`
- `upsert_personal_productivity_profile(jsonb preferences, quiet_hours, reminder_settings)`
- `create_productivity_reminder()`
- `dismiss_productivity_reminder()`
- `generate_daily_briefing()`
- `get_productivity_recommendations()`
- `export_personal_productivity_manifest()`
- `calendar_sync_hook()` — scaffold
- `companion_orb_productivity_summary()` — orb integration counts

## Audit events

`ppe_profile_updated` · `ppe_reminder_created` · `ppe_briefing_generated` · `ppe_automation_approved` · `ppe_manifest_exported`

## Migration

`supabase/migrations/20260912000000_personal_productivity_engine_phase_a70.sql`

## Code paths

- `lib/core/personal-productivity.ts`
- `lib/aipify/personal-productivity-engine/`
- `app/api/aipify/personal-productivity-engine/`
- `components/app/personal-productivity-engine/`
