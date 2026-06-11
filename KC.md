# Knowledge Center (KC) — Phase 55

Self-knowledge foundation so Aipify can answer questions about itself from a controlled, editable, searchable source of truth.

**Spec:** `aipify-core/modules/knowledge-center/phase-55-self-knowledge-knowledge-center.txt`  
**Code:** `lib/aipify/knowledge/`  
**Seed content:** `content/knowledge/aipify/` (includes `quality/faq/` for Quality Guardian — 30 global FAQ articles)  
**Center:** `/app/knowledge-center`  
**Gaps:** `/app/knowledge-center/gaps`  
**Settings:** `/app/settings/knowledge`  
**API:** `/api/aipify/knowledge/*`

---

## Principle

> Search Knowledge Center first. Answer only from known content. Create a Knowledge Gap when confidence is low. Never invent answers about Aipify.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter | Upgrade prompt |
| Growth+ | Full KC — articles, search, retrieval, gaps, assistant integration |

Module gate: `knowledge_center` in `lib/core/plans.ts` (growth, business, enterprise).

---

## Content model

**Hybrid storage:**
1. Git seed files in `content/knowledge/aipify/` (markdown + frontmatter)
2. Database runtime source of truth (`aipify_knowledge_articles`)
3. Import via `POST /api/aipify/knowledge/import-seed-content`

**Scope:**
- `tenant_id null` = global Aipify knowledge
- `tenant_id set` = tenant-specific knowledge

---

## Database

- `aipify_knowledge_categories`
- `aipify_knowledge_articles` (with `search_vector` full-text index)
- `aipify_knowledge_article_versions`
- `aipify_knowledge_search_logs`
- `aipify_knowledge_gaps` + `aipify_knowledge_gap_events`
- `aipify_knowledge_feedback`
- `aipify_knowledge_settings`
- `aipify_knowledge_audit_log`

**RPCs:** `get_customer_knowledge_center()`, `get_knowledge_settings()`, `update_knowledge_settings()`, `search_knowledge_articles()`, `retrieve_knowledge_answer()`, `upsert_knowledge_article()`, `publish_knowledge_article()`, `create_article_from_knowledge_gap()`, `import_knowledge_seed_articles()`, `submit_knowledge_feedback()`

Migration: `supabase/migrations/20260614300000_knowledge_center_phase55.sql`

---

## Retrieval flow

1. Detect Aipify product question (`isAipifyKnowledgeQuestion`)
2. Search tenant articles, then global published articles
3. Rank by title/slug/keyword/full-text match
4. If confidence ≥ minimum → answer with citation note
5. If confidence < gap threshold → create Knowledge Gap
6. Log search + audit

---

## Integrations

- **Admin Assistant** — `app/api/assistant/route.ts` calls `retrieve_knowledge_answer` before hardcoded feature replies
- **Support AI** — use `POST /api/aipify/knowledge/retrieve-answer`
- **Governance / Automation** — document behavior via seeded FAQ articles

---

## Seeded FAQ topics

What is Aipify, chatbot vs platform, approvals, emergency stop, support AI, automations, insights, predictions, data ownership, self-support, getting started.
