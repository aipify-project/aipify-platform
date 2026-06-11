# Value Realization Engine FAQ

## FAQ 1

**Question:** What is the Value Realization Engine?

**Answer:** The Value Realization Engine measures operational outcomes for your organization — support efficiency, admin time savings, onboarding improvements, workflow optimization, and more. It captures baselines, tracks improvement percentages, and provides executive-ready reports using metadata only (no PII).

## FAQ 2

**Question:** How are value baselines captured?

**Answer:** Baselines record metadata-only operational starting points: support response times, resolution times, manual task estimates, approval turnaround, and training completion rates. Use `capture_value_baseline()` or the baselines API. Every baseline modification is audited via `_vre_log()`.

## FAQ 3

**Question:** What report types are available?

**Answer:** `generate_value_report()` supports four report types: ROI, operational impact, value realization, and strategic improvement. Reports contain counts and aggregate metadata only. Export via `export_value_report()` — every export is audited.

## FAQ 4

**Question:** Who can view and manage value data?

**Answer:** Viewing requires `value.view`. Capturing baselines and recording metrics requires `value.manage`. Report generation and export require `value.export`. Milestone review and improvement suggestions require `value.review`. Owners and administrators typically hold full permissions.

## FAQ 5

**Question:** How does Value Realization integrate with other engines?

**Answer:** The engine extends Customer Success (A.26), Innovation & Impact (A.28), Executive Insights (A.35), and Change Management (A.47). Integration summaries surface health scores, impact metrics, and change adoption counts — metadata only, never raw operational records.
