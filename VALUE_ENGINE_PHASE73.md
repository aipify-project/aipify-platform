# Value Engine & Impact Analytics — Phase 73

Measure and explain the real impact Aipify creates — with evidence, not invented numbers.

## Philosophy

Every metric is explainable, traceable, configurable, conservative, and auditable. ROI is optional and never guaranteed.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/value` | Executive dashboard with Impact Score, timeline, pack/blueprint impact |
| `/app/value/settings` | ROI hourly rates (optional) |
| `/app/value/reports` | Generate weekly/monthly/quarterly/annual reports |
| `/app/value/opportunities` | Underused capabilities and improvement hints |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/value/dashboard` | `get_value_engine_dashboard` |
| `GET /api/aipify/value/impact-score` | `get_impact_score` |
| `GET /api/aipify/value/events` | `list_value_events` |
| `GET/PATCH /api/aipify/value/settings` | `get/update_roi_settings` |
| `GET /api/aipify/value/reports` | `list_value_reports` |
| `POST /api/aipify/value/reports/generate` | `generate_value_report` |
| `GET /api/aipify/value/opportunities` | `detect_value_opportunities` |

## Impact Score

Weighted 0–100 score from category scores: time saved, support, quality, knowledge, automation, governance, productivity, operational. Includes trend delta vs previous score.

## Conservative time rules

| Event | Minutes | Category |
|-------|---------|----------|
| Support draft accepted | 5 | support_efficiency |
| FAQ resolved | 3 | knowledge |
| Briefing opened | 10 | time_saved |
| Action completed | 2 | productivity |
| Quality issue detected | 0 | quality (risk only) |
| Governance block | 0 | risk_reduction |

## Migration

`supabase/migrations/20260616300000_value_engine_phase73.sql`

## Integrations

- **Learning Engine:** `collect_value_signals` from learning_events
- **Marketplace:** pack impact on dashboard
- **Industry Blueprints:** applied component counts
- **Evolution (Phase 72):** pending proposals as value opportunities

## Knowledge Center

Category: `value-engine`  
FAQ: `content/knowledge/aipify/value-engine/faq/value-engine-faq.md`

## Out of scope (V1)

- Guaranteed ROI claims
- Inflated or unverifiable assumptions
- Automatic monetary value for weak evidence
