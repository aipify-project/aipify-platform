# AIPIFY Phase 540 — Universal Knowledge Graph, Relationship Engine & Organizational Memory

**Feature owner:** CUSTOMER APP  
**Module:** `knowledge_graph`  
**Permissions:** `knowledge_graph.view` · `knowledge_graph.manage`

## Purpose

Universal knowledge graph connecting customers, employees, projects, suppliers, documents, Business Packs, domains, approvals, and meetings — the organizational memory layer of Aipify.

**Principle:** Organizations do not suffer from lack of data. Organizations suffer from disconnected data.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/knowledge-graph` | Knowledge Graph Center |
| `/app/memory` | Organizational Memory & Decision History |

## Sections (Knowledge Graph Center)

Overview · Relationships · Entities · Connections · Insights · Dependencies · Timeline · Reports · Companion Intelligence

## Database

Migration: `20261854000000_universal_knowledge_graph_relationship_engine_organizational_memory_phase540.sql`

| Table | Purpose |
|-------|---------|
| `organization_knowledge_graph_settings` | Graph engine settings |
| `organization_knowledge_graph_entities` | Entity engine (customers, employees, projects, etc.) |
| `organization_knowledge_graph_relationships` | Entity A → relationship → Entity B |
| `organization_knowledge_graph_dependencies` | Business, technical, supplier, financial dependencies |
| `organization_knowledge_graph_memory_records` | Organizational memory |
| `organization_knowledge_graph_decisions` | Decision history engine |
| `organization_knowledge_graph_timeline_events` | Knowledge timeline |
| `organization_knowledge_graph_audit_logs` | Audit trail |

## RPCs

- `get_knowledge_graph_operations_center(p_section)`
- `perform_knowledge_graph_operations_action(p_action_type, p_payload)`
- `search_knowledge_graph_entities(p_query, p_limit)`
- `_kgraph540_impact_analysis(p_org_id, p_entity_id, p_action)` via action
- `get_companion_knowledge_graph_context(p_query, p_entity_id)`
- `get_my_knowledge_graph_summary()`

## Code

| Layer | Path |
|-------|------|
| Lib | `lib/knowledge-graph-operations/` |
| Panel | `components/app/knowledge-graph-operations/KnowledgeGraphPanel.tsx` |
| APIs | `/api/app/knowledge-graph-operations/*`, `/api/assistant/knowledge-graph-context` |
| i18n | `customerApp.knowledgeGraphOperations` in en/no/sv/da |
| Nav | `appKnowledgeGraph` · `/app/memory` retains `organizationalMemory` |

## Integrations

- **Phase 537 Search** — Cmd+K via `searchKnowledgeGraphForCommandBar()` + search bar
- **CRM / People / Domains** — entity seed from existing org tables
- **Business Packs** — pack intelligence entities and relationships
- **Companion** — context engine with live graph data and impact analysis

## Acceptance criteria

- Knowledge Graph Center at `/app/knowledge-graph`
- Entity, relationship, dependency, and memory engines
- Decision history and knowledge timeline
- Relationship explorer and impact analysis
- Organizational memory at `/app/memory`
- Companion context, executive dashboard, audit logging, mobile summary

**END OF PHASE 540.**
