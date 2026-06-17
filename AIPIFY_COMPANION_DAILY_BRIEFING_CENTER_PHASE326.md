# AIPIFY – PHASE 326
## COMPANION DAILY BRIEFING CENTER

**Feature owner:** CUSTOMER APP

## Purpose

Primary daily Companion experience — personalized overview of priorities, events, insights, tasks and organizational activity. Signal over noise.

## Routes

- `/app/companion/daily-briefing` (canonical)
- `/dashboard/companion/daily-briefing` (legacy redirect)

## APIs

- `GET /api/aipify/daily-briefing`
- `GET /api/aipify/daily-briefing/history`
- `GET /api/aipify/daily-briefing/focus`
- `POST /api/aipify/daily-briefing/generate`

## Principles

Start the day with clarity. Reduce information overload. Surface what matters most. Briefing modes integrate with the Personalization Engine.

## Permissions

- Employees: personal briefings
- Managers: personal and team (when enabled)
- Owners / executives: organization-level briefings
- Administrators: per assigned permissions

## Tables

`companion_daily_briefing_settings` · `companion_daily_briefing_records` · `companion_daily_briefing_items` · `companion_daily_briefing_focus` · `companion_daily_briefing_timeline` · `companion_daily_briefing_audit_logs`
