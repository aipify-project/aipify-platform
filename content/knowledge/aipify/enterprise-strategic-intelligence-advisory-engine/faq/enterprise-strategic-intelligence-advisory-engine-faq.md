# Strategic Intelligence & Executive Advisory Engine — FAQ

## What is Strategic Intelligence?

Strategic Intelligence at `/app/intelligence/strategy` is Aipify's executive advisory layer. It helps organizations understand trends, risks, opportunities, forecasts, scenarios, and strategic priorities — without replacing executive decision-making.

Aipify observes operational and strategic signals, prepares context, and recommends next steps. Humans retain final authority.

## How are executive briefings generated?

Executive briefings are generated via `generate_briefing` in `enterprise_strategic_intelligence_advisory_action()`. Supported types:

- Daily · Weekly · Monthly · Quarterly · Annual · Custom

Each briefing aggregates strategic health, active objectives, open risks, growth opportunities, and forecast confidence into an executive summary with priority items. Results are stored in `enterprise_strategic_intelligence_briefings` with full audit logging.

## How does forecasting work?

Strategic forecasts in `enterprise_strategic_intelligence_forecasts` project revenue, growth, costs, capacity, workforce needs, market demand, and industry trends.

Generate via `generate_forecast` action. Each forecast includes projected value, confidence percent, trend direction, and assumptions. Forecast confidence in settings improves as forecasts are generated — tenant-isolated per organization.

## How are risks identified?

Risks are tracked in `enterprise_strategic_intelligence_risks` across categories:

- Operational · Financial · Compliance · Workforce · Customer · Technology · Strategic

Record new risks via `record_risk`. Aipify seeds baseline risk monitoring on first access. High-severity risks trigger Companion executive advisor signals recommending executive review.

## How does scenario planning work?

Scenario analysis supports:

- Best case · Expected case · Worst case · Custom · Growth · Risk · Investment

Create scenarios via `create_scenario` action. Each scenario includes outcome summary, probability percent, impact forecast, and recommendations. Compare scenarios before major strategic decisions.

## How does decision support work?

Decision support reports in `enterprise_strategic_intelligence_decision_reports` combine:

- Decision context
- Risk analysis
- Opportunity analysis
- Scenario analysis
- Impact forecasts
- Recommendations with confidence level

Generate via `generate_decision_report`. Aipify prepares and informs — executives decide. Integrates with Decision Support at `/app/assistant/decisions`.

## Strategic Intelligence Center

Modules at `/app/intelligence/strategy`:

- Strategic Overview
- Executive Briefings
- Strategic Intelligence (objectives & initiatives)
- Risk Intelligence
- Opportunity Intelligence
- Forecasting
- Scenario Analysis
- Governance

## Executive Priority Management

Executive priorities tracked in `enterprise_strategic_intelligence_priorities` with owner, business impact, status, dependencies, risks, and deadlines.

## Competitive Intelligence Foundation

Market trends, industry trends, competitor observations, technology trends, emerging risks, and emerging opportunities in `enterprise_strategic_intelligence_competitive_signals`.

## Companion Executive Advisor

Aipify generates executive advisor signals when:

- A strategic opportunity is identified
- A risk requires executive review
- A forecast changed significantly
- Historical decisions may provide context
- A scenario review is recommended

## Multi-tenant isolation

Strategic intelligence, executive reporting, forecasting models, and strategic plans are isolated per organization (`tenant_id`) with full audit trail in `enterprise_strategic_intelligence_audit_logs`.
