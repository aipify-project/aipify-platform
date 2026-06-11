# Life Operating System (LifeOS)

**Phase 32 · From remembering to assisting**

Phase 31 (PAME) remembers. Phase 32 coordinates daily life — priorities, briefings, conflicts, and routines.

**Prerequisites:** [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) · [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md)

**Code:** `lib/life-os/` · migration `20260612000000_life_os_phase32.sql`

---

## Vision

From *"Remind me about this"* → *"Help me stay on top of everything."*

LifeOS is the layer between intentions and execution. **Suggestions only — the user always decides.**

---

## Engines

| Engine | Purpose |
|--------|---------|
| **Daily briefing** | Morning overview from PAME memories |
| **Evening review** | Completed vs pending; optional move-to-tomorrow prompt |
| **Priority** | critical · important · routine · optional |
| **Smart rescheduling** | Postpone tracking; suggest new time after 3 postponements |
| **Conflict detection** | Overload days, approaching deadlines |
| **Planning assistant** | Week recommendations from memories |
| **Checklists** | Reusable routines (finance, travel, moving, etc.) |

---

## Life areas

`personal` · `family` · `health` · `work` · `finance` · `travel` · `education` · `home`

---

## Database

| Table | Purpose |
|-------|---------|
| `life_os_settings` | Proactivity, personality, life areas, briefing toggles |
| `life_memory_meta` | Priority, life area, postpone count per memory |
| `life_checklists` | Reusable routine templates |
| `life_checklist_items` | Checklist line items |

---

## Customer routes

| Route | Purpose |
|-------|---------|
| `/app/assistant/life` | Life dashboard — today, priorities, family, checklists, settings |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/assistant/life` | GET center · PATCH settings · POST plan_week |
| `/api/assistant/life/postpone` | POST postpone reminder |
| `/api/assistant/life/checklists` | POST create · PATCH toggle item |

---

## User control

- Proactivity level (low / balanced / high)
- Notification frequency (minimal / balanced / frequent)
- Personality (minimal / professional / supportive / highly proactive)
- Life areas to assist with
- Daily briefing & evening review toggles
- Energy-aware suggestions (future-ready)

---

## Privacy

- No hidden decisions
- No pressure — suggestions remain suggestions
- Admins see aggregates only via `get_platform_life_os_overview`

---

## RSI (Phase 33)

Relationship nurturing builds on PAME people data — see **[RELATIONSHIP_SOCIAL_INTELLIGENCE.md](./RELATIONSHIP_SOCIAL_INTELLIGENCE.md)** and `/app/assistant/relationships`.

---

## Key RPCs

`get_customer_life_center` · `update_life_os_settings` · `postpone_life_reminder` · `create_life_checklist` · `toggle_life_checklist_item` · `get_platform_life_os_overview`
