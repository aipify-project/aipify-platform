# Implementation Blueprint — Phase 18: Operations Center Engine Foundation

**Feature owner:** Customer App  
**Implementation:** [Operations Center Foundation Engine — Phase A.32](./OPERATIONS_CENTER_FOUNDATION_ENGINE_PHASE_A32.md)

This document defines **Phase 18 — Operations Center Engine Foundation** of the Aipify Business Operating System (ABOS). It aligns the existing Operations Center Foundation Engine with ABOS operational coordination standards — visibility, coordination, control, and calm focus.

> **Mapping:** ABOS Implementation Blueprint Phase 18 maps to **Operations Center Foundation Engine Phase A.32** at `/app/operations-center-foundation-engine`. Do not duplicate a separate Operations Center engine — extend A.32 RPCs, dashboard, and ILM vocabulary only.

## Mission

Centralized operational experience — visibility, coordination, and control across modules.

## Core philosophy

**Operational clarity creates confidence** — reduce noise, increase focus, enable informed action. Humans decide; Aipify aggregates and explains.

## Operational objectives

| Objective | Description |
|-----------|-------------|
| **Monitor** | Cross-module operational visibility — support, tasks, knowledge, executive signals |
| **Surface** | Since Last Time counts and module overview blocks — trends, not noise |
| **Coordinate** | Operational events with assignment, acknowledgment, and resolution |
| **Priorities** | High-priority tasks, urgent events, and executive concerns in one place |
| **Bottlenecks** | Escalations, overdue tasks, quality findings, integration failures |
| **Action** | Explainable summaries with source modules and routes — humans decide |

## Operational module overviews

Five metadata overview blocks from `_ocf_module_overviews()`:

| Module | Counts | Source tables |
|--------|--------|---------------|
| **Support Overview** | Open cases, escalations, resolution trends (30d) | `organization_support_cases` |
| **Task Overview** | High-priority open, overdue, due within 7 days | `organization_tasks` |
| **Knowledge Overview** | Published, draft/review, open gaps, updates (30d) | `knowledge_articles`, `support_ai_knowledge_gaps` |
| **Executive Overview** | Reports generated, operational risks, operations concerns | `executive_reports`, `_eie_aggregate_risks`, `operations_events` |
| **Recognition Overview** | Gratitude moments, recognition opportunities, celebrations, bell moments | `organization_gratitude_moments`, `presence_engagement_events` |

## Since Last Time

Live aggregate block from tenant metadata since the user's last login (or 7-day fallback):

| Signal | Source |
|--------|--------|
| Support cases resolved | `organization_support_cases` — resolved/closed since window |
| KC articles updated | `knowledge_articles` — updated or published since window |
| High-priority tasks completed | `organization_tasks` — critical/high completed since window |
| Bottlenecks open | Overdue tasks, escalated cases, quality checks |
| Bell moments | `presence_engagement_events` — celebration/milestone counts |
| Recognition moments | `organization_gratitude_moments` since window |

**Window assumption:** `admin_assistant_sessions.previous_login_at` → `auth.users.last_sign_in_at` → last `presence_engagement_events` activity → 7-day fallback. Documented in `_ocf_since_last_time_summary()`.

## Companion communication style examples

- 🔔 *"Your team resolved 12 support cases since your last visit — steady progress worth noting."*
- 🌹 *"Three teammates completed high-priority tasks this week — would you like to send recognition?"*
- 🦉 *"Before the weekly operations review — here is what changed across support, tasks, and knowledge."*

## Self Love connection

Self Love influences operations coordination through:

- **Reduce stress** — surface what matters without alarmist dashboards
- **Clarify priorities** — high-priority tasks and urgent events with explainable context
- **Highlight accomplishments** — Since Last Time resolutions and recognition moments
- **Calm not overwhelm** — module overviews use counts, not raw records

Self Love is a **principle** — not a feature toggle. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md) (no ™).

Route: `/app/self-love-engine`

## Trust connection

Operations Center must stay **transparent**:

- Users understand which modules contributed each overview block
- Since Last Time window source is documented on the dashboard
- Operational events aggregate from Admin Assistant, Quality, Integrations, and more
- Acknowledge and resolve actions are audited via `_ocf_log()` — metadata only

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Operations Dashboard A.9** | `/app/operations-dashboard-engine` | Role-aware widget dashboard |
| **Command Center Phase 26** | `/app/command-center` | Presence and notifications |
| **AOC Phase 79** | `/app/operations` | Autonomous operations watchers |
| **Executive Insights A.35** | `/app/executive-insights-engine` | Executive summaries — Since Last Time pattern reused |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — cross-module visibility, Since Last Time, event coordination, platform health |
| **Unonight** | First external pilot — commerce support trends, launch priorities, knowledge gaps, recognition |

## Success criteria (live)

Computed by `_ocf_blueprint_success_criteria()`:

1. Five module overview blocks populated
2. Since Last Time block populated
3. Cross-module events aggregated
4. Urgent actions visible
5. Acknowledge/resolve workflows available
6. Cross-module route links present
7. Companion examples documented
8. Metadata-only privacy enforced

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_ocf_module_overviews(org_id)` | Five module overview blocks |
| `_ocf_since_last_time_summary(org_id, user_id)` | Since Last Time counts |
| `_ocf_blueprint_success_criteria(org_id)` | Live success criteria |
| `get_operations_center_foundation_engine_dashboard()` | Extended with Phase 18 fields — **all A.32 fields preserved** |
| `get_operations_center_foundation_engine_card()` | Extended with module overviews and Since Last Time |

Migration: `supabase/migrations/20260965000000_implementation_blueprint_phase18_operations_center.sql`  
Base engine: `supabase/migrations/20260814000000_operations_center_foundation_engine_phase_a32.sql`

## Integration links

Support AI A.7 · Tasks A.62 · Knowledge Center A.5 · Executive Insights A.35 · Gratitude A.89 · Self Love A.76 · Operations Dashboard A.9 · Command Center · AOC Phase 79

## Vision phrases

- Operational clarity creates confidence — one place to see what needs attention.
- Reduce noise, increase focus — module overviews show counts, not everything at once.
- Humans decide — Aipify aggregates, explains, and prepares.
- Since Last Time — pick up where you left off with trends across support, tasks, and knowledge.
- Calm coordination beats alert fatigue.
