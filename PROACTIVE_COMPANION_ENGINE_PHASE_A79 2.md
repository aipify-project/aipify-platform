# Proactive Companion Engine — Phase A.79

**Feature owner:** Customer App

Organizational ABOS engine for timely proactive assistance categories, org/user preferences, and companion communication style.

## Distinctions

- **A.67 Companion Presence** — floating orb, heartbeat, online states at `/app/settings/companion-presence`. Do not replace.
- **ILM proactive guidance** — `lib/internal-language-model/proactive-guidance.ts` assistant language patterns. Integrate via corpus; do not duplicate detection.
- **A.79 Proactive Companion** — this engine: categories, nudges, preferences, boundaries.

## Route

`/app/proactive-companion-engine` — nav id `proactiveCompanionEngine`

## Tables

- `organization_proactive_companion_settings` — org defaults, enabled categories jsonb
- `organization_proactive_nudges` — category, summary (max 500), suggested_action, priority, status
- `organization_proactive_companion_user_preferences` — frequency, channels, quiet_hours, style, categories
- `organization_proactive_companion_audit_logs` — metadata-only audit

## Assistance categories

`operational` · `support` · `knowledge` · `executive` · `team_awareness`

## Permissions

`proactive_companion.view` · `proactive_companion.manage` · `proactive_companion.nudges.dismiss` · `proactive_companion.preferences.manage`

## RPCs

Dashboard, card, list nudges, dismiss/snooze nudge, save org settings, save user preferences, export.

## Integrations

Command Center (A.26) · Companion Presence (A.67) · Notification Engine (A.12) · Quality Guardian (A.13) · ILM proactive guidance corpus.

ABOS **Assistance** pillar. Metadata only. Self Love (A.76 planned) monitors fatigue.
