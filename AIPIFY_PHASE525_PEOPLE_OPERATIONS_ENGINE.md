# AIPIFY – PHASE 525

**TITLE:** HR, People Operations & Workforce Management Engine  
**PURPOSE:** Universal HR & People Operations Engine for APP organizations — workforce administration, attendance, leave, development, performance reviews, goals, and recognition.  
**Feature owner:** CUSTOMER APP

## Core principle

Employees are not resources. Employees are people.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/people` | People Center (Overview, Workforce, Attendance, Leave, Development, Reviews, Planning, Goals, Reports) |
| `/app/people/attendance` | Attendance Engine |
| `/app/people/goals` | Goal Management |

## APIs

- `GET /api/app/people-operations` — `get_people_operations_center`
- `POST /api/app/people-operations/action` — `perform_people_operations_action`
- `GET /api/app/people-operations/my` — mobile/manager summary
- `GET /api/assistant/people-operations-context` — Companion context

## Module

- **Key:** `people`
- **Permissions:** `people.view`, `people.manage`

## Tables

`organization_people_operations_settings` · `organization_people_attendance_records` · `organization_people_leave_requests` · `organization_people_workforce_plans` · `organization_people_performance_reviews` · `organization_people_development_records` · `organization_people_goals` · `organization_people_recognitions` · `organization_people_operations_audit_logs`

## Integrations

- **Employee profiles (503):** canonical workforce directory via `organization_employee_profiles`
- **Employee Lifecycle (516):** onboarding, training, domain/pack assignments
- **Domains (505A):** employees may belong to organization domains
- **Business Packs:** training, certifications, goals per pack
- **Companion:** upcoming reviews, leave, training gaps, capacity, expiring certifications
- **Mobile:** managers approve leave, review employees, manage goals

## Attendance statuses

present · scheduled · absent · remote · completed

## Leave types

vacation · sick · parental · training · business_travel · personal · custom

## Goal statuses

planned · active · at_risk · achieved · missed

## Principle

Organizations succeed through people. People deserve structure, support, and growth. Managers guide development. Aipify helps organizations care for their workforce.

**Aipify Group AS** · Bergen. Norway. For the world.
