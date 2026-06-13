# Records & Retention Management Engine — Phase A.60

## Vision

**Records & Retention Management Engine (RRME)** — Customer App engine with Core RPCs in Supabase. Govern retention policies, archive operational records with metadata-only storage, manage disposal approvals, and surface compliance snapshots — extending Security & Trust (A.18), Compliance (A.29), Organizational Memory (A.34), and Document & Output (A.59).

## Core principle

If Aipify stores operational metadata → organizations define retention, archive with trust, and dispose with human approval.

## Distinction from other surfaces

| Surface | Route | Purpose |
|---------|-------|---------|
| **Security & Trust (A.18)** | `/app/settings/security` | Access transparency and trust policies |
| **Compliance (A.29)** | `/app/compliance-regulatory-readiness-engine` | Regulatory readiness and control mapping |
| **Organizational Memory (A.34)** | `/app/organizational-memory-engine` | Decision register and memory capture hooks |
| **Document & Output (A.59)** | `/app/document-output-engine` | Template generation and delivery metadata |
| **Records & Retention (A.60)** | `/app/records-retention-management-engine` | Retention policies, archival lifecycle, disposal workflow |

Nav id `recordsRetentionManagementEngine` — governance for record lifecycle.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260905000000_records_retention_management_engine_phase_a60.sql` |
| Prefix | `_rrme_` |
| decision_type | `records_retention_management_engine` |
| Lib | `lib/aipify/records-retention-management-engine/` |
| Core helpers | `lib/core/records-retention-management.ts` |
| API | `/api/aipify/records-retention-management-engine/*` |
| UI | `/app/records-retention-management-engine` |
| Nav id | `recordsRetentionManagementEngine` |
| KC FAQ | `content/knowledge/aipify/records-retention-management-engine/faq/records-retention-management-engine-faq.md` |

## Core tables

- `retention_policies` — policy_name, record_category, retention_period, archive_required, disposal_method, status
- `archived_records` — source_entity link, version, metadata jsonb (no raw document content)
- `record_disposal_requests` — approval workflow with disposal_log metadata
- `retention_compliance_snapshots` — upcoming_expirations and compliance_indicators per organization

## Record categories

`executive_report` · `support_report` · `incident_report` · `certificate` · `governance_document` · `audit_log` · `knowledge_export` · `workflow_output`

## RPCs

- `get_records_retention_management_engine_dashboard()` — policies, archived records, disposal queue, integration summaries
- `get_records_retention_management_engine_card()` — summary card for home/shell
- `create_retention_policy`, `update_retention_policy`, `retire_retention_policy`
- `archive_record`, `search_archived_records`, `restore_archived_record`
- `request_record_disposal`, `approve_record_disposal`, `complete_record_disposal`
- `get_upcoming_expirations`, `get_retention_compliance_summary`

## Permissions

Permission key audit: no existing `records.*` keys in `PERMISSION_KEYS` — **no conflict**.

- `records.view`
- `records.manage`
- `records.archive`
- `records.dispose`

All four keys registered in `PERMISSION_KEYS`.

## Integration notes

- **A.18 Security & Trust:** `_rrme_security_trust_summary()` — trust policy alignment metadata
- **A.29 Compliance:** `_rrme_compliance_summary()` — regulatory readiness indicators
- **A.34 Organizational Memory:** `_rrme_capture_memory_hook()` — metadata-only retention learnings
- **A.59 Document & Output:** `_rrme_document_output_summary()` — `output_generations` as archivable source

## Trust alignment

- Store metadata only in `archived_records.metadata` — never raw document content
- Disposal requires explicit approval (`records.dispose`) and audit via `_rrme_log()`
- Compliance snapshots aggregate expiration metadata — no PII

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Aipify prepares retention governance; humans approve disposal.
