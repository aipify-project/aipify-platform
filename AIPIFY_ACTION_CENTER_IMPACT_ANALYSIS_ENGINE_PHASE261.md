# Action Center Impact Analysis Engine — Phase 261

## Purpose

Extend the Action Center so every recommended action includes clear impact analysis before execution. Aipify helps users understand consequences, opportunities, risks, effort, expected outcomes, and confidence — while humans retain accountability.

**Feature owner:** Customer App (`/app/action-center`)

## Impact Analysis Center

The Action Center surfaces as the **Impact Analysis Center** with:

- Full analysis mode and **Executive Summary** mode
- Human oversight language (“Based on available information…”, “Aipify estimates…”, “Review before execution”)
- Six dashboard widgets for impact-oriented triage

## Features (Phase 261)

1. **Expected Outcome Analysis** — intended outcome, rationale, value creation, strategic alignment score
2. **Risk Assessment** — Low / Medium / High / Critical with rationale, consequences, mitigation
3. **Effort Estimation** — minutes / hours / days / weeks; stakeholders, approvals, integrations
4. **Business Impact Categories** — Revenue, Customer Satisfaction, Employee Experience, Operational Efficiency, Compliance, Strategic Goals, Growth, Risk Reduction (None / Low / Moderate / High)
5. **Confidence Engine** — Very Low → Very High with influence factors
6. **Decision Support Panel** — why now, delay, ignore, who to involve
7. **Executive Summary Mode** — Situation, Recommendation, Benefits, Risks, Required Actions, Confidence
8. **Human Oversight Principle** — estimates, not certainty
9. **Learning Loop** — post-execution feedback via `record_action_center_impact_learning`
10. **Dashboard Widgets** — recommended by impact, high impact, high risk, validated outcomes, awaiting review, executive approval
11. **Knowledge Center FAQ** — `content/knowledge/aipify/action-center-impact/faq/`
12. **i18n** — en, no, sv, da, es, pl, uk

## Architecture

```
supabase/migrations/20261448000000_action_center_impact_analysis_phase261.sql
  get_action_center_impact_analysis(p_action_id)
  record_action_center_impact_learning(...)

lib/action-center-impact/
  types.ts · parse.ts · enrichment.ts · dashboard.ts · labels.ts

components/shared/action-center-impact/
  ActionImpactAnalysisView.tsx
  ActionImpactDashboardWidgets.tsx
  ActionImpactLearningForm.tsx

app/api/aipify/actions/[id]/impact/route.ts
app/api/aipify/actions/[id]/impact/learning/route.ts
components/app/action-center/ActionCenterPanel.tsx
```

Enrichment runs client-side after RPC parse — no additional migration required for analysis fields.

## Final principle

Aipify provides decision support. Humans retain accountability. Trust grows through transparency.
