# Implementation Blueprint — APP Portal Phase 314: Executive Foresight Center

## Feature owner

**Customer App** — Enterprise Intelligence section of the APP portal.

## Route

- Canonical: `/app/intelligence/executive-foresight`
- Legacy alias redirect: `/dashboard/intelligence/executive-foresight` → `/app/intelligence/executive-foresight`

## Migration

`supabase/migrations/20261647000000_app_portal_executive_foresight_center_phase314.sql`

## APIs

- `GET /api/aipify/executive-foresight`
- `GET /api/aipify/executive-foresight/[id]`
- `GET /api/aipify/executive-foresight/recommendations`
- `GET /api/aipify/executive-foresight/timeline`
- `POST /api/aipify/executive-foresight/review`
