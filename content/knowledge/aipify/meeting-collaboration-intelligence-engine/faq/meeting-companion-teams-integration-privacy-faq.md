# Meeting Companion Teams Integration & Privacy Standard FAQ

## Does Aipify join meetings automatically?

No. Aipify asks before joining. User or organization consent rules apply — never auto-join without approval.

## Does Aipify record meetings?

No raw audio or video by default. Aipify captures approved notes and summary metadata only when you consent.

## Can participants see Aipify?

Yes. When approved, Aipify appears as **Aipify Companion** — visible to all participants. Aipify never joins hidden.

## Can I delete meeting notes?

Yes. You can delete or adjust meeting notes per your permissions and organization retention policies.

## Can Aipify create tasks from meetings?

Yes, when approved. Aipify drafts tasks — you review and confirm before creation via Unified Tasks A.62 at `/app/unified-task-follow-up-engine`.

## Can Aipify save meeting knowledge?

Yes, with approval. Save to Knowledge Center (A.5) or Organizational Memory (A.34) when you choose — default is do not save.

## Where does this standard live?

`/app/meeting-collaboration-intelligence-engine` — extends Meeting & Collaboration Intelligence Engine Phase A.61 and Blueprint Phase 72. See [MEETING_COMPANION_TEAMS_INTEGRATION_PRIVACY_STANDARD.md](../../../MEETING_COMPANION_TEAMS_INTEGRATION_PRIVACY_STANDARD.md).

## How does calendar awareness work?

Context Engine at `/app/assistant/calendars` handles calendar OAuth. The meeting engine consumes upcoming meeting awareness as a cross-link only — Aipify never replaces your calendar.
