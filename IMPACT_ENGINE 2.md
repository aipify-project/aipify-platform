# Impact Engine (ABOS)

**Feature owner:** Customer App

Outcome-focused impact orchestration — measure and communicate positive outcomes across five dimensions. Activity ≠ progress.

## Philosophy

Impact means meaningful improvements for people, teams, and organizations — not busyness for its own sake.

## Mission

Help organizations understand how Aipify contributes to healthier operations, relationships, and outcomes.

## ABOS principle

Improve lives, not busyness.

## Vision

We are doing better than we were before.

## Distinctions

- **NOT** Platform Anonymised Impact (`/platform/impact`, IMPACT_METRICS.md) — marketing aggregates
- **NOT** Value Engine Phase 73 (`/app/value`) — Impact Score, ROI snapshots
- **NOT** Value Realization A.48 (`/app/value-realization-engine`) — baselines and milestones
- **NOT** Innovation & Impact A.28 (`/app/innovation-impact-engine`) — innovation case studies
- **ABOS Impact Engine** — outcome-focused impact orchestration across five dimensions with transparent reporting

## Route

`/app/impact-engine` — nav id `abosImpactEngine`

## Module

`impact_engine`

## Tables

- `organization_impact_engine_settings` — enabled, reporting_cadence, celebrate_progress, include_wellbeing_metrics, metadata
- `organization_impact_signals` — dimension, signal_type, summary, trend_pct, confidence, measurement_notes, metadata
- `organization_impact_reports` — report_period, summary, highlights, limitations, assumptions, status

## Permissions

`impact_engine.view` · `impact_engine.manage` · `impact_engine.export` · `impact_engine.reports.generate`

## RPCs

`get_impact_engine_card` · `get_impact_engine_dashboard` · `update_impact_engine_settings` · `generate_impact_summary` · `export_impact_engine_report`

## Impact dimensions

Operational · Customer · Human · Knowledge · Strategic

## Integrations

Value Realization A.48 · Innovation & Impact A.28 · Value Engine Phase 73 · Platform Anonymised Impact · Organizational Health · Priority Focus · Purpose & Values

Metadata only — no raw customer conversations, emails, or PII.
