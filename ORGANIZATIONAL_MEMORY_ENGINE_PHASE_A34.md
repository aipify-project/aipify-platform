# Organizational Memory Engine — Phase A.34

## Purpose

The Organizational Memory Engine enables Aipify to understand, remember, and continuously learn how an organization operates. Aipify should not start from zero every day — it accumulates operational understanding over time while respecting privacy, governance, and human oversight.

**Mission:** Transform scattered organizational information into structured, usable, and actionable intelligence.

Product framing: [ABOS Knowledge pillar](./ABOS_FOUNDATION.md#1-knowledge) · [ABOS Brand Terminology](./ABOS_BRAND_TERMINOLOGY_STANDARD.md)

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260805000000_organizational_memory_engine_phase_a34.sql` |
| Spec alignment | `supabase/migrations/20260920000000_organizational_memory_engine_spec_alignment.sql` |
| Prefix | `_ome_` |
| Lib | `lib/aipify/organizational-memory-engine/` |
| Core | `lib/core/organizational-memory-engine.ts` |
| API | `/api/aipify/organizational-memory-engine/*`, `/api/memory/*` |
| UI | `/app/organizational-memory-engine` |
| KC FAQ | `content/knowledge/aipify/organizational-memory-engine/faq/organizational-memory-engine-faq.md` |

## Memory levels

| Level | Description |
|-------|-------------|
| Session | Short-term conversational awareness |
| Workspace | Knowledge scoped to a workspace (integrates A.75) |
| Organization | Approved institutional knowledge (default) |
| Strategic | Executive insights and decision history |

## Knowledge domains

Operational knowledge · organizational preferences · historical context · customer intelligence · strategic knowledge

## Approved knowledge sources

Knowledge Center · internal documentation · FAQs · support conversations (metadata) · meeting notes · policies · case resolutions

## Human control

Approve sources · remove outdated information · restrict sensitive content · retention policies · review summaries · full audit trail

## Self Love connection (A.76 planned)

Self Love monitors memory quality — duplicates, outdated docs, contradictions, cleanup recommendations. Self Love protects Organizational Memory health.

## Core tables

- `organization_memory_records` — metadata summaries, `memory_level`, optional `workspace_id`, `knowledge_source_type`
- `organization_decision_register` — decision title, rationale, alternatives, outcomes
- `organization_memory_reviews` — scheduled quarterly/annual/event reviews
- `organization_memory_settings` — retention, capture rules per category

## Memory categories

`operational_decisions` · `resolved_incidents` · `support_learnings` · `approval_precedents` · `strategic_decisions` · `onboarding_lessons` · `process_improvements`

## RPCs

- `get_organizational_memory_engine_dashboard()` — mission, memory levels, ABOS principle, Self Love note
- `get_organizational_memory_engine_card()`
- `create_organization_memory_record()` — optional memory level, workspace, knowledge source
- `update_organization_memory_record()` · `perform_organization_memory_action()`
- `create_organization_decision_register_entry()` · `schedule_organization_memory_review()`
- `capture_organization_memory()` · `search_organization_memory_records()`

## Permissions

`memory.view` · `memory.create` · `memory.edit` · `memory.archive` · `memory.review`

## Business benefits

Faster onboarding · consistent support · reduced silos · better decisions · operational efficiency

## Distinctions

Distinct from **PAME** (personal) and **Learning Engine** (improves Aipify). Extends legacy `/app/memory`. Metadata only — no raw PII.

## ABOS principle

> Knowledge should not disappear when employees leave. A healthy organization preserves what it learns.

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via `organizations.id`.
