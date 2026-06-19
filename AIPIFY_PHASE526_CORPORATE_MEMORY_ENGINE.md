# AIPIFY – PHASE 526

**TITLE:** Document, Knowledge & Corporate Memory Engine  
**PURPOSE:** Universal Document & Knowledge Engine — organizational memory layer for all APP organizations and Business Packs.  
**Feature owner:** CUSTOMER APP

## Core principle

Knowledge should survive employee turnover. Documents should not be lost. Information should be searchable.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/knowledge` | Knowledge Center (Overview, Articles, Documents, Policies, Procedures, Playbooks, Templates, Corporate Memory, Search, Reports) |
| `/app/documents` | Document Center (Phase 508 — version control, approvals, templates) |
| `/app/playbooks` | Playbook Center |

## APIs

- `GET /api/app/corporate-memory` — `get_corporate_memory_center`
- `POST /api/app/corporate-memory/action` — `perform_corporate_memory_action`
- `GET /api/app/corporate-memory/my` — mobile summary
- `GET /api/assistant/corporate-memory-context` — Companion knowledge access
- `GET /api/app/knowledge/search` — global search (Phase 508)

## Module

- **Key:** `corporate_memory`
- **Permissions:** `corporate_memory.view`, `corporate_memory.manage`

## Tables (Phase 526)

`organization_corporate_memory_settings` · `organization_knowledge_playbooks` · `organization_corporate_memory_items` · `organization_knowledge_contributions` · `organization_knowledge_search_logs` · `organization_corporate_memory_audit_logs`

## Extends (Phase 508)

`organization_documents` · `organization_document_versions` · `organization_document_approvals` · `organization_document_templates` · `knowledge_articles`

## Knowledge statuses

draft · review · published · update_required · archived

## Corporate memory types

lessons_learned · project_knowledge · customer_knowledge · process_improvement · department_knowledge · best_practice · employee_contribution

## Playbook types

sales · support · warehouse · finance · growth_partner · executive · operations · custom

## Integrations

- **Domains (505A):** knowledge scoped per domain
- **Business Packs:** pack-specific procedures, training, playbooks
- **Employee Knowledge (EKE):** knowledge gaps in reports
- **Companion:** natural language search over approved knowledge

## Principle

Documents store information. Knowledge creates understanding. Experience creates wisdom. Companion helps organizations remember what matters.

**Aipify Group AS** · Bergen. Norway. For the world.
