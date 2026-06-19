# AIPIFY – PHASE 524

**TITLE:** Forms, Data Collection & Digital Workflow Engine  
**PURPOSE:** Universal Forms & Data Collection Engine for APP organizations and Business Packs — digital forms, submissions, approvals, signatures, and workflow automation.  
**Feature owner:** CUSTOMER APP

## Routes

| Route | Purpose |
|-------|---------|
| `/app/forms` | Forms Center (Overview, Forms, Submissions, Templates, Approvals, Automation, Reports) |
| `/app/forms/submissions` | Submissions focus |

## APIs

- `GET /api/app/forms-data-collection` — `get_forms_data_collection_center`
- `POST /api/app/forms-data-collection/action` — `perform_forms_data_collection_action`
- `GET /api/app/forms-data-collection/my` — mobile summary
- `GET /api/assistant/forms-data-collection-context` — Companion context

## Module

- **Key:** `forms`
- **Permissions:** `forms.view`, `forms.manage`

## Tables

`organization_forms_settings` · `organization_form_templates` · `organization_forms` · `organization_form_submissions` · `organization_form_approvals` · `organization_form_signatures` · `organization_form_media` · `organization_form_workflow_triggers` · `organization_forms_audit_logs`

## Field types

text · textarea · number · currency · date · time · dropdown · multi_select · checkbox · radio · file_upload · signature · photo_upload · location · qr_scan · barcode_scan · custom

## System templates

Vacation Request · Expense Claim · Equipment Request · Warehouse/Property/Vehicle Inspection · Incident Report · Contact Form · Customer Satisfaction Survey

## Integrations

Tasks (506) · Trust Actions (30) · Domains (505A) · Business Packs · Procurement (522) · Mobile/offline collection

## Principle

Forms collect information. Workflows create action. Approvals create accountability.

**Aipify Group AS** · Bergen. Norway. For the world.
