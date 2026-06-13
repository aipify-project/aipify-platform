# Implementation Blueprint — Phase 14: Knowledge Evolution Foundation

**Feature owner:** Customer App  
**Implementation:** [Knowledge Center Engine — Phase A.5](./KNOWLEDGE_CENTER_ENGINE_PHASE_A5.md)

This document defines **Phase 14** of the Aipify Business Operating System (ABOS) implementation blueprint. Knowledge Evolution extends the Phase 3 Knowledge Center Foundation — proactive recommendations and health indicators atop existing KC tables and metadata. **No new tables.**

## Mission

Maintain **relevant, accurate, useful knowledge** through proactive, explainable recommendations — not silent auto-updates.

## Core philosophy

**Knowledge is not static.** Organizations, processes, and customers evolve. The Knowledge Center must evolve with them — humans approve every change.

## Objectives

- Detect outdated information before it misleads teams or AI
- Surface knowledge gaps from support patterns
- Recommend improvements with transparent reasoning
- Identify overlapping content (heuristic scaffold)
- Highlight frequently referenced topics for review
- Encourage regular human review cycles

## Health indicators

Computed live from existing KC and support metadata via `_kce_compute_knowledge_health_scores()`:

| Score | Inputs (metadata only) |
|-------|------------------------|
| **Freshness** | Published articles vs review cycle (`updated_at`, `review_due_at`), stale count |
| **Coverage** | Published articles + FAQs vs categories, open `support_ai_knowledge_gaps` |
| **Quality** | Overdue reviews, draft/review queue depth |

## Proactive recommendations

Live from `_kce_knowledge_evolution_recommendations()`:

- **Stale articles** — published content older than review cycle (default 180 days)
- **Review queue** — draft and review items awaiting human approval
- **Support gaps** — open rows in `support_ai_knowledge_gaps` (question metadata only)
- **Overlapping content** — same category + similar title prefix (heuristic scaffold)
- **Frequent topics** — high `view_count` published articles

Each recommendation includes `explanation`, `source`, and `action_hint`. No raw support chat or email content.

## Knowledge creation opportunities

Scaffold aligned with live gap signals:

- Repeated support questions → FAQ or article drafts
- Similar agent response patterns (future scaffold)
- New operational workflows → playbook updates
- Lessons learned from Organizational Memory A.34

## Self Love connection (A.76)

Self Love encourages **clarity and sustainable documentation** — simplify docs, reduce complexity, gentle review pacing. Not perfectionism or guilt-based motivation. Route: `/app/self-love-engine`.

## Organizational Memory connection (A.34)

Retrospectives, interventions, and process improvements from Organizational Memory may suggest KC updates. Knowledge explains how things **should** work; memory captures how they **unfolded**. Route: `/app/organizational-memory-engine`.

## Trust

- Transparent **why**, **sources**, and **approvers**
- Recommendations are advisory — KC approval workflow remains authoritative
- Metadata-only signals — no raw customer content

## Dogfooding

**Aipify Group AS** (`aipify-group`): product, support, engineering, executive playbooks — internal evolution hygiene.

**Unonight** (`unonight`): marketplace operations, support escalation reviews, pilot lessons learned.

## Success criteria

Phase 14 is successful when (computed live via `_kce_evolution_blueprint_success_criteria()`):

- Freshness, coverage, and quality scores computed from live metadata
- Evolution settings configured in `organization_workspace_settings.metadata.knowledge_evolution`
- Proactive recommendations generated from KC and support signals
- Stale content monitored against review cycle
- Support gaps linked to creation recommendations
- Review queue visible for human approval
- Trust transparency documented — metadata only
- Organizational Memory A.34 alignment scaffold enabled

## ABOS principle

Knowledge without governance creates confusion. Governance without accessibility creates silence. **Evolution without transparency creates distrust** — Aipify recommends; humans decide.

## Vision

Proactive knowledge evolution keeps organizational memory trustworthy as ABOS grows — every module depends on what is documented, approved, and honestly maintained.

## Integration links

| Module | Route |
|--------|-------|
| Organizational Memory A.34 | `/app/organizational-memory-engine` |
| Support AI A.7 | `/app/support-ai-engine` |
| Continuous Improvement A.33 | `/app/continuous-improvement-engine` |
| Self Love A.76 | `/app/self-love-engine` |
| Legacy A.86 | `/app/legacy-engine` |
| Knowledge Center Engine A.5 | `/app/knowledge-center-engine` |
| KC Self-Knowledge Phase 55 | `/app/knowledge-center` |

## Implementation map

| Layer | Location |
|-------|----------|
| Migration (A.5) | `supabase/migrations/20260710000000_knowledge_center_engine_phase_a5.sql` |
| Blueprint Phase 3 | `supabase/migrations/20260948000000_implementation_blueprint_phase3_knowledge_center.sql` |
| Blueprint Phase 14 | `supabase/migrations/20260961000000_implementation_blueprint_phase14_knowledge_evolution.sql` |
| Route | `/app/knowledge-center-engine` |
| UI | `components/app/knowledge-center-engine/KnowledgeCenterEngineDashboardPanel.tsx` |
| Types | `lib/aipify/knowledge-center-engine/` |
| ILM | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase14-knowledge-evolution.txt` |
| FAQ | `content/knowledge/aipify/knowledge-center-engine/faq/implementation-blueprint-phase14-faq.md` |

## Distinction from KC Phase 55

Phase 55 (`/app/knowledge-center`) is **Aipify product self-knowledge**. Phase A.5 / Blueprint Phases 3 and 14 are **tenant-owned organizational knowledge** at `/app/knowledge-center-engine`.
