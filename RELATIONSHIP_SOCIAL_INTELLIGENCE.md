# Relationship & Social Intelligence Engine (RSI)

**Phase 33 · Help people stay present and reliable**

RSI helps users nurture relationships — follow-ups, milestones, thoughtful gestures. **Never impersonates the user. Never sends messages automatically.**

**Prerequisites:** [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) · [LIFE_OPERATING_SYSTEM.md](./LIFE_OPERATING_SYSTEM.md)

**Code:** `lib/relationship-intelligence/` · migration `20260612100000_rsi_phase33.sql`

---

## Vision

People forget because life gets busy — not because they don't care. RSI helps users remember who matters.

---

## Capabilities

| Capability | Purpose |
|------------|---------|
| **Important people directory** | Partner, family, friends, colleagues, clients, mentors |
| **Social reminders** | Birthdays, anniversaries, neglected contacts |
| **Relationship timeline** | Per-person events and milestones |
| **Follow-up engine** | Neglected commitments surfaced gently |
| **Gift planning** | Suggestions from preferences — user decides |
| **Conversation tags** | Topics remembered only with explicit approval |

---

## Ethical boundaries

RSI must **never**:

- Pretend to be the user
- Send personal messages automatically
- Manipulate relationships
- Create artificial emotional dependency
- Pressure the user into action

---

## Database

| Table | Purpose |
|-------|---------|
| `relationship_settings` | User control toggles |
| `important_people` (extended) | Directory with gifts, activities, preferences |
| `relationship_notes` | Approved conversation tags |
| `relationship_timeline` | Per-person event history |
| `shared_memory_spaces` | Future scaffold — consent-gated |

---

## Customer route

| Route | Purpose |
|-------|---------|
| `/app/assistant/relationships` | Relationship dashboard |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/assistant/relationships` | GET center · PATCH settings · POST upsert/note |
| `/api/assistant/relationships/export` | GET export |

---

## Natural language

Detected in `lib/relationship-intelligence/detection.ts` and `lib/assistant-memory/conversation.ts`:

- *"My daughter starts school in August"*
- *"Peter loves fishing"*
- *"My wife mentioned wanting a weekend getaway"*

Aipify asks: *"Would you like me to remember this?"*

---

## Privacy

Relationship data is private and belongs exclusively to the user. Shared memories require approval from all parties (future).

---

## Key RPCs

`get_customer_relationship_center` · `upsert_relationship_person` · `record_relationship_note` · `update_relationship_settings` · `export_relationship_data` · `get_platform_relationship_overview`
