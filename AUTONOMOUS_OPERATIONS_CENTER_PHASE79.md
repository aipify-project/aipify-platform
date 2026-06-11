# Autonomous Operations Center (AOC) — Phase 79

Build an Autonomous Operations Center that continuously monitors organizational health, identifies emerging issues, highlights opportunities, and provides operational recommendations — without taking control away from humans.

## Core principle

**AOC observes. AOC prioritizes. AOC recommends. AOC never governs the organization.**

Human oversight remains mandatory.

## Philosophy

AOC exists to improve awareness, reduce blind spots, detect issues early, surface opportunities, and coordinate attention.

AOC does NOT replace leadership, execute irreversible actions, override Governance, monitor employee productivity, or remove human judgment.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/operations` | Operational Health, watchers, findings, recommendations, reviews |
| `/app/operations/watchers/[id]` | Watcher finding detail with evidence and linked recommendation |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/aoc/card` | `get_aoc_card` |
| `GET /api/aipify/aoc/dashboard` | `get_aoc_dashboard` |
| `GET /api/aipify/aoc/watchers/[id]` | `get_aoc_watcher_finding` |
| `POST /api/aipify/aoc/reviews/generate` | `generate_aoc_review` |
| `POST /api/aipify/aoc/jobs/run` | `run_aoc_watchers`, `calculate_aoc_operational_health` |

## Watchers (10)

Support, Knowledge, Quality, Governance, Action, Desktop, Security, Twin, Marketplace, Value

## Operational Health Score (0–100)

| Band | Range |
|------|-------|
| Excellent | 90–100 |
| Healthy | 75–89 |
| Attention Recommended | 60–74 |
| Operational Risk | 40–59 |
| Critical | Below 40 |

Components: support, knowledge, quality, governance, action, communication, security, value, twin

## Reviews

- **Daily** — emerging issues, bottlenecks, risks, opportunities
- **Weekly** — trends, health changes, escalation patterns
- **Executive** — strategic risks, cross-team concerns, value trends

## Migration

`supabase/migrations/20260617000000_autonomous_operations_center_phase79.sql`

Tables: `aoc_health_scores`, `aoc_watcher_findings`, `aoc_recommendations`, `aoc_reviews`, `aoc_watcher_settings`, `aoc_audit_log`

## Integrations

| Module | Use |
|--------|-----|
| Digital Twin | Ownership validation, bottleneck detection |
| Value Engine | ROI and opportunity monitoring |
| Learning Engine | Pattern refinement |
| Trust Engine | Recommendation explanations |
| Executive Briefing | Health and risk summaries |
| Desktop Companion | Daily priorities and alerts |
| Multi-Agent | Auditable watcher collaboration |

## Library

`lib/aipify/aoc/` — types, parse, jobs

## Knowledge Center

Category: `operations`  
FAQ: `content/knowledge/aipify/operations/faq/operations-faq.md`

## Out of scope (V1)

- Autonomous executive authority
- Employee productivity scoring
- Hidden employee monitoring
- Governance bypass mechanisms
- Automatic irreversible operations
