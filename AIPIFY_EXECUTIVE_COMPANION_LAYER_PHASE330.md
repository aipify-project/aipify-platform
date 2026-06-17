# AIPIFY – PHASE 330
## EXECUTIVE COMPANION LAYER

**Feature owner:** CUSTOMER APP

## Purpose

Highest-level Companion experience — unifies Context, Memory, Recommendations, Proactive Insights, Daily Briefings, Relationship Intelligence and Enterprise Intelligence into one executive workspace. Completes first-generation Companion Maturity Layer.

## Routes

- `/app/companion/executive` (canonical)
- `/dashboard/companion/executive` (legacy redirect)

## APIs

Use `?layer=companion` on shared routes where noted.

- `GET /api/aipify/executive-companion?layer=companion`
- `POST /api/aipify/executive-companion?layer=companion` — generate briefing
- `GET /api/aipify/executive-companion/briefing?layer=companion`
- `GET /api/aipify/executive-companion/priorities`
- `GET /api/aipify/executive-companion/relationships`
- `GET /api/aipify/executive-companion/intelligence`

## Permissions

- Employees: no access
- Managers: limited (when enabled)
- Owners / executives / admins: full access

## Companion Golden Rule

Every insight includes observation, explanation, impact, recommendation, effort and potential value.

## Distinct from

- Phase 299 App Portal Executive Companion at `/app/intelligence/executive-companion` (uses same API without `layer=companion`)

## Tables

`companion_executive_layer_settings` · `companion_executive_briefings` · `companion_executive_priorities` · `companion_executive_actions` · `companion_executive_insights` · `companion_executive_timeline` · `companion_executive_audit_logs`
