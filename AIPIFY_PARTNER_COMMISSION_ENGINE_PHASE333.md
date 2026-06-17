# Partner Commission Engine — Phase 333

**Feature owner:** GROWTH PARTNER PORTAL

**Route:** `/partner/commissions`

**Migration:** `20261667000000_partner_commission_engine_phase333.sql`

## Purpose

Central system for calculating, tracking, and managing Growth Partner commissions from qualifying **initial sales only** — transparent, explainable, and auditable.

## APIs

- `GET /api/partner/commissions`
- `GET /api/partner/commissions/summary`
- `GET /api/partner/commissions/milestones`
- `GET /api/partner/commissions/forecast`
- `POST /api/partner/commissions/recalculate`

## Commission tiers (default)

| Tier | Sales | Rate |
|------|-------|------|
| 1 | 0–9 | 5% |
| 2 | 10–24 | 10% |
| 3 | 25–49 | 15% |
| 4 | 50–99 | 20% |
| 5 | 100+ | 25% |

Platform Admin configurable via `growth_partner_portal_commission_tiers`.

## RPCs

Helpers: `_gpc333_*` · Blueprint: `_gpc333bp_*`
