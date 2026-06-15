# Knowledge Evolution & Learning Engine — Phase 278

**Feature owner:** Platform Admin  
**Route:** `/platform/knowledge/evolution-center`  
**Module:** `lib/platform-knowledge-evolution/`  
**Migration:** `supabase/migrations/20261465000000_knowledge_evolution_learning_engine_phase278.sql`

## Purpose

Continuously improve Aipify knowledge quality by learning from support interactions, feedback, successful resolutions, and approved organizational knowledge.

## Capabilities

| Area | Description |
|------|-------------|
| Overview cards | Knowledge articles, suggested improvements, pending reviews, recently updated, gaps, learning opportunities |
| Knowledge sources | Approved support cases, customer feedback, FAQ updates, product releases, internal docs, success playbooks, Growth Partner insights |
| Knowledge gaps | Unanswered questions, repeated support, missing docs, outdated articles, low-confidence responses |
| Suggested improvements | Create/expand articles, update screenshots, improve troubleshooting, add localization |
| Article health score | Usage, helpfulness, resolution effectiveness, freshness, feedback sentiment |
| Health statuses | Excellent, healthy, needs review, outdated |
| Review workflow | Draft → review required → approved → published → archived |
| Approval roles | Super Admin, Knowledge Admin, Product Owner |
| Localization | en/no/sv/da with translation complete, pending, review needed |
| Recommendation engine | Support repeat detection, low usefulness alerts, release doc reminders |
| Knowledge analytics | Most/highest/lowest viewed and rated, most requested topics, resolution contribution |
| Audit logging | Created, updated, approval, publication, recommendation accepted/declined, gap resolved |

## APIs

| Method | Path | RPC |
|--------|------|-----|
| GET | `/api/platform-knowledge-evolution/overview` | `get_knowledge_evolution_center(p_filters)` |
| POST | `/api/platform-knowledge-evolution/actions` | `record_knowledge_evolution_action(p_payload)` |

## Distinction

This is the **Platform Admin** knowledge governance surface. Customer App Knowledge Evolution (Phase 317) at `/app/knowledge-center/knowledge-evolution` remains tenant-scoped organizational learning — separate module and tables.

## Founding principle

Knowledge should improve continuously. Every solved problem is an opportunity to help the next customer faster.

Aipify Group AS — Bergen, Norway. For the world.
