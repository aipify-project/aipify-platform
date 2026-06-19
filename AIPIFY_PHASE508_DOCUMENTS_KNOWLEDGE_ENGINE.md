# AIPIFY – PHASE 508
## Documents, Knowledge & File Management Engine

**Feature owner:** CUSTOMER APP  
**Routes:** `/app/documents` · `/app/knowledge`  
**Migration:** `supabase/migrations/20261850800000_documents_knowledge_file_management_engine_phase508.sql`

## Purpose

Universal document, file, and knowledge engine for all APP organizations and Business Packs. Extends Phase A.5 `knowledge_articles` — new `organization_documents` layer for file metadata and workflows.

## Core principle

Knowledge should not disappear when employees leave. Documents should be easy to find. Companion understands company knowledge.

## Structure

```
PLATFORM → APP → KNOWLEDGE & DOCUMENT ENGINE → EMPLOYEES
```

## Components

| Layer | Path |
|-------|------|
| Migration & RPCs | `supabase/migrations/20261850800000_*.sql` |
| Library | `lib/document-knowledge/` |
| Document Center | `app/app/documents`, `components/app/document-knowledge/DocumentManagementPanel.tsx` |
| Knowledge Center | `app/app/knowledge`, `components/app/document-knowledge/KnowledgeManagementPanel.tsx` |
| APIs | `/api/app/documents`, `/api/app/knowledge`, `/api/app/knowledge/search`, `/api/assistant/knowledge-context` |

## Document Center sections

Recent · Shared · Departments · Templates · Policies · Contracts · Reports · Archives · Search

## Document statuses

`draft` · `under_review` · `requires_update` · `published` · `restricted` · `archived`

## RPCs

- `get_document_management_center()` — Document Center bundle
- `get_knowledge_management_center()` — Knowledge Center (wraps Phase A.5 dashboard)
- `perform_document_management_action()` — create, update, review, approve, archive, rollback, template
- `search_global_knowledge_documents()` — unified search (documents + articles + templates)
- `create_business_pack_document()` — Business Pack entry point
- `get_companion_knowledge_context()` — Companion search with `retrieve_knowledge_for_ai` integration

## Tables (new)

`organization_documents` · `organization_document_versions` · `organization_document_approvals` · `organization_document_templates` · `organization_document_audit_logs` · `organization_document_notifications`

## Extended (Phase A.5)

`knowledge_articles` — `department_id`, `domain_id`, `business_pack_key`, `tags`, `owner_user_id`, extended statuses

## Permissions

`documents.view` · `documents.manage` · `documents.approve` · `knowledge.view`

## Integration

- **Domain (505A):** `domain_id` on documents and articles
- **Business Packs:** `create_business_pack_document()`
- **Module registry:** `documents` → `/app/documents`, `knowledge_center` → `/app/knowledge`
- **Employee Knowledge (Phase 41):** gaps surfaced in Knowledge Center overview
- **Phase A.5:** article search, versioning, publish workflow preserved

## Final principle

Documents store information. Knowledge stores experience. Companion helps employees find both.

---

Aipify Group AS · Bergen · Norway · For the world.
