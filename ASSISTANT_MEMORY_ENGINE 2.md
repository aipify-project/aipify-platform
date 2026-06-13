# Personal Assistant Memory Engine (PAME)

**Phase 31 · Natural Human Communication Layer**

Transform Aipify from a business platform into a true assistant that supports professional and personal life through natural conversation.

**Prerequisites:** [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) · [LEARNING_ENGINE.md](./LEARNING_ENGINE.md)

**Code:** `lib/assistant-memory/` · migrations `20260611900000_assistant_memory_phase31.sql`, `20260611910000_pame_phase31.sql`

---

## Vision

From *"I need to manage my assistant"* → *"My assistant helps me manage life."*

**PAME supports the user. Learning Engine improves Aipify.** They are separate systems.

---

## Memory types

| Type | Examples |
|------|----------|
| **Important people** | Family birthdays, anniversaries, preferences |
| **Events** | Appointments, travel, celebrations |
| **Tasks** | Call Peter, renew insurance, buy gifts |
| **Habits** | Weekly planning, medication, monthly reviews |
| **Goals** | Save money, learn a language, start a business |

---

## Human Memory Intent Dataset v1.0

See [HUMAN_MEMORY_INTENT_DATASET.md](./HUMAN_MEMORY_INTENT_DATASET.md) — natural language patterns for create_reminder, important_date, follow_up, contact_someone, task_reminder, long_term_memory, health/financial/travel, procrastination_support, daily_assistance, evening_reflection. Implemented in `memory-intent-dataset.ts`.

---

## Engines

| Engine | Purpose |
|--------|---------|
| **Intent detection** | `memory-intent-dataset.ts` + `intent.ts` — understanding, not commands |
| **Clarification** | `clarification.ts` — follow-up questions when incomplete |
| **Reminder** | `memory_notifications` table — single, repeated, escalating, annual |
| **Confidence** | high (explicit) · medium (ask confirm) · low (no auto-store) |

---

## Database

| Table | Purpose |
|-------|---------|
| `personal_memories` | Canonical memory store (metadata only) |
| `important_people` | Structured people + birthdays |
| `memory_notifications` | Scheduled reminders (in-app, push, email, calendar planned) |

**Status:** active · completed · archived · deleted · paused

---

## Customer routes

| Route | Purpose |
|-------|---------|
| `/app/assistant` | Natural conversation |
| `/app/assistant/memory` | Memory dashboard (people, events, tasks, habits, goals) |

---

## Privacy & admin

- Never store raw conversations
- Ask *"Would you like me to remember this?"* when uncertain
- **Administrators cannot access user memory content** — platform sees aggregates only
- User can view, edit, delete, pause, export, disable categories

---

## LifeOS (Phase 32)

PAME remembers; **[LifeOS](./LIFE_OPERATING_SYSTEM.md)** assists — daily briefings, priorities, and `/app/assistant/life`.

---

## Calendar & devices

Google / Apple / Outlook calendar integration planned. Cross-device (desktop, mobile, tablet) via shared Core RPCs. Push/email/SMS notification channels scaffolded in `memory_notifications.notification_type`.

---

## Key RPCs

`get_customer_assistant_center` · `record_assistant_memory` · `update_personal_memory_status` · `export_assistant_memories` · `get_platform_assistant_memory_overview`
