# Document & Output Engine FAQ

## FAQ 1

**Question:** What is the Document & Output Engine?

**Answer:** The Document & Output Engine (Phase A.59, CRITICAL V1) captures operational value Aipify generates — save, export, share, automate, and reproduce outputs. It stores metadata and generation requests in the database; format generation uses an adapter layer that returns structured payload and download URL metadata, never raw customer PII in audit logs.

## FAQ 2

**Question:** What output formats are supported?

**Answer:** The adapter scaffold supports PDF, DOCX, XLSX, PPTX, CSV, JSON, Markdown, TXT, RTF, XML, YAML, ODS, and ODP. Generation returns file metadata (mime type, download URL scaffold, size estimate) — not raw document content in the database.

## FAQ 3

**Question:** How do scheduled outputs work?

**Answer:** `schedule_output_delivery()` creates entries in `output_schedules` with cadences: daily, weekly, monthly, quarterly, or annual. Delivery methods include download, email, Knowledge Center publish, executive routing, and workflow attachment. Use `cancel_scheduled_output()` to pause recurring delivery.

## FAQ 4

**Question:** Who can manage templates and generate outputs?

**Answer:** Viewing requires `outputs.view`. Generation requires `outputs.generate`. Manifest export requires `outputs.export`. Scheduling requires `outputs.schedule`. Template management requires `outputs.manage_templates`. All five keys are registered in `PERMISSION_KEYS` with no conflict.

## FAQ 5

**Question:** How does this integrate with other engines?

**Answer:** The engine integrates with API Platform (A.21) for download URL scaffolds, Executive Insights (A.35), Certification (A.37), Workflow Orchestration via `trigger_workflow_output_hook()` (A.42), Value Realization (A.48), and Incident Response (A.51). Report types include executive, support, incident, governance, security, training, certification, value_realization, org_health, strategic_alignment, and benchmarking.
