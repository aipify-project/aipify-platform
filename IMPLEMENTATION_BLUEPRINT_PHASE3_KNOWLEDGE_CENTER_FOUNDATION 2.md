# Implementation Blueprint — Phase 3: Knowledge Center Foundation

**Feature owner:** Customer App  
**Implementation:** [Knowledge Center Engine — Phase A.5](./KNOWLEDGE_CENTER_ENGINE_PHASE_A5.md)

This document defines **Phase 3** of the Aipify Business Operating System (ABOS) implementation blueprint. Organizational memory — the central source of truth for guidance, support, and operational intelligence.

## Mission

Establish the Knowledge Center as the **central source of truth** for organizational memory, companion guidance, support knowledge, employee learning, playbooks, values, and decision support — accessible, organized, actionable, and continuously improved.

## Core philosophy

**Accessible. Organized. Actionable. Continuously improved. Shared responsibly.**

Knowledge powers every approved Aipify response. Humans approve; Aipify informs and prepares.

## Knowledge Center objectives

- **Organizational memory** — institutional knowledge preserved per tenant
- **Companion guidance** — approved content for AI companion responses
- **Support knowledge base** — procedures, escalation, troubleshooting
- **Employee learning** — training materials and onboarding paths
- **Playbooks** — repeatable operational procedures
- **Values & culture** — purpose, human values, Self Love alignment
- **FAQ** — quick answers for teams and customers
- **Decision support** — context for operational and strategic decisions

## Knowledge types

| Type | Purpose |
|------|---------|
| Operational | Day-to-day procedures and workflows |
| Support | Customer and internal support documentation |
| Organizational | Policies, governance, structure |
| Companion | AI companion tone, guidelines, approved phrasing |
| Training | Employee onboarding and skill development |
| Strategic | Long-term direction and decision context |

## Article structure

Each knowledge article supports:

- Title, summary, category, tags (scaffold)
- Author, reviewer, approval workflow
- Version history with rollback
- Related content (scaffold)
- Visibility levels
- Timestamps (created, updated, published, review due)

## Visibility levels

| Blueprint level | Engine mapping | Audience |
|-----------------|----------------|----------|
| Public | `public` | External audiences |
| Organization | `internal` | All organization members |
| Workspace | `internal` (workspace scope scaffold) | Workspace members |
| Restricted | `internal` + permission enforcement | Role-gated access |

## AI companion integration

- AI retrieves **published** tenant knowledge first via `retrieve_knowledge_for_ai()`
- Unpublished and archived content is never used for customer-facing responses
- Companion guidance categories align with Companion Identity (A.84) and Self Love (A.76 scaffold)

## Knowledge evolution & gap detection

Scaffold metadata in `organization_workspace_settings.metadata.knowledge_evolution`:

- Gap detection enabled (future KC gaps integration)
- Evolution tracking enabled
- Self Love integration scaffold (A.76)
- Review cycle defaults

Full gap detection lives in KC Phase 55 (`/app/knowledge-center/gaps`) — blueprint aligns, does not duplicate.

## Quality & trust principles

- Tenant isolation mandatory
- Review before publication default
- Version history immutable
- Audit logging for significant events
- Metadata-first — no raw customer content in learning memory

## Dogfooding collections

**Aipify Group AS** (`aipify-group`): Product · Engineering · Support · Sales · Governance · Self Love · Human Values · Companion Guidelines

**Unonight** (`unonight`): Support · Operations · Marketplace · FAQ (pilot subset)

## Success criteria

Phase 3 is successful when:

- Knowledge categories exist per organization
- Published articles and FAQs are available
- Review workflow is operational
- Version history is tracked
- Visibility and permissions are enforced
- AI retrieval respects published-only rules
- Knowledge evolution scaffold is configured
- Dogfood categories seeded for internal pilot orgs

## ABOS principle

Knowledge without governance creates confusion. Governance without accessibility creates silence. Aipify combines trusted structure with human-readable guidance.

## Vision

Organizational memory is the intelligence layer beneath every module. Build it carefully — every future capability depends on what is documented, approved, and shared here.

## Implementation map

| Layer | Location |
|-------|----------|
| Migration (A.5) | `supabase/migrations/20260710000000_knowledge_center_engine_phase_a5.sql` |
| Blueprint alignment | `supabase/migrations/20260948000000_implementation_blueprint_phase3_knowledge_center.sql` |
| Route | `/app/knowledge-center-engine` |
| ILM | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase3-knowledge-center.txt` |
| FAQ | `content/knowledge/aipify/knowledge-center-engine/faq/implementation-blueprint-phase3-faq.md` |

## Related engines

- Organization & Workspace (A.75) — Phase 1 foundation
- Identity & Permissions (A.2) — access control
- Admin Assistant (A.6) — consumes KC for briefings
- Support AI (A.7) — support knowledge retrieval
- Self Love Engine (A.76) — values alignment scaffold
- KC Self-Knowledge (Phase 55) — `/app/knowledge-center` product FAQ layer
