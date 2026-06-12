# Implementation Blueprint — Phase 72: Meeting Companion & Collaboration Engine

**Feature owner:** Customer App  
**Implementation:** [Meeting & Collaboration Intelligence Engine — Phase A.61](./MEETING_COLLABORATION_INTELLIGENCE_ENGINE_PHASE_A61.md)

This document defines **Phase 72 — Meeting Companion & Collaboration Engine** of the Aipify Business Operating System (ABOS). It extends the Meeting & Collaboration Intelligence Engine with companion framing for summaries, decisions, action accountability, meeting continuity, and collaboration health.

> **Mapping:** ABOS Implementation Blueprint Phase 72 maps to **Meeting & Collaboration Intelligence Engine Phase A.61** at `/app/meeting-collaboration-intelligence-engine`. Do not create a new route — extend A.61 RPCs, dashboard, and ILM vocabulary only. Blueprint helpers use `_mcbp_*`; engine helpers remain `_mcie_*`.

## Critical distinctions

| Surface | Route | Relationship |
|---------|-------|--------------|
| **This blueprint (ABOS Phase 72)** | `/app/meeting-collaboration-intelligence-engine` | Extends A.61 |
| Global Learning Network (repo Phase 72) | `/app/global-learning`, `/app/evolution` | Distinct — cross-tenant learning |
| Multi-Agent Collaboration (repo Phase 74) | `/app/agents` | Distinct — agent orchestration |
| Context Engine / Universal Calendar | `/app/assistant/calendars` | Calendar cross-link only |
| Unified Task & Follow-Up (A.62) | `/app/unified-task-follow-up-engine` | Action items via `create_task_from_source` |
| Stakeholder Communication (A.53) | `/app/stakeholder-communication-engine` | Follow-up campaigns — distinct |
| Document & Output (A.59) | `/app/document-output-engine` | Meeting outputs — distinct |

## Mission

Capture decisions, commitments, and insights from meetings; strengthen collaboration and accountability.

## Core philosophy

**Meeting value = shared understanding + clear next steps** — better meetings, not more meetings.

## ABOS principle

Meetings create shared understanding leading to meaningful action — not conversation alone. Aipify informs and prepares; humans decide.

## Objectives

| Objective | Description |
|-----------|-------------|
| **Meeting summaries** | Topics, themes, agreements, open questions — participants leave with clarity |
| **Decision tracking** | Visible decisions — pilot timing, training updates, strategic choices |
| **Action item creation** | Named owners (individual/team) — cross-link Unified Tasks A.62 |
| **Follow-up reminders** | Gentle reminders for open commitments |
| **Meeting continuity** | Previously discussed topics and open commitments from earlier conversations |
| **Collaboration improvement** | Awareness of unresolved topics, ownership, and follow-through |

## Supported platforms (future scaffold)

Microsoft Teams/Outlook/365 · Google Meet/Calendar/Workspace · Zoom · Slack · Discord — **metadata scaffold only**, no fake live integrations.

## Meeting summaries

Topics · themes · agreements · open questions — metadata in `summary_metadata`, no raw transcripts.

## Decision tracking (🔔 🌹)

Visible decision register with examples: pilot timing, training materials update, budget direction.

## Action items

Named owners with accountability — `meeting_action_items` cross-links to Unified Tasks via `create_task_from_source()`.

## Meeting continuity (🦉 🌹)

Previously discussed topics, open commitments from earlier conversations — optional organizational memory hooks.

## Companion insights (🦉 🌹 🔔)

- Action concentration awareness
- Objectives completed recognition
- Ownership clarification prompts

Support not judgment — never punitive interpretation.

## Collaboration health

Repeated unresolved topics · unclear ownership · overloaded participants · missed follow-ups — awareness strengthens collaboration.

## Self Love connection

Focus · healthy pacing · progress recognition · appreciation — *"Several meaningful outcomes emerged from today's discussions."*

## Privacy principles

Organization controls recording permissions, consent, access boundaries, and retention — trust through transparency.

## Trust connection

How summaries are generated · contributing information · configurable settings · human approval for workflows and outputs.

## Dogfooding

**Aipify Group** — leadership meetings, product discussions, Sales Expert sessions, strategic planning.  
**Unonight** — first external pilot for operational meeting accountability.

## Success criteria

Improved follow-through · decision visibility · reduced admin burden · stronger collaboration · perceived meeting value — computed live via `_mcbp_success_criteria()`.

## Vision

Clarity, connection, progress — *"Our meetings have become significantly more effective."*

## Technical mapping

| Artifact | Path |
|----------|------|
| Migration | `supabase/migrations/20261022000000_implementation_blueprint_phase72_meeting_companion_collaboration.sql` |
| Helpers | `_mcbp_*` |
| Dashboard RPC | `get_meeting_collaboration_intelligence_engine_dashboard()` |
| Card RPC | `get_meeting_collaboration_intelligence_engine_card()` |
| Types/parse | `lib/aipify/meeting-collaboration-intelligence-engine/` |
| UI | `components/app/meeting-collaboration-intelligence-engine/` |
| ILM | `lib/internal-language-model/implementation-blueprint-phase72-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/meeting-collaboration-intelligence-engine/faq/implementation-blueprint-phase72-faq.md` |
