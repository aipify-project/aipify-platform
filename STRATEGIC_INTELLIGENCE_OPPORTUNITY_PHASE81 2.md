# Strategic Intelligence & Opportunity Engine — Phase 81

Build a Strategic Intelligence & Opportunity Engine that continuously identifies opportunities, risks, strategic priorities and improvement recommendations to support long-term organizational decision-making while preserving human leadership authority.

## Core principle

**Aipify recommends strategy. Humans decide strategy.**

Aipify may analyze, forecast, recommend, prioritize, and explain.

Aipify must never execute strategic decisions autonomously, override Governance, replace leadership judgment, or initiate organizational change independently.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/strategy` | Strategic scorecard, opportunities, risks, horizons, recommendations |
| `/app/strategy/opportunities/[id]` | Opportunity detail with supporting evidence |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/strategy/card` | `get_strategic_card` |
| `GET /api/aipify/strategy/dashboard` | `get_strategic_dashboard` |
| `GET /api/aipify/strategy/opportunities/[id]` | `get_strategic_opportunity` |
| `POST /api/aipify/strategy/briefings/generate` | `generate_strategic_briefing` |
| `POST /api/aipify/strategy/recommendations/[id]/approve` | `approve_strategic_recommendation` |
| `POST /api/aipify/strategy/recommendations/[id]/dismiss` | `dismiss_strategic_recommendation` |

## Strategic Health Score (0–100)

Components: operational readiness, knowledge maturity, automation adoption, organizational alignment, governance strength, innovation potential, continuity preparedness.

| Band | Range |
|------|-------|
| Highly Prepared | 90–100 |
| Prepared | 75–89 |
| Improvement Recommended | 60–74 |
| Resilience Concerns | 40–59 |
| Critical Gap | Below 40 |

## Opportunity categories

Operational, knowledge, automation, organizational, marketplace, blueprint, value, risk reduction.

## Strategic horizons

| Horizon | Focus |
|---------|-------|
| Short-Term (0–30 days) | Operational optimization |
| Mid-Term (30–90 days) | Process improvement |
| Long-Term (90–365 days) | Strategic transformation |

## Migration

`supabase/migrations/20260617200000_strategic_intelligence_opportunity_phase81.sql`

Tables: `strategic_opportunities`, `strategic_risks`, `strategic_scorecards`, `strategic_recommendations`, `strategic_briefings`, `strategic_settings`, `strategic_audit_log`

## Integrations

| Module | Use |
|--------|-----|
| Value Engine | ROI and productivity estimates |
| Learning Engine | Recommendation quality and prioritization |
| Global Learning Network | Anonymized best practices and industry trends |
| Digital Twin | Organizational and ownership recommendations |
| Simulation Lab | Investment and process redesign priorities |
| AOC | Operational findings escalated to strategy |
| Executive Briefing | Strategic summaries for leadership |
| Continuity Engine | Risk reduction opportunities |
| Trust Engine | Strategic recommendation explanations |

## Library

`lib/aipify/strategy/` — types, parse, jobs

## Knowledge Center

Category: `strategy`  
FAQ: `content/knowledge/aipify/strategy/faq/strategy-faq.md`

## Out of scope (V1)

- Autonomous strategic leadership
- Automatic organizational restructuring
- Unapproved strategic execution
- Governance bypass mechanisms
