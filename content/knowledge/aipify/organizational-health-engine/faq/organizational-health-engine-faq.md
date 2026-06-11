# Organizational Health Engine FAQ

## FAQ 1

**Question:** What is the Organizational Health Engine?

**Answer:** The Organizational Health Engine aggregates metadata-only health indicators across six categories — operational, support, adoption, learning readiness, change readiness, and strategic alignment. It measures scores (0–100), generates recommendations, and supports human-approved interventions. Aipify informs; humans decide action.

## FAQ 2

**Question:** How is this different from Observability Platform Health?

**Answer:** Observability Platform Health (A.21) monitors platform infrastructure, incidents, and maintenance windows. The Organizational Health Engine (nav id `organizationalHealthEngine`, route `/app/organizational-health-engine`) measures organizational readiness across support backlog, workflow adoption, training completion, improvements, and strategic alignment. They are intentionally separate surfaces.

## FAQ 3

**Question:** How do health measurement and interventions work?

**Answer:** `measure_organizational_health()` computes category scores from metadata sources via RPC composition — no PII. `generate_health_recommendations()` creates interventions when scores fall below the configured threshold. `approve_health_intervention()` requires human approval; optional org memory hooks capture learnings — metadata only.

## FAQ 4

**Question:** Who can manage and export organizational health data?

**Answer:** Viewing requires `health.view`. Measuring and score overrides require `health.manage`. Generating and approving interventions requires `health.review`. Report export requires `health.export`. No conflict with existing `PERMISSION_KEYS` — `health.*` keys are dedicated to this engine.
