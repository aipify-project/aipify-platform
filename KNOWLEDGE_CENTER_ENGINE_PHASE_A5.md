# Knowledge Center Engine — Phase A.5

## Vision

**Ensure Aipify provides accurate, trusted, and organization-specific responses using approved information sources.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260710000000_knowledge_center_engine_phase_a5.sql` |
| Prefix | `_kce_` · decision type: `knowledge_center_engine` |
| Lib | `lib/aipify/knowledge-center-engine/`, `lib/core/knowledge.ts` |
| API | `/api/aipify/knowledge-center-engine/*`, `/api/knowledge/*` |
| UI | `/app/knowledge-center-engine` |
| KC FAQ | `content/knowledge/aipify/knowledge-center-engine/faq/knowledge-center-engine-faq.md` |

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

- `get_knowledge_center_engine_dashboard()` — knowledge health dashboard
- `get_knowledge_center_engine_card()` — summary card
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
