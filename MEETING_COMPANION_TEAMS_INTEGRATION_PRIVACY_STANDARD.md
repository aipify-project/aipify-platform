# Meeting Companion Teams Integration & Privacy Standard

**Feature owner:** Customer App — extends Meeting & Collaboration Intelligence Engine Phase A.61 and Implementation Blueprint Phase 72 at `/app/meeting-collaboration-intelligence-engine`.

**Not** a numbered ABOS blueprint phase. This is a privacy and integration standard that documents intended Microsoft Teams behavior, consent flows, and save preferences — metadata and policy scaffolding only. No live Teams OAuth, Microsoft Graph API, or raw audio/video storage.

## Core idea

Calendar connection (via Context Engine at `/app/assistant/calendars`) detects upcoming meetings. Before a meeting, Aipify asks:

> Your Teams meeting starts soon. Would you like me to join and help?

**Options:** join + notes · join + action items · join + summary · do not join · never join this type.

## Join experience

When approved, Aipify appears as **Aipify Companion** — visible to all participants. Aipify never secretly listens or joins without consent.

## What Aipify CAN do (when approved)

- Take notes
- Summarize topics
- Identify decisions, action items, and follow-ups
- Prepare post-meeting summary
- Draft tasks (cross-link Unified Tasks A.62)
- Suggest reminders

## What Aipify MUST NOT do

- Join without approval
- Secretly record
- Store raw audio/video by default
- Save content without approval
- Send summaries without review when required
- Access private meetings without permission

## Privacy standard

No audio/video by default. Only keep notes, summaries, decisions, and actions when explicitly approved.

**User save choices:** do not save · private notes only · meeting summary · decisions + actions · Knowledge Center (A.5) · Organizational Memory (A.34).

**Default:** privacy-safe — do not save until the user chooses.

## Post-meeting flow

Ask: *Would you like me to save or send this meeting summary?*

**Options:** save privately · send to participants · save to Knowledge Center · create tasks · delete everything · edit first.

## Distinctions

| Concern | Owner |
|--------|--------|
| Meeting lifecycle, summaries, decisions | Meeting & Collaboration Intelligence A.61 + Blueprint Phase 72 |
| Calendar OAuth and meeting awareness | Context Engine — MCIE consumes cross-link only |
| Draft task creation | Unified Tasks A.62 |
| Approved knowledge destinations | Knowledge Center A.5 · Organizational Memory A.34 |
| Raw audio/video | Prohibited by default — Trust Architecture alignment |

Platform scaffolds document intended Teams behavior. Do not implement Microsoft Graph API in this standard.

## ABOS principle

Preserve what matters without violating trust — privacy first, consent always, value when approved.

## Vision

Trusted meeting companion — helps when invited, explains clearly, respects privacy.

## Implementation

| Artifact | Path |
|----------|------|
| Migration | `supabase/migrations/20261027000000_meeting_companion_teams_integration_privacy_standard.sql` |
| Helpers | `_mctips_*` (Meeting Companion Teams Integration Privacy Standard) |
| Types / parse | `lib/aipify/meeting-collaboration-intelligence-engine/` |
| UI | `components/app/meeting-collaboration-intelligence-engine/` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/meeting-companion-teams-integration-privacy-standard.txt` |
| ILM vocabulary | `lib/internal-language-model/meeting-companion-teams-privacy-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/meeting-collaboration-intelligence-engine/faq/meeting-companion-teams-integration-privacy-faq.md` |
