# Meeting & Collaboration Intelligence Engine FAQ

## FAQ 1

**Question:** What is the Meeting & Collaboration Intelligence Engine?

**Answer:** The Meeting & Collaboration Intelligence Engine structures meeting lifecycle metadata — agendas, summaries, decisions, and action items. It integrates with Operations Center (A.32), Workflow Orchestration (A.42), Stakeholder Communication (A.53), and Document & Output (A.59). Aipify prepares accountability; humans approve actions and workflow execution.

## FAQ 2

**Question:** How is this different from calendar scheduling or Stakeholder Communication?

**Answer:** The Context Engine handles calendar orchestration — not meeting accountability. Stakeholder Communication (A.53) coordinates outbound campaigns. This engine (nav id `meetingCollaborationIntelligenceEngine`, route `/app/meeting-collaboration-intelligence-engine`) captures meeting outcomes, decisions, and follow-up actions as metadata.

## FAQ 3

**Question:** How do workflow hooks and outputs work?

**Answer:** `trigger_meeting_workflow_hook()` returns metadata triggers per meeting type — it does not auto-execute workflows without human approval. `generate_meeting_outputs()` links Document & Output Engine generations via `meeting_output_links`. Workflow examples are illustrative scaffolds, not silent automation.

## FAQ 4

**Question:** Who can manage meetings and assign actions?

**Answer:** Viewing requires `meetings.view`. Creating meetings, capturing summaries, and logging decisions requires `meetings.manage`. Export requires `meetings.export`. Assigning and updating action items requires `meetings.assign_actions`. All four keys are registered in `PERMISSION_KEYS`.
