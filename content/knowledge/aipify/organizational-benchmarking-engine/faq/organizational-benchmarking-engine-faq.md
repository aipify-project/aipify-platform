# Organizational Benchmarking Engine FAQ

## FAQ 1

**Question:** What is the Organizational Benchmarking Engine?

**Answer:** The Organizational Benchmarking Engine compares metadata-only organizational metrics — support response times, training completion, workflow adoption, incident resolution, maturity levels, and health scores — against internal baselines and anonymized industry benchmarks. Humans review gaps and decide action; Aipify does not auto-execute changes.

## FAQ 2

**Question:** How is this different from Industry Intelligence (A.44)?

**Answer:** Industry Intelligence Foundation provides industry profiles, terminology, and insight catalogs. The Organizational Benchmarking Engine (nav id `organizationalBenchmarkingEngine`, route `/app/organizational-benchmarking-engine`) runs structured metric comparisons with position metadata, recommendations, and executive benchmark exports. Industry hooks feed anonymized benchmark values — no PII.

## FAQ 3

**Question:** How do benchmark comparisons and overrides work?

**Answer:** Teams create or use seeded benchmark profiles by category (`internal`, `industry`, `maturity`, `performance`, `adoption`). `generate_benchmark_comparison()` aggregates org metadata and computes position metadata (above, near, below). Authorized users may call `override_benchmark()` with audited reason when a benchmark value needs manual adjustment.

## FAQ 4

**Question:** Who can manage and export benchmark data?

**Answer:** Viewing requires `benchmarks.view`. Creating profiles and generating comparisons requires `benchmarks.manage`. Generating recommendations requires `benchmarks.review`. Report export requires `benchmarks.export`. Owners and administrators typically hold full permissions; support agents may view comparisons.
