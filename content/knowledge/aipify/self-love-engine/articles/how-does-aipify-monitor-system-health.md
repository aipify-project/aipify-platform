# How does Aipify monitor its own system health?

**Category:** Self Love Engine · **Phase:** A.76

Self Love connects to **system health through aggregate signals only** — it does not duplicate Quality Guardian or Observability engines.

The Self Love Engine reads counts from:

- **Quality Guardian (A.13)** — open and critical quality checks
- **Observability (A.19)** — degraded components and open incidents

These appear on the Self Love dashboard as metadata summaries. When platform health needs attention, Self Love communicates calmly:

> Systems that care for themselves are better equipped to care for others.

For detailed monitoring, use:

- `/app/quality-guardian-engine`
- `/app/observability-platform-health-engine`

Self Love provides a **wellbeing lens** on system health — positive, non-alarmist, and actionable.
