# Predictive Intelligence Engine (PIE) — Phase 52

Forward-looking operational intelligence — forecast bottlenecks, SLA risks, follow-up gaps, churn signals, and growth opportunities.

**Spec:** `aipify-core/modules/predictive-intelligence-engine/phase-52-predictive-intelligence-engine.txt`  
**Code:** `lib/aipify/predictive-intelligence/`  
**Dashboard:** `/app/predictions`  
**Settings:** `/app/settings/predictions`  
**API:** `/api/aipify/predictions/*`

---

## Principle

> Predictive Intelligence forecasts workflow and process risks — not hidden employee surveillance.

V1 uses historical trends, threshold rules, workflow analysis, and anomaly detection. No advanced ML.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter / Growth | Upgrade prompt |
| Business Pro | Full PIE — settings, alerts, rule-based detection jobs |
| Enterprise | Same + workload predictions when enabled |

Module gate: `predictive_intelligence` in `lib/core/plans.ts` (business + enterprise).

---

## Database

- `aipify_prediction_models` — per-tenant model config and thresholds
- `aipify_predictive_alerts` — generated forward-looking alerts
- `aipify_prediction_settings` — tenant consent and feature flags
- `aipify_prediction_audit_log` — audit trail

**Alert types:** `future_bottleneck` · `churn_risk` · `workload_risk` · `growth_opportunity` · `followup_risk` · `sla_risk`

**RPCs:** `get_customer_predictions_center()`, `get_prediction_settings()`, `update_prediction_settings()`, `run_pie_detection_jobs()`, `update_predictive_alert_status()`

Migration: `supabase/migrations/20260614000000_predictive_intelligence_phase52.sql`

---

## Detection jobs (rule-based)

| Job | Alert type | Signals |
|-----|------------|---------|
| `detect_pie_future_bottlenecks_for_tenant` | future_bottleneck | Escalation/delay week-over-week growth |
| `detect_pie_customer_inactivity_for_tenant` | churn_risk | Inactive customers/leads without workflow events |
| `detect_pie_workload_risk_for_tenant` | workload_risk | Open item concentration on one owner |
| `detect_pie_sla_risk_for_tenant` | sla_risk | Support queue age + volume growth |
| `detect_pie_growth_opportunities_for_tenant` | growth_opportunity | Positive completed-workflow trend |
| `detect_pie_followup_risk_for_tenant` | followup_risk | Upcoming promised follow-ups |

Triggered on dashboard load (if no alerts today) or via `POST /api/aipify/predictions/generate`.

---

## Integrations

Builds on Phase 51 OIL data:
- `aipify_workflow_events` / `aipify_workflow_definitions`
- `aipify_business_entities`
- `support_cases`

Unonight and Aipify internal pilots use the same multi-tenant system — register workflows and feed events; no hardcoded tenant logic.
