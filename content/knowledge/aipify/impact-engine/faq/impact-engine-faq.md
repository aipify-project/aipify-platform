# Impact Engine — FAQ

## What is the Impact Engine?

The Impact Engine (Phase A.85) measures and communicates positive outcomes across five dimensions — operational, customer, human, knowledge, and strategic. It focuses on meaningful improvements, not activity volume.

## How is this different from Platform Anonymised Impact?

**Platform Anonymised Impact** (`/platform/impact`, IMPACT_METRICS.md) stores marketing-proof aggregates across tenants for Aipify Group AS. **ABOS Impact Engine** is tenant-scoped outcome orchestration with transparent calculations, limitations, and assumptions for your organization.

## How is this different from Value Engine (Phase 73)?

**Value Engine** (`/app/value`) provides Impact Score and ROI snapshots. **Impact Engine A.85** orchestrates outcome signals across five ABOS dimensions — impact not activity, with wellbeing and Self Love connection.

## How is this different from Value Realization Engine (A.48)?

**Value Realization A.48** captures baselines and milestones for value tracking. **Impact Engine A.85** synthesizes outcome signals and publishes impact summaries — it integrates with Value Realization but does not replace baseline capture.

## How is this different from Innovation & Impact Engine (A.28)?

**Innovation & Impact A.28** (`/app/innovation-impact-engine`) tracks innovation case studies and experimentation outcomes. **Impact Engine A.85** measures day-to-day operational, customer, human, knowledge, and strategic improvements.

## What are impact dimensions?

Five dimensions: **Operational** (workflows, friction), **Customer** (experience, support), **Human** (wellbeing, workload), **Knowledge** (KC deflection, gaps), **Strategic** (priorities, alignment). Each includes bullets and metadata-only signals.

## What are impact signals?

Metadata-only records with dimension, signal_type, summary, trend_pct, confidence, and measurement_notes. No raw customer conversations, emails, or PII.

## What are impact reports?

Generated via `generate_impact_summary(p_period)` — includes summary, highlights, limitations, and assumptions. Status: draft, published, or archived.

## What is Self Love connection?

Self Love connects sustainability, wellbeing, recovery, and long-term success — impact includes human outcomes, not output-only metrics. Enable via `include_wellbeing_metrics` in settings.

## How does celebrating progress work?

When `celebrate_progress` is enabled, bell milestone examples acknowledge meaningful progress — support improvements, KC deflection, workload balance, priority clarity — not activity volume.

## Who can generate reports?

`impact_engine.reports.generate` is required. Owners, administrators, and managers have this by default.

## What integrations does Impact Engine use?

Value Realization A.48, Innovation & Impact A.28, Value Engine Phase 73, Platform Anonymised Impact, Organizational Health, Priority Focus, and Purpose & Values. See integration links on the dashboard.
