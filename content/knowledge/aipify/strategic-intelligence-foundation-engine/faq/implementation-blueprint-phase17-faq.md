# Implementation Blueprint Phase 17 — Strategic Intelligence Engine Foundation FAQ

## What is Phase 17 of the Implementation Blueprint?

Phase 17 aligns the Strategic Intelligence Foundation Engine (Phase A.31) with ABOS strategic intelligence requirements — emerging trends, opportunities, risks, and long-term considerations from operational metadata.

## How is this different from /app/strategy (Phase 81)?

**Strategic Intelligence & Opportunity (Phase 81)** at `/app/strategy` is the legacy strategic scorecard with horizons and recommendations. **Strategic Intelligence Foundation Engine A.31** at `/app/strategic-intelligence-foundation-engine` is the canonical ABOS Strategic Intelligence surface — cross-link only, do not duplicate.

## How is this different from Executive Insights A.35?

**Executive Insights A.35** (`/app/executive-insights-engine`) provides executive summaries and Since Last Time blocks. **Strategic Intelligence A.31** detects operational signals and seeds strategic insights — distinct purposes.

## How is this different from Predictive Insights A.66?

**Predictive Insights A.66** (`/app/predictive-insights-engine`) offers forward predictions. **Strategic Intelligence A.31** surfaces explainable signals from current operational metadata — not autonomous forecasting.

## What are the four insight categories?

- **Growth Opportunities** — adoption gaps, expansion modules, customer success uplift
- **Operational Risks** — support backlog, quality findings, workflow strain
- **Knowledge Risks** — procedure gaps, KC coverage, recurring support themes
- **Relationship Insights** — customer success health, renewal signals, stakeholder patterns

## What are the companion communication examples with 🦉🌹🔔?

🔔 Bell moments surface high-impact insights ready for review. 🌹 Self Love phrases encourage sustainable pacing. 🦉 Wisdom phrases invite reflection before quarterly planning.

## What is the Self Love connection?

Self Love (A.76) supports sustainable strategy, wellbeing, and thoughtful pacing — avoid growth-at-all-costs. Self Love is a principle influence only; Strategic Intelligence stores metadata, not wellbeing content. No ™ in product copy.

## What is the trust connection?

Strategic insights must explain why presented, which modules contributed, confidence scores, and assumptions. Metadata only — no customer email, chat, orders, or PII.

## What are the Phase 17 success criteria?

Insights generated, high-impact insights surfaced, completed/dismissed workflow tracked, scan capability available — computed live on the dashboard via `_sif_blueprint_success_criteria()`.

## How do I run a strategic intelligence scan?

Use `run_strategic_intelligence_scan()` via the dashboard **Run strategic scan** button or API. Requires `intelligence.manage` permission.

## Where does dogfooding happen?

**Aipify Group** validates internally — roadmap scaling, resource planning, platform growth signals. **Unonight** is the first external pilot — commerce adoption, support backlog risks, renewal insights, knowledge gaps.

## What data is stored?

Metadata only in `strategic_insights` — category, title, summary, impact level, confidence score, recommended action, and status. No raw customer records.

## Related surfaces

| Surface | Route |
|---------|-------|
| Executive Insights A.35 | `/app/executive-insights-engine` |
| Predictive Insights A.66 | `/app/predictive-insights-engine` |
| Strategic Alignment A.55 | `/app/strategic-alignment-engine` |
| Wisdom Engine A.93 | `/app/wisdom-engine` |
| Organizational Memory A.34 | `/app/organizational-memory-engine` |
| Industry Intelligence A.44 | `/app/industry-intelligence-foundation-engine` |
| Organizational Decision Support A.54 | `/app/organizational-decision-support-engine` |
| Legacy Strategic Scorecard (Phase 81) | `/app/strategy` |
| Self Love A.76 | `/app/self-love-engine` |
