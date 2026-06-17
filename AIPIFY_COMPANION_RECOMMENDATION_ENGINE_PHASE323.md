# AIPIFY – PHASE 323
## COMPANION RECOMMENDATION ENGINE

**Feature owner:** CUSTOMER APP

## Purpose

Intelligent, contextual, actionable recommendations from approved context — Aipify suggests, humans decide.

## Route

- `/app/companion/recommendations`

## APIs

- `GET /api/aipify/recommendations`
- `GET /api/aipify/recommendations/[id]`
- `GET /api/aipify/recommendations/priority`
- `POST /api/aipify/recommendations/[id]/accept`
- `POST /api/aipify/recommendations/[id]/dismiss`
- `POST /api/aipify/recommendations/[id]/feedback`

## Code

- `lib/aipify/companion-recommendation-engine/`
- `components/app/companion-recommendation-engine/`
- `supabase/migrations/20261657000000_companion_recommendation_engine_phase323.sql`

## Principles

Explain every recommendation. No black-box suggestions. Permission-first access. High signal, low noise.
