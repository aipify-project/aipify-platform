# Context Engine & Universal Calendar Layer (ACE + UCL)

**Phase 35 · The intelligence layer above the calendars people already trust**

Aipify orchestrates calendars — it does not replace them. Users connect what they use; Aipify understands context and coordinates scheduling.

**Prerequisites:** [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) · [LIFE_OPERATING_SYSTEM.md](./LIFE_OPERATING_SYSTEM.md) · [IDENTITY_ENGINE.md](./IDENTITY_ENGINE.md)

**Code:** `lib/context-engine/` · migration `20260612300000_context_calendar_phase35.sql`

---

## Vision

From *"I have several different calendars to manage"* → *"I simply tell Aipify what matters, and it handles the rest."*

---

## Universal Calendar Layer (UCL)

| Provider | Integration (scaffold) |
|----------|------------------------|
| Aipify Internal | Built-in — always available |
| Apple, Google, Outlook, Microsoft 365 | OAuth APIs (pending authorization) |
| Samsung, Yahoo, Fastmail, Nextcloud, Exchange, CalDAV | CalDAV / provider-specific |

Multi-calendar support with classification: work · personal · family · travel · health · education · custom.

---

## Context Engine (ACE)

Context sources: Learning Engine · PAME · LifeOS · RSI · Identity · UCL · tasks.

| Mode | Behavior |
|------|----------|
| Work | Professional priorities, fewer personal interruptions |
| Personal | Life planning and personal reminders |
| Family | Shared responsibilities and family events |
| Vacation | Suppress work recommendations |
| Focus | Minimize interruptions |
| Recovery | Reduce pressure, delay non-essential notifications |
| Planning | Weekly reviews and future scheduling |

---

## Database

| Table | Purpose |
|-------|---------|
| `context_settings` | Context mode, proactive level, privacy, planning prefs |
| `calendar_connections` | Multi-provider connections with purpose |
| `calendar_events` | Internal Aipify calendar + coordinated events |
| `calendar_sync_log` | Sync transparency history |

---

## Customer routes

| Route | Purpose |
|-------|---------|
| `/app/assistant/context` | Context dashboard — briefing, conflicts, workload, settings |
| `/app/assistant/calendars` | Calendar dashboard — providers, sync, permissions |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/assistant/context` | GET, PATCH |
| `/api/assistant/context/analyze` | POST |
| `/api/assistant/context/summary` | GET (`?type=daily_briefing\|evening_review`) |
| `/api/assistant/calendars` | GET |
| `/api/assistant/calendars/connect` | POST |
| `/api/assistant/calendars/disconnect` | DELETE |
| `/api/assistant/calendars/events` | GET, POST, PATCH |

---

## RPCs

- `get_customer_context_center` · `get_customer_calendar_center`
- `analyze_user_context` · `get_context_summary`
- `connect_calendar` · `disconnect_calendar` · `update_calendar_connection`
- `create_calendar_event` · `update_calendar_event` · `get_calendar_events`
- `update_context_settings`
- `get_platform_context_overview`

---

## Chat integration

Natural language scheduling via `detectSchedulingIntent()` in `lib/context-engine/scheduling.ts`.

Examples:
- *"Remember my wife's birthday on April 3rd"* → calendar proposal
- *"Schedule a follow-up with Peter next week"* → availability suggestion
- *"Remind me to buy flowers"* → reminder on personal calendar

User confirms before events are created (`confirmEvent` in `/api/assistant`).

---

## Privacy

- Users own calendar data
- External access requires explicit permission
- Disconnect anytime
- Platform sees aggregates only via `get_platform_context_overview`

---

## Ethical principles

- Never replace established tools — orchestrate them
- Suggestions only — user always decides
- Transparency on sync and permissions
- Cognitive load and conflict detection are assistive, not prescriptive
