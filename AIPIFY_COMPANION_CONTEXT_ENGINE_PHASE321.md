# Aipify Phase 321 — Companion Context Engine

**Feature owner:** Customer App  
**Route:** `/app/companion/context`  
**API:** `/api/aipify/context/*`

## Objective

Foundation of the next-generation Aipify Companion experience — contextual awareness that is permission-driven, privacy-first, and advisory.

Distinct from:
- **Phase 35 Context Engine** — calendars/UCL at `/app/assistant/context`
- **Context Intelligence Engine (A.77)** — organizational gap analysis at `/app/context-intelligence-engine`

## Principles

- Context before recommendations · Relevance before automation
- Permission-first access · Privacy by design
- Metadata only from approved sources
- Companion Golden Rule on recommendations (observation, impact, effort, value)

## Components

| Layer | Path |
|-------|------|
| Migration | `supabase/migrations/20261655000000_companion_context_engine_phase321.sql` |
| Lib | `lib/aipify/companion-context-engine/` |
| API | `/api/aipify/context`, `/sources`, `/timeline`, `/recommendations` |
| UI | `CompanionContextEngineDashboardPanel` |
| i18n | `customerApp.companionContextEngine.*` |

## Permissions

| Role | Scope |
|------|-------|
| Owner / Executive | Full organizational context |
| Administrator | Full org if `admin_org_context_enabled` |
| Manager | Team context if `manager_team_context_enabled` |
| Employee | Own context only |

## Context sources

User Profile · Role & Permissions · Organization · Business Packs · Connected Applications · Notifications · Tasks · Calendar Events · Recent Activity · Knowledge Center · Companion History · Support Activity · Operational Activity
