# Implementation Blueprint Phase 72 — Meeting Companion & Collaboration Engine FAQ

## What is Phase 72 of the Implementation Blueprint?

Phase 72 extends the Meeting & Collaboration Intelligence Engine (Phase A.61) with Meeting Companion & Collaboration framing — summaries, decision tracking, action accountability, meeting continuity, and collaboration health.

## Where does it live?

`/app/meeting-collaboration-intelligence-engine` — no new route. Blueprint helpers use `_mcbp_*`; engine helpers remain `_mcie_*`.

## How is this different from Global Learning Network repo Phase 72?

Global Learning Network at `/app/global-learning` and `/app/evolution` handles anonymized cross-tenant learning and evolution proposals. ABOS Blueprint Phase 72 is **tenant meeting metadata** for human collaboration — a repo phase number collision, not the same feature.

## How is this different from Multi-Agent Collaboration repo Phase 74?

Multi-Agent Collaboration at `/app/agents` orchestrates AI agents. Phase 72 supports **human meetings** — decisions, action items, and summaries for people, not agent workflows.

## How is this different from Context Engine calendars?

Context Engine at `/app/assistant/calendars` orchestrates calendars — Aipify never replaces them. Phase 72 captures **meeting outcomes** (summaries, decisions, actions) as metadata with calendar cross-link only.

## How does this relate to Unified Task A.62?

Meeting action items in A.61 can cross-link to organization-wide tasks via `create_task_from_source()`. Unified Tasks at `/app/unified-task-follow-up-engine` provides follow-up visibility — do not duplicate task storage.

## What are meeting summaries?

Topics, themes, agreements, and open questions stored in `summary_metadata` — participants leave with clarity. **No raw transcripts** in RPCs.

## What is decision tracking?

Visible decisions logged in `meeting_decisions` — examples include pilot timing, training materials updates, and strategic direction. 🔔🌹 companion patterns for visibility.

## What are companion insights?

🦉 Action concentration awareness · 🌹 Objectives completed recognition · 🔔 Ownership clarification — support not judgment.

## What is meeting continuity?

🦉 Previously discussed topics and 🌹 open commitments from earlier conversations resurface gently before new meetings — optional organizational memory hooks.

## What is collaboration health?

Signals for repeated unresolved topics, unclear ownership, overloaded participants, and missed follow-ups. **Awareness strengthens collaboration** — not surveillance or blame.

## What are the privacy principles?

- Organization controls recording permissions and consent
- Role-based access via `meetings.*` permissions
- Metadata only — no raw transcripts in dashboards
- Configurable retention — trust through transparency

## What are supported platforms?

Microsoft Teams, Google Workspace, Zoom, Slack, Discord — **future scaffold metadata only**. No fake live integrations until explicitly enabled.

## What are the Phase 72 success criteria?

Meeting summaries, decision visibility, action accountability, follow-through, continuity, collaboration health, platform scaffold, privacy/consent, trust connection, and integration distinctions — computed live via `_mcbp_success_criteria()`.

## What is dogfooding?

Aipify Group uses Meeting Companion for leadership meetings, product discussions, Sales Expert sessions, and strategic planning. Unonight is the first external pilot.
