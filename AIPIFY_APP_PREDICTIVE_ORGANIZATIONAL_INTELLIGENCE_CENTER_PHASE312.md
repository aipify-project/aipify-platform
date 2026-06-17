# AIPIFY – PHASE 312
## APP – PREDICTIVE ORGANIZATIONAL INTELLIGENCE CENTER

**Route:** `/app/intelligence/predictive`  
**Detail route:** `/app/intelligence/predictive/[id]`  
**API:** `/api/aipify/predictive-intelligence`, `/api/aipify/predictive-intelligence/[id]`, `/api/aipify/predictive-intelligence/recommendations`, `/api/aipify/predictive-intelligence/timeline`, `/api/aipify/predictive-intelligence/review`

## Purpose

Help organizations identify emerging patterns, anticipate operational developments and proactively prepare for future scenarios.

## Components

- Supabase migration: `20261644000000_app_portal_predictive_organizational_intelligence_phase312.sql`
- Lib: `lib/app-portal/predictive-intelligence/`
- UI: `PredictiveIntelligencePanel`, `PredictiveIntelligenceDetailPanel`
- Nav: Intelligence → Predictive Intelligence

## Prediction categories

Operational · Capacity · Strategic · Customer Success · Learning · Governance · Risk · Business Pack

## Confidence levels

Exploratory · Emerging Pattern · Moderate Confidence · High Confidence

## Permissions

Employees have no access. Managers receive limited insights (operational, capacity, customer success). Owners have full access. Administrators require explicit grant via `admin_access_enabled`.

## i18n

`customerApp.portalStructure.predictiveIntelligence.*` — en, no, sv, da, es, pl, uk
