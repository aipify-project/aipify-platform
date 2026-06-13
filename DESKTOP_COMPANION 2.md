# Desktop Companion (Phase 61)

Aipify Desktop Companion is a calm, intelligent assistant for administrators and business owners. It delivers smart notifications, reminders, mini-chat, and briefing integration without overwhelming users.

## Philosophy

- Aipify sees.
- Aipify remembers.
- Aipify warns.
- Aipify explains.
- Aipify recommends.

## Customer App routes

| Route | Purpose |
|-------|---------|
| `/app/desktop` | Desktop Companion center |
| `/app/desktop/settings` | Preferences and category filters |
| `/app/desktop/history` | Notification history |
| `/app/desktop/reminders` | Reminder management |
| `/app/desktop/modes` | Silent, Balanced, Active Assistant, Focus |

## Database tables

- `desktop_modes` — mode definitions
- `desktop_preferences` — per-user settings
- `desktop_notification_events` — collected source events
- `desktop_notifications` — delivered notifications
- `desktop_reminders` — one-time and recurring reminders
- `desktop_chat_history` — mini-chat transcript

## API (`/api/aipify/desktop/*`)

- `GET card` — dashboard companion card
- `GET notifications`, `POST notifications/collect`
- `POST notifications/[id]/action`, `GET notifications/[id]/explain`
- `GET history`
- `GET/POST reminders`, `PATCH/DELETE reminders/[id]`
- `GET/POST chat`
- `GET/PATCH preferences`
- `GET modes`

## Modes

| Mode | Behavior |
|------|----------|
| Silent | Critical alerts only |
| Balanced | Critical + important + daily briefing + reminders |
| Active Assistant | Full notifications, mini-chat, suggestions, reminders |
| Focus | User-selected categories + mini-chat |

## Integrations

- **Briefing (Phase 60)** — `get_briefing_card()` embedded in companion card
- **Quality Guardian** — quality incidents collected into notification events
- **Governance** — pending approvals surfaced with action links
- **Knowledge Center** — knowledge gaps and FAQ at `content/knowledge/aipify/desktop/faq/`
- **Unonight pilot** — preset events for verifications, support drafts, marketplace approvals

## Library

`lib/aipify/desktop/` — types, parsers, chat intent resolver, collectors, jobs.

## Security

- Respects user permissions and tenant boundaries
- Audit logging via `_tacc_log_audit`
- Quiet hours and opt-out supported in preferences
- No cross-tenant data exposure

## Knowledge Center

Import seed content:

```bash
POST /api/aipify/knowledge/import-seed-content
{ "overwrite": true }
```

Category slug: `desktop-companion`
