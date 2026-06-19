# AIPIFY – PHASE 533

**TITLE:** Quality, Compliance & Operational Excellence Engine  
**Feature owner:** CUSTOMER APP  
**Coexists with:** Quality Guardian (`/app/quality`) · Governance Engine Phase 515 (`/app/governance`)

## Purpose

Universal Quality & Compliance Engine — standards, audits, compliance, incidents, corrective actions, continuous improvement, and quality scoring.

## Principle

What is not measured cannot be improved. Quality is an organizational responsibility.

Quality creates trust. Compliance creates stability. Improvement creates growth.

## Routes

| Route | Surface |
|-------|---------|
| `/app/quality-operations` | Quality Center |
| `/app/quality-operations/standards` | Standards Management |
| `/app/quality-operations/compliance` | Compliance Center |
| `/app/quality-operations/audits` | Audit Management |
| `/app/quality-operations/incidents` | Incident Management |
| `/app/quality-operations/improvements` | Continuous Improvement |

> **Note:** Quality Guardian (website/software health) remains at `/app/quality`. Operational excellence uses `/app/quality-operations` to avoid route conflicts.

## Database (Phase 533)

**New tables:**
- `organization_quality_operations_settings`
- `organization_quality_operations_standards`
- `organization_quality_operations_compliance_items`
- `organization_quality_operations_audits`
- `organization_quality_operations_audit_findings`
- `organization_quality_operations_incidents`
- `organization_quality_operations_corrective_actions`
- `organization_quality_operations_improvements`
- `organization_quality_operations_audit_logs`

## RPCs

- `get_quality_operations_center` — overview, standards, audits, compliance, incidents, score, companion insights
- `perform_quality_operations_action` — CRUD workflows for all entities
- `_qops533_compute_quality_score` — quality score engine
- `get_companion_quality_operations_context(p_query)`
- `get_my_quality_operations_summary` — mobile-ready

## Integrations

- Knowledge Center (`/app/knowledge`)
- People Engine (`/app/people`)
- Governance Engine (`/app/governance`)

## Module

`quality_operations` · permissions `quality.view` / `quality.manage` (shared with Quality Guardian A.13)

## Migration

`supabase/migrations/20261853300000_quality_compliance_operational_excellence_engine_phase533.sql`

---

Aipify Group AS · Bergen. Norway. For the world.
