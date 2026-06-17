# AIPIFY – PHASE 328
## COMPANION FOLLOW-UP ENGINE

**Feature owner:** CUSTOMER APP

## Purpose

Help users consistently follow through on commitments, conversations, meetings, tasks, opportunities and responsibilities — transparent, configurable, human-centered.

## Routes

- `/app/companion/follow-ups` (canonical)
- `/dashboard/companion/follow-ups` (legacy redirect)

## APIs

- `GET /api/aipify/follow-ups`
- `GET /api/aipify/follow-ups/open`
- `GET /api/aipify/follow-ups/overdue`
- `GET /api/aipify/follow-ups/waiting`
- `POST /api/aipify/follow-ups`
- `PATCH /api/aipify/follow-ups/[id]`

## Principles

Aipify assists with follow-up. Users remain responsible for decisions and communication. Every follow-up includes transparent explanation.

## Permissions

- Employees: personal follow-ups
- Managers: team follow-ups (when enabled)
- Owners / executives: organization-wide visibility
- Administrators: per assigned permissions

## Tables

`companion_follow_up_settings` · `companion_follow_up_records` · `companion_follow_up_reminders` · `companion_follow_up_dependencies` · `companion_follow_up_timeline` · `companion_follow_up_audit_logs`
