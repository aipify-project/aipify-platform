# AIPIFY – GROWTH PARTNER ECONOMY ENGINE
## Partner Sales & Self-Billing Framework

**Route:** `/partners/settlement`  
**API:** `/api/partners-portal/economy/*`

## Purpose

Official global sales model for Aipify Group AS — independent Growth Partners earn one-time commissions on initial sales through automated self-billing.

## Core principle

Aipify Group AS sells software. Growth Partners generate customers. Commissions are one-time only — no recurring, residual, or lifetime commissions.

## Components

- Supabase migration: `20261645000000_growth_partner_economy_engine_self_billing.sql`
- Lib: `lib/partners-portal/economy-engine/`
- UI: `GrowthPartnerEconomyPanel`
- Nav: Partners → Settlement & Self-Billing

## Commission tiers (initial sales)

| Sales | Rate |
|-------|------|
| 1–9 | 5% |
| 10–24 | 10% |
| 25–49 | 15% |
| 50–99 | 20% |
| 100+ | 25% |

## Self-billing flow

Sale verified → commission calculated → settlement prepared → partner approves → invoice generated → payment processed.

## i18n

`partnersPortal.economyEngine.*` — en, no, sv, da, es, pl, uk
