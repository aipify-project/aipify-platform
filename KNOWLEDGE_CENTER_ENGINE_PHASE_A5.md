# Knowledge Center Engine — Phase A.5

## Vision

**Ensure Aipify provides accurate, trusted, and organization-specific responses using approved information sources.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260710000000_knowledge_center_engine_phase_a5.sql` |
| Blueprint alignment | `supabase/migrations/20260948000000_implementation_blueprint_phase3_knowledge_center.sql` |
| Blueprint Phase 14 | `supabase/migrations/20260961000000_implementation_blueprint_phase14_knowledge_evolution.sql` |
| Blueprint doc | [IMPLEMENTATION_BLUEPRINT_PHASE3_KNOWLEDGE_CENTER_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE3_KNOWLEDGE_CENTER_FOUNDATION.md) |
| Blueprint Phase 14 doc | [IMPLEMENTATION_BLUEPRINT_PHASE14_KNOWLEDGE_EVOLUTION_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE14_KNOWLEDGE_EVOLUTION_FOUNDATION.md) |
| Prefix | `_kce_` · decision type: `knowledge_center_engine` |
| Lib | `lib/aipify/knowledge-center-engine/`, `lib/core/knowledge.ts` |
| API | `/api/aipify/knowledge-center-engine/*`, `/api/knowledge/*` |
| UI | `/app/knowledge-center-engine` |
| KC FAQ | `content/knowledge/aipify/knowledge-center-engine/faq/knowledge-center-engine-faq.md` |
| Blueprint FAQ | `content/knowledge/aipify/knowledge-center-engine/faq/implementation-blueprint-phase3-faq.md` |
| Blueprint Phase 14 FAQ | `content/knowledge/aipify/knowledge-center-engine/faq/implementation-blueprint-phase14-faq.md` |
| ILM | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase3-knowledge-center.txt` |
| ILM Phase 14 | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase14-knowledge-evolution.txt` |

## Core tables

| Table | Purpose |
|-------|---------|
| `knowledge_categories` | Organization-scoped category catalog |
| `knowledge_articles` | Tenant-owned articles with versioning and search |
| `knowledge_article_revisions` | Immutable revision history with rollback support |
| `knowledge_imports` | Import tracking for text, markdown, FAQ, support docs |
| `knowledge_faq_items` | Extended with `review` status (from Phase A.1) |

## Knowledge principles

- Tenant-aware (`organization_id`)
- Organizations own their knowledge
- AI prioritizes published, approved content
- Version history with rollback
- Access respects permissions and visibility

## RPCs

- `get_knowledge_center_engine_dashboard()` — knowledge health dashboard with Implementation Blueprint Phase 3 and Phase 14 fields
- `get_knowledge_center_engine_card()` — summary card with blueprint mission, philosophy, and Phase 14 health scores
- `_kce_blueprint_success_criteria(uuid)` — live Phase 3 success criteria
- `_kce_evolution_blueprint_success_criteria(uuid)` — live Phase 14 Knowledge Evolution success criteria
- `_kce_compute_knowledge_health_scores(uuid)` — freshness, coverage, quality scores (metadata only)
- `_kce_knowledge_evolution_recommendations(uuid)` — proactive recommendations from stale articles, review queue, support gaps, duplicate heuristic
- `_kce_default_knowledge_evolution()` — evolution settings defaults including Phase 14 flags
- `_kce_seed_blueprint_dogfood_categories(uuid)` — dogfood category seeds for pilot orgs
- `_kce_ensure_evolution_settings(uuid)` — knowledge evolution scaffold in org settings metadata
- `search_organization_knowledge(jsonb)` — keyword search with filters and relevance ranking
- `retrieve_knowledge_for_ai(text, text, text)` — AI retrieval with publication rules
- `create_organization_knowledge_article(...)` — create draft article
- `submit_knowledge_article_for_review(uuid)` — start review workflow
- `publish_organization_knowledge_article(uuid)` — publish approved content
- `archive_organization_knowledge_article(uuid)` — archive content
- `rollback_organization_knowledge_article(uuid, int)` — restore prior version
- `create_organization_knowledge_faq(...)` — create FAQ item
- `import_organization_knowledge(jsonb)` — bulk import with review workflow
- `get_published_knowledge_articles(text)` — list published articles

## Permissions

- `knowledge.view`, `knowledge.create`, `knowledge.edit`, `knowledge.review`, `knowledge.publish`, `knowledge.archive`

## TypeScript helpers (`lib/core/knowledge.ts`)

- `searchKnowledge()`, `getPublishedArticles()`, `publishArticle()`, `archiveArticle()`
- `createFaq()`, `rollbackArticleVersion()`, `retrieveKnowledgeForAi()`

## API endpoints

- `GET /api/aipify/knowledge-center-engine/dashboard`
- `GET /api/aipify/knowledge-center-engine/card`
- `GET /api/knowledge/search?query=&category_slug=&language=&status=`
- `POST /api/knowledge/import` — `{ import_type, source_name, items[] }`
- `POST /api/knowledge/articles/publish` — `{ article_id }`

## AI retrieval rules

- Search tenant knowledge first
- Prioritize published content only
- Respect visibility settings
- Exclude archived content
- Cite source articles internally

## Audit events

Article creation, updates, publishing, archival, FAQ modifications, and imports are logged via `_kce_log` → `_mta_create_audit_log`.

## Principle

Unpublished knowledge never powers customer-facing AI responses. Every change is versioned, reviewable, and auditable.

## Implementation Blueprint Phase 3

Aligns A.5 with ABOS organizational memory requirements — no new tables. Adds mission, knowledge types, visibility mapping, success criteria, dogfood collections, companion integration metadata, and knowledge evolution scaffold. Gaps (scaffold only): article tags, related content, workspace-scoped visibility, full Self Love A.76 integration, automated organizational gap detection (KC Phase 55 handles product self-knowledge gaps).

## Implementation Blueprint Phase 14 — Knowledge Evolution

Extends Phase 3 evolution scaffold at the same route — no new tables. Proactive recommendations, health indicators (Freshness, Coverage, Quality), creation opportunities, Organizational Memory A.34 and Self Love A.76 connections, trust transparency, live Phase 14 success criteria. Metadata only — no raw support chat in recommendations. Duplicate detection is a same-category + similar title prefix heuristic (scaffold). See [IMPLEMENTATION_BLUEPRINT_PHASE14_KNOWLEDGE_EVOLUTION_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE14_KNOWLEDGE_EVOLUTION_FOUNDATION.md).
