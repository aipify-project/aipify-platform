# Meeting & Collaboration Intelligence Engine — Phase A.61

## Vision

**Meeting & Collaboration Intelligence Engine (MCIE)** — Customer App engine with Core RPCs in Supabase. Structured meeting lifecycle: agenda preparation, summary capture, decision logging, action assignment, output generation, and workflow hooks — metadata only; humans approve execution.

## Core principle

Meetings produce operational accountability — agendas, summaries, decisions, and actions are captured as metadata; workflows and outputs require human approval before execution.

## Distinction from other surfaces

| Surface | Route | Purpose |
|---------|-------|---------|
| **Operations Center (A.32)** | `/app/operations-center-foundation-engine` | Operational event coordination |
| **Stakeholder Communication (A.53)** | `/app/stakeholder-communication-engine` | Outbound stakeholder campaigns |
| **Document & Output (A.59)** | `/app/document-output-engine` | Template-based document generation |
| **Meeting & Collaboration Intelligence (A.61)** | `/app/meeting-collaboration-intelligence-engine` | Meeting lifecycle, actions, decisions, outputs |

Nav id `meetingCollaborationIntelligenceEngine`.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260906000000_meeting_collaboration_intelligence_engine_phase_a61.sql` |
| Prefix | `_mcie_` |
| decision_type | `meeting_collaboration_intelligence_engine` |
| Lib | `lib/aipify/meeting-collaboration-intelligence-engine/` |
| Core helpers | `lib/core/meeting-collaboration-intelligence.ts` |
| API | `/api/aipify/meeting-collaboration-intelligence-engine/*` |
| UI | `/app/meeting-collaboration-intelligence-engine` |
| Nav id | `meetingCollaborationIntelligenceEngine` |
| KC FAQ | `content/knowledge/aipify/meeting-collaboration-intelligence-engine/faq/meeting-collaboration-intelligence-engine-faq.md` |

## Core tables

- `collaboration_meetings` — meeting_title, meeting_type, organizer, schedule, status, agenda, summary metadata
- `meeting_action_items` — assigned user, description, due_date, status
- `meeting_decisions` — decision_text, metadata
- `meeting_output_links` — links to A.59 `output_generations`

## Meeting types

`executive` · `department` · `incident_review` · `customer_success` · `strategy` · `project`

## RPCs

- `get_meeting_collaboration_intelligence_engine_dashboard()` — meetings, actions, decisions, integration summaries
- `get_meeting_collaboration_intelligence_engine_card()` — summary card for home/shell
- `create_collaboration_meeting`, `update_meeting_status`, `cancel_meeting`
- `generate_meeting_agenda`, `capture_meeting_summary`, `extract_action_items`
- `assign_meeting_action`, `update_action_item_status`, `mark_action_overdue`
- `capture_meeting_decision`, `generate_meeting_outputs` — A.59 hook
- `trigger_meeting_workflow_hook` — A.42 scaffold (metadata triggers, not auto-execute)
- `get_executive_meeting_summary`, `export_meeting_collaboration_manifest`
- Org memory hooks via `_mcie_capture_memory_hook`

## Permissions

Permission key audit: no existing `meetings.*` keys in `PERMISSION_KEYS` — **no conflict**.

- `meetings.view`
- `meetings.manage`
- `meetings.export`
- `meetings.assign_actions`

## Integration notes

- **A.32 Operations Center:** `_mcie_operations_center_summary()` — operational event context
- **A.42 Workflow Orchestration:** `trigger_meeting_workflow_hook()` — metadata workflow triggers per meeting type
- **A.53 Stakeholder Communication:** `_mcie_stakeholder_communication_summary()` — follow-up communication context
- **A.59 Document & Output:** `generate_meeting_outputs()` — links `output_generations` via `meeting_output_links`
- **A.34 Organizational Memory:** `_mcie_capture_memory_hook()` — optional decision/summary memory capture

## Trust alignment

- Store meeting metadata, agenda structure, and action/decision summaries only — no raw transcripts or PII
- Workflow hooks return trigger metadata — execution requires human approval via Workflow Orchestration
- Output generation delegates to Document & Output Engine adapters — metadata-only file references
