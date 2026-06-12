# Companion Presence Engine — FAQ

## What is the Companion Presence Indicator?

It is a floating Aipify companion icon in the Customer App that shows system presence — online, working, attention needed, critical alert, disconnected, or quiet mode. It summarizes operational counts, not employee activity.

## Does Aipify monitor employees through the companion?

No. Companion presence reflects Aipify system status and your own operational summaries (tasks, approvals, notifications). It never tracks keystrokes, screens, or colleagues.

## What does "Since last login" show?

A metadata summary from the Admin Assistant engine — new support cases, unresolved approvals, and similar counts since your last session. No raw email or chat content.

## Can I hide or quiet the companion?

Yes. Collapse the indicator or enable quiet mode in the panel or at Settings → Companion presence. Quiet mode suppresses non-critical animations and reduces prompts.

## Who can change organization companion settings?

Users with `companion.manage` (owners and administrators by default) can configure org-wide indicator visibility, heartbeat interval, and which summary sections appear.

## What events are audited?

Only significant changes: critical alert acknowledgements, quiet mode changes, and organization setting updates. Routine heartbeats are not audited.

## How does this relate to Command Center?

Command Center (`/app/command-center`) is the full executive feed. The companion indicator is a lightweight always-available entry point with links to Ask Aipify, approvals, and command center — same Core data, thinner surface.
