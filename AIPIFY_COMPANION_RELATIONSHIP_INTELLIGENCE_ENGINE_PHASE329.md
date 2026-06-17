# AIPIFY – PHASE 329
## COMPANION RELATIONSHIP INTELLIGENCE ENGINE

**Feature owner:** CUSTOMER APP

## Purpose

Help users manage, strengthen and maintain important business relationships — advisory only, privacy-first, human-centered.

## Routes

- `/app/companion/relationship-intelligence` (canonical)
- `/dashboard/companion/relationship-intelligence` (legacy redirect)

## APIs

- `GET /api/aipify/relationship-intelligence`
- `GET /api/aipify/relationship-intelligence/[id]`
- `GET /api/aipify/relationship-intelligence/opportunities`
- `GET /api/aipify/relationship-intelligence/reminders`
- `POST /api/aipify/relationship-intelligence/note`

## Principles

People first. Aipify assists — never replaces human relationships. Insights, reminders and recognition opportunities only.

## Permissions

- Employees: personal relationships
- Managers: team relationships (when enabled)
- Owners / executives: organization-wide visibility
- Administrators: per assigned permissions

## Distinct from

- Phase 33 RSI at `/app/assistant/relationships` (personal important people)
- Phase A.78 at `/app/relationship-intelligence-engine` (organizational relationship context)
- Phase 262 Enterprise Trust & Relationship Intelligence

## Tables

`companion_relationship_intelligence_settings` · `companion_relationship_profiles` · `companion_relationship_interactions` · `companion_relationship_opportunities` · `companion_relationship_reminders` · `companion_relationship_recognition` · `companion_relationship_timeline` · `companion_relationship_audit_logs`
