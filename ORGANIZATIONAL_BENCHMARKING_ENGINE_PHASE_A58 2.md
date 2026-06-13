# Organizational Benchmarking Engine — Phase A.58

## Vision

**Organizational Benchmarking Engine (OBE)** — Customer App engine with Core RPCs in Supabase. Compare organizational metadata metrics against internal baselines, industry anonymized benchmarks, maturity levels, performance indicators, and adoption signals — then generate recommendations and export executive benchmark summaries.

## Distinction from Industry Intelligence (A.44)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Industry Intelligence Foundation (A.44)** | `/app/industry-intelligence-foundation-engine` | Industry profiles, terminology, and insight catalog |
| **Organizational Benchmarking Engine (A.58)** | `/app/organizational-benchmarking-engine` | Structured metric comparisons, position metadata, and benchmark recommendations |

Nav id `organizationalBenchmarkingEngine` avoids collision with industry intelligence surfaces.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260903000000_organizational_benchmarking_engine_phase_a58.sql` |
| Prefix | `_obe_` |
| decision_type | `organizational_benchmarking_engine` |
| Lib | `lib/aipify/organizational-benchmarking-engine/` |
| Core helpers | `lib/core/organizational-benchmarking.ts` |
| API | `/api/aipify/organizational-benchmarking-engine/*` |
| UI | `/app/organizational-benchmarking-engine` |
| Nav id | `organizationalBenchmarkingEngine` |
| KC FAQ | `content/knowledge/aipify/organizational-benchmarking-engine/faq/organizational-benchmarking-engine-faq.md` |

## Core tables

- `benchmark_profiles` — category, source, period, config jsonb
- `benchmark_comparisons` — metric_key, org_value, benchmark_value, position metadata
- `benchmark_reports` — exported benchmark report metadata
- `benchmark_recommendations` — recommendations linked to comparisons with status lifecycle

## Benchmark categories

`internal` · `industry` · `maturity` · `performance` · `adoption`

## Comparison metrics (metadata only)

Support response times · training completion · workflow adoption · incident resolution · maturity levels · health scores — anonymized for industry benchmarks, no PII.

## Position metadata

`position` (above · at · below) · `gap` · `percentile` · `direction` (improve · maintain · review)

## RPCs

- `get_organizational_benchmarking_engine_dashboard()` — profiles, comparisons, recommendations, integration summaries
- `get_organizational_benchmarking_engine_card()` — summary card for home/shell
- `create_benchmark_profile(...)` · `update_benchmark_profile(...)`
- `generate_benchmark_comparison(...)` — aggregate org metrics vs benchmark
- `override_benchmark(...)` — audited manual benchmark override (benchmarks.manage)
- `export_benchmark_report(...)` · `get_executive_benchmark_summary()`
- `generate_benchmark_recommendations(...)` — create recommendations from below-benchmark comparisons

## Permissions

Permission key audit: no existing `benchmarks.*` keys in `PERMISSION_KEYS` — **no conflict**.

- `benchmarks.view`
- `benchmarks.manage`
- `benchmarks.review`
- `benchmarks.export`

All four keys registered in `PERMISSION_KEYS`.

## Integration notes

- **A.44 Industry Intelligence:** `_obe_industry_intelligence_summary()` — anonymized industry benchmark hooks
- **A.48 Value Realization:** `_obe_value_realization_summary()` — performance metric context
- **A.56 Organizational Health:** `_obe_organizational_health_summary()` — health score comparisons
- **A.57 Capability Maturity:** `_obe_capability_maturity_summary()` — maturity level comparisons
- **A.34 Organizational Memory:** `_obe_capture_memory_hook()` — metadata-only benchmark learnings

## Audit

Profile creation, comparison generation, benchmark overrides, recommendation generation, and exports via `_obe_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Industry benchmarks are anonymized aggregates. Aipify compares; humans decide action.
