# Strategic Intelligence Foundation Engine — Phase A.31

**ABOS Blueprint:** [Implementation Blueprint Phase 17](./IMPLEMENTATION_BLUEPRINT_PHASE17_STRATEGIC_INTELLIGENCE_FOUNDATION.md)

Build a Strategic Intelligence Foundation Engine that surfaces emerging trends, opportunities, risks, and strategic considerations from operational metadata — while preserving human leadership authority over all strategic decisions.

## Core principle

**Aipify informs strategy. Humans decide strategy.**

Aipify may scan, detect, recommend, and explain strategic signals from metadata.

Aipify must never execute strategic decisions autonomously, override governance, replace leadership judgment, or initiate organizational change independently.

## Route

| Route | Purpose |
|-------|---------|
| `/app/strategic-intelligence-foundation-engine` | Canonical ABOS Strategic Intelligence — insights, scan, dismiss, blueprint dashboard |

> **Distinction:** Legacy Strategic Intelligence & Opportunity Engine (Phase 81) at `/app/strategy` — cross-link only. A.31 is canonical ABOS Strategic Intelligence.

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/strategic-intelligence-foundation-engine/dashboard` | `get_strategic_intelligence_foundation_engine_dashboard()` |
| `GET /api/aipify/strategic-intelligence-foundation-engine/card` | `get_strategic_intelligence_foundation_engine_card()` |
| `POST /api/aipify/strategic-intelligence-foundation-engine/scan` | `run_strategic_intelligence_scan()` |
| `POST /api/aipify/strategic-intelligence-foundation-engine/dismiss` | `dismiss_strategic_insight()` |

## Insight categories (ABOS Phase 17)

| Category | Focus |
|----------|-------|
| Growth Opportunities | Adoption gaps, module expansion, customer success uplift |
| Operational Risks | Support backlog, quality findings, workflow strain |
| Knowledge Risks | Procedure gaps, KC coverage, recurring support themes |
| Relationship Insights | Customer success health, renewal signals, stakeholder patterns |

## Tables

`strategic_insights` · `strategic_insight_recommendations`

No new tables for Blueprint Phase 17 — extend RPCs and dashboard only.

## Migrations

| Migration | Purpose |
|-----------|---------|
| `20260813000000_strategic_intelligence_foundation_engine_phase_a31.sql` | Core engine — tables, scan, dismiss, dashboard |
| `20260964000000_implementation_blueprint_phase17_strategic_intelligence.sql` | ABOS Blueprint Phase 17 alignment |

## Permissions

`intelligence.view` · `intelligence.manage` · `intelligence.dismiss` · `intelligence.export`

## Integration links

| Module | Route |
|--------|-------|
| Executive Insights A.35 | `/app/executive-insights-engine` |
| Predictive Insights A.66 | `/app/predictive-insights-engine` |
| Strategic Alignment A.55 | `/app/strategic-alignment-engine` |
| Wisdom Engine A.93 | `/app/wisdom-engine` |
| Organizational Memory A.34 | `/app/organizational-memory-engine` |
| Industry Intelligence A.44 | `/app/industry-intelligence-foundation-engine` |
| Organizational Decision Support A.54 | `/app/organizational-decision-support-engine` |
| Self Love A.76 | `/app/self-love-engine` |
| Legacy Strategic Scorecard (Phase 81) | `/app/strategy` |

## Code

| Layer | Location |
|-------|----------|
| Lib | `lib/aipify/strategic-intelligence-foundation-engine/` |
| UI | `components/app/strategic-intelligence-foundation-engine/` |
| ILM | `lib/internal-language-model/implementation-blueprint-phase17-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/strategic-intelligence-foundation-engine/faq/` |

## Dogfooding

**Aipify Group AS** (`aipify-group`): Roadmap scaling, resource planning, platform growth signals.

**Unonight** (`unonight`): Commerce adoption opportunities, support backlog risks, renewal insights, knowledge gap detection.
