# AIPIFY – PHASE 286
## APP – ORGANIZATIONAL LEARNING & IMPROVEMENT CENTER

**Route:** `/app/operations/learning`  
**Detail:** `/app/operations/learning/[id]`  
**API:** `/api/aipify/learning`, `/api/aipify/learning/[id]`, `/api/aipify/learning/[id]/actions`

## Purpose

Help organizations capture lessons learned, identify improvement opportunities and strengthen organizational memory.

## Components

- Supabase migration: `20261600000000_app_portal_learning_improvement_phase286.sql`
- Lib: `lib/app-portal/learning-improvement/`
- UI: `LearningImprovementPanel`, `LearningImprovementDetailPanel`
- Nav: Operations → Learning & Improvement

## Permissions

Owners, administrators, managers and team leaders manage records. Members may contribute learnings. Shared learnings visible to authorized users.

## i18n

`customerApp.portalStructure.learningImprovement.*` — en, no, sv, da, es, pl, uk
