# AIPIFY – PHASE 552

**TITLE:** Aipify Knowledge Network, Collective Learning & Organizational Wisdom Engine  
**PURPOSE:** Wisdom layer transforming knowledge, experience, decisions, procedures, and lessons learned into reusable organizational intelligence.

## Feature owner

**CUSTOMER APP** — `/app/knowledge-network`

## Routes

| Route | Purpose |
|-------|---------|
| `/app/knowledge-network` | Knowledge Network Center hub |
| `/app/knowledge-network/lessons` | Lessons Learned Engine |
| `/app/knowledge-network/experience` | Experience Library |

## RPCs

- `get_organization_knowledge_network_center(p_section)`
- `perform_organization_knowledge_network_action(p_action_type, p_payload)`
- `get_organization_knowledge_network_mobile_summary()`
- `get_companion_knowledge_network_advisor_context(p_query)`

Integrates Phase 540 Knowledge Graph decision history.

## Tables

`organization_knowledge_network_settings` · `organization_knowledge_network_assets` · `organization_knowledge_network_lessons` · `organization_knowledge_network_experience` · `organization_knowledge_network_playbooks` · `organization_knowledge_network_best_practices` · `organization_knowledge_network_decisions` · `organization_knowledge_network_wisdom_scores` · `organization_knowledge_network_retention_queue` · `organization_knowledge_network_meeting_intel` · `organization_knowledge_network_companion_signals` · `organization_knowledge_network_department_centers` · `organization_knowledge_network_business_pack_contributions` · `organization_knowledge_network_recommendations` · `organization_knowledge_network_audit_logs`

## APIs

- `GET /api/app/knowledge-network-operations`
- `POST /api/app/knowledge-network-operations/action`
- `GET /api/app/knowledge-network-operations/mobile`
- `GET /api/assistant/knowledge-network-advisor-context`

**END OF PHASE.**
