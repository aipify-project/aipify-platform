# Implementation Blueprint — Phase 13: Executive Insights Engine Foundation

**Feature owner:** Customer App  
**Implementation:** [Executive Insights Engine — Phase A.35](./EXECUTIVE_INSIGHTS_ENGINE_PHASE_A35.md)

This document defines **Phase 13 — Executive Insights Engine Foundation** of the Aipify Business Operating System (ABOS). It aligns the existing Executive Insights Engine with ABOS executive guidance standards — clarity over noise, explainable summaries, and sustainable leadership decisions.

> **Mapping:** ABOS Implementation Blueprint Phase 13 maps to **Executive Insights Engine Phase A.35** at `/app/executive-insights-engine`. Do not duplicate a separate Executive engine — extend A.35 RPCs, dashboard, and ILM vocabulary only. Distinct from Platform Admin `/platform/executive` and customer `/app/executive` briefing routes.

## Mission

Clear executive guidance from organizational data — healthier decisions, stronger operations, sustainable growth.

## Core philosophy

**Executives need clarity, not more dashboards** — surface what matters with explainable metadata summaries. Humans decide; Aipify informs and prepares.

## Executive objectives

| Objective | Description |
|-----------|-------------|
| **What** | Surface operational, support, and strategic shifts since the last executive review |
| **Why** | Explainable rationale connecting signals to business impact |
| **Attention** | Risks, bottlenecks, and high-urgency actions requiring leadership awareness |
| **Improving** | Health trajectories, resolved cases, completed priorities, positive trends |
| **Actions** | Action-oriented summaries with urgency, expected outcome, and estimated effort |

## Overview capabilities

| Capability | Description |
|------------|-------------|
| **Daily summary** | Short operational pulse — metadata counts and priority shifts |
| **Weekly summary** | Organization health, risks, opportunities, recommended actions |
| **Monthly summary** | Strategic trends, customer success trajectory, action register |
| **Risk notifications** | Quality, security, support escalation, renewal risk — severity metadata only |
| **Growth opportunities** | Strategic opportunities, success playbooks, operations recommendations |
| **Priority recommendations** | Explainable leadership actions — approval required for execution |

## Insight categories

| Category | Focus | Example signals |
|----------|-------|-----------------|
| **Operational** | Health scores, quality findings, operations alerts | Organization health at 82; two quality findings open |
| **Support** | Case resolution, escalation patterns, support AI metrics | 12 cases resolved since last login |
| **Knowledge** | KC updates, knowledge gaps, procedure coverage | Four KC articles updated this week |
| **Companion** | Proactive guidance, bell moments, gratitude, pacing | 🔔 Weekly priorities completed; 🌹 recognition opportunity |
| **Strategic** | Opportunities, alignment, predictive insights | Two strategic opportunities for leadership review |

## Since Last Time

Live aggregate block from tenant metadata since the user's last login (or 7-day fallback):

| Signal | Source |
|--------|--------|
| Support cases resolved | `organization_support_cases` — resolved/closed since window |
| KC articles updated | `knowledge_articles` — updated or published since window |
| High-priority tasks completed | `organization_tasks` — critical/high completed since window |
| Bottlenecks open | `organization_quality_checks`, overdue tasks, escalated support cases |
| Bell moments | `presence_engagement_events` — celebration/milestone counts only |

**Window assumption:** `admin_assistant_sessions.previous_login_at` → `auth.users.last_sign_in_at` → last `presence_engagement_events` activity → 7-day fallback. Documented in `_eie_since_last_time_summary()`.

## Companion communication style examples

- 🔔 *"Your team resolved 12 support cases since your last visit — steady progress worth celebrating."*
- 🌹 *"Three teammates completed high-priority tasks this week — would you like to send recognition?"*
- 🦉 *"Before the quarterly review, here is what changed in operations health — take a moment to reflect."*

## Self Love connection

Self Love influences executive guidance through:

- **Perspective** — surface what matters without alarmist dashboards
- **Sustainable decisions** — flag when critical items pile up
- **Team recognition** — connect completions to gratitude moments
- **Healthy prioritization** — routine review over constant urgency

Self Love is a **principle** — not a feature toggle. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md) (no ™).

Route: `/app/self-love-engine`

## Trust connection

Executive insights must stay **transparent**:

- Executives know which modules contributed each signal
- Health scores use metadata factors — not raw customer records
- Since Last Time explains its window source
- Reports, exports, and schedules are fully audited via `_eie_log()`

## Distinction from other executive surfaces

| Surface | Route | Purpose |
|---------|-------|---------|
| **Executive Insights Engine A.35** | `/app/executive-insights-engine` | Tenant reporting, risks, opportunities, schedules |
| **Customer Executive Dashboard** | `/app/executive` | Daily briefings and morning summaries |
| **Platform Admin Executive** | `/platform/executive` | Aipify Group AS global governance — never mix |

## Dogfooding

**Aipify Group AS** (`aipify-group`): Internal validation — weekly executive summaries, risk surfacing, Since Last Time blocks, Self Love cross-links.

**Unonight** (`unonight`): First external pilot — support resolution trends, customer success trajectory, operational bottlenecks, action recommendations with human approval.

## Success criteria

Phase 13 is successful when (live checks on dashboard):

- Executive reports generated with explainable summaries
- Organization health score computed from operational metadata
- Operational risks surfaced with severity and source modules
- Growth opportunities surfaced for leadership review
- Since Last Time block populated with metadata counts
- Report schedules configured for delivery scaffolding
- Action recommendations available with rationale and urgency
- Summaries remain metadata only — no PII

## ABOS principle

> Clarity beats noise — explainable executive insights help leaders decide with confidence.

## Vision

> Leaders see what changed, why it matters, and what to do next — with transparent sources and sustainable pacing.

Closing phrases (examples):

- *Clarity beats more dashboards — executives need what matters, not everything at once.*
- *Explainable insights build trust — every signal shows its source and assumption.*
- *Humans decide — Aipify informs, prepares, and recommends.*
- *Since Last Time — pick up where you left off with counts and trends, not noise.*

## Integration links

| Module | Route |
|--------|-------|
| Analytics & Insights A.16 | `/app/analytics-insights-engine` |
| Operations Dashboard A.9 | `/app/operations-dashboard-engine` |
| Operations Center A.32 | `/app/operations` |
| Support AI A.7 | `/app/support-ai-engine` |
| Knowledge Center A.5 | `/app/knowledge-center-engine` |
| Tasks & Follow-Up A.62 | `/app/unified-task-follow-up-engine` |
| Predictive Insights A.66 | `/app/predictive-insights-engine` |
| Strategic Alignment A.55 | `/app/strategic-alignment-engine` |
| Self Love A.76 | `/app/self-love-engine` |
| Gratitude & Recognition A.89 | `/app/gratitude-recognition-engine` |

## Technical alignment

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260960000000_implementation_blueprint_phase13_executive_insights.sql` |
| Prefix | `_eie_` |
| Lib | `lib/aipify/executive-insights-engine/` |
| UI | `/app/executive-insights-engine` |
| ILM | `implementation-blueprint-phase13-executive-insights.txt` |
| KC FAQ | `content/knowledge/aipify/executive-insights-engine/faq/implementation-blueprint-phase13-faq.md` |

No new tables. Extends `get_executive_insights_engine_dashboard()` and `get_executive_insights_engine_card()` only.
