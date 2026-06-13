# Memory Engine (Phase 62)

Aipify Memory Engine helps Aipify understand how each tenant, team, and user works over time — without starting from zero every day.

## Philosophy

Observe → Learn → Remember → Recommend → Improve

## Customer App routes

| Route | Purpose |
|-------|---------|
| `/app/memory` | Memory hub + Organizational Memory (Phase 50 OME) |
| `/app/memory/preferences` | Review remembered user/team/tenant preferences |
| `/app/memory/patterns` | Detected workflow and business patterns |
| `/app/memory/recommendations` | Memory-improved recommendations |
| `/app/memory/settings` | Tenant memory settings and exclusions |

## Database tables

- `memory_settings` — tenant configuration
- `memory_profiles` — user/team/tenant preferences
- `memory_observations` — sanitized observed signals
- `memory_patterns` — detected recurring patterns
- `memory_recommendations` — actionable suggestions from patterns
- `memory_feedback` — user feedback and delete requests

## API (`/api/aipify/memory-engine/*`)

- `GET card` — memory engine summary card
- `GET profiles`, `DELETE profiles/[id]`
- `GET patterns`
- `GET recommendations`, `POST recommendations/[id]/action`
- `POST observations/collect`
- `GET/PATCH settings`
- `POST feedback`
- `GET explain?type=&id=`

Organizational Memory (Phase 50) remains at `/api/aipify/memory/*`.

## What Memory remembers

**User level:** notification modes, briefing preferences, common chat intents  
**Team level:** approval habits, support routines  
**Tenant level:** recurring quality incidents, knowledge gap trends

## Never stores

Passwords, API secrets, sensitive health data, payment details, cross-tenant memory.

## Integrations

- **Briefing (Phase 60)** — `include_memory` setting; memory recommendations in briefing events
- **Desktop Companion (Phase 61)** — desktop preferences and chat intents feed observations
- **Governance (Phase 54)** — approval patterns; audit logging via `_tacc_log_audit`
- **Quality Guardian** — recurring incident categories become patterns
- **Knowledge Center** — knowledge gap trends; FAQ at `content/knowledge/aipify/memory/faq/`
- **Organizational Memory (Phase 50)** — manual captures complement automatic learning

## Library

`lib/aipify/memory/` — types, parsers, collectors, jobs (server-only).

## Knowledge Center

```bash
POST /api/aipify/knowledge/import-seed-content
{ "overwrite": true }
```

Category slug: `memory-engine`
