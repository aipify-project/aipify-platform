# Document & Output Engine — Phase A.59 (CRITICAL V1)

## Vision

**Document & Output Engine (DOE)** — Customer App engine with Core RPCs in Supabase. If Aipify generates operational value, organizations can save, export, share, automate, and reproduce outputs — metadata and generation requests in the database; format generation via adapter layer (no raw customer PII in audit).

## Core principle

If Aipify generates operational value → save, export, share, automate, reproduce.

## Distinction from other surfaces

| Surface | Route | Purpose |
|---------|-------|---------|
| **Analytics export (A.16)** | `/app/analytics-insights-engine` | KPI trends and insight exports |
| **Executive Insights (A.35)** | `/app/executive-insights-engine` | Executive reporting source data |
| **Document & Output Engine (A.59)** | `/app/document-output-engine` | Unified templates, generation, scheduling, delivery, and workflow hooks |

Nav id `documentOutputEngine` — CRITICAL for V1 operational value capture.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260904000000_document_output_engine_phase_a59.sql` |
| Prefix | `_doe_` |
| decision_type | `document_output_engine` |
| Lib | `lib/aipify/document-output-engine/` |
| Core helpers | `lib/core/document-output.ts` |
| API | `/api/aipify/document-output-engine/*` |
| UI | `/app/document-output-engine` |
| Nav id | `documentOutputEngine` |
| KC FAQ | `content/knowledge/aipify/document-output-engine/faq/document-output-engine-faq.md` |

## Core tables

- `output_templates` — template_name, template_type, output_format, version, status, template_config jsonb
- `output_generations` — report_type, output_format, approval_status, delivery_status, file_metadata jsonb (metadata only)
- `output_schedules` — cadence (daily/weekly/monthly/quarterly/annual), delivery_method, next_run_at, status
- `output_deliveries` — delivery_method, status, delivered_at, metadata jsonb

## Report types

`executive` · `support` · `incident` · `governance` · `security` · `training` · `certification` · `value_realization` · `org_health` · `strategic_alignment` · `benchmarking`

## Output formats (adapter scaffold)

`pdf` · `docx` · `xlsx` · `pptx` · `csv` · `json` · `md` · `txt` · `rtf` · `xml` · `yaml` · `ods` · `odp`

## RPCs

- `get_document_output_engine_dashboard()` — templates, generations, schedules, integration summaries
- `get_document_output_engine_card()` — summary card for home/shell
- `create_output_template`, `update_output_template`, `archive_output_template`
- `generate_document_output(p_template_id, p_report_type, p_format, p_source_context)` — adapter metadata + download URL scaffold
- `schedule_output_delivery`, `record_output_delivery`, `cancel_scheduled_output`
- `list_output_generations`, `export_output_manifest`
- `trigger_workflow_output_hook` — A.42 workflow integration scaffold
- `get_executive_output_summary` — executive visibility scaffold

## Permissions

Permission key audit: no existing `outputs.*` keys in `PERMISSION_KEYS` — **no conflict**.

- `outputs.view`
- `outputs.generate`
- `outputs.export`
- `outputs.schedule`
- `outputs.manage_templates`

## Integration notes

- **A.21 API Platform:** download URL scaffold aligns with API Platform export endpoints
- **A.35 Executive Insights:** `_doe_executive_insights_summary()` — executive report source metadata
- **A.37 Certification:** `_doe_certification_summary()` — certification export context
- **A.42 Workflow Orchestration:** `trigger_workflow_output_hook()` — metadata triggers on generation
- **A.48 Value Realization:** `_doe_value_realization_summary()` — value report source metadata
- **A.51 Incident Response:** `_doe_incident_summary()` — incident report context

## Trust alignment

- Store generation requests and file metadata only — never raw customer PII in audit or file_metadata
- Format adapters return structured payload + download URL metadata
- Scheduled outputs support daily/weekly/monthly/quarterly/annual cadences
- Natural language intent detection scaffold in `lib/aipify/document-output-engine/` (constants for future NLU)
