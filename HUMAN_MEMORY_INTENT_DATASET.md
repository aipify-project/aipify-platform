# Human Memory Intent Dataset v1.0

Natural language examples for memory, reminders, and personal assistance.

**Purpose:** Teach Aipify **understanding** — not commands.

**Code:** `lib/assistant-memory/memory-intent-dataset.ts`

---

## Philosophy

People should never learn how to speak to Aipify. Aipify learns how people speak.

The greatest compliment is not *"That's an impressive AI"* — it's *"Thanks, Aipify. I would have forgotten that."*

---

## Intent categories

| Intent | Natural examples |
|--------|------------------|
| `create_reminder` | *Remember this for me*, *Don't let me forget*, *This matters* |
| `important_date` | *My wife has a birthday on April 3rd*, *Our anniversary is coming up* |
| `follow_up` | *Check in with me next week*, *Keep me accountable* |
| `contact_someone` | *Remind me to call Peter*, *I promised John I'd get back to him* |
| `task_reminder` | *Renew my passport*, *Don't let this slip through the cracks* |
| `long_term_memory` | *My wife loves tulips*, *I work best in the mornings* |
| `health_reminder` | *Remind me to take my medication*, *Book dental cleaning* |
| `financial_reminder` | *Pay the electricity bill*, *Review finances this month* |
| `travel_planning` | *Book flights*, *Packing checklist*, *Travel insurance* |
| `procrastination_support` | *I know I'll put this off*, *Keep nudging me* |
| `daily_assistance` | *What should I focus on today?*, *Help me prioritize* |
| `evening_reflection` | *What still needs my attention?*, *Help me plan tomorrow* |

---

## Permission responses

When uncertain, Aipify asks — never assumes:

- *Would you like me to remember this?*
- *Should I save this for you?*
- *Would you like me to follow up on this?*
- *When should I remind you?*

---

## Integration

| Layer | Usage |
|-------|-------|
| `detectMemoryIntent()` | Primary intent classification |
| `detectAssistantIntent()` | Legacy mapping for APIs |
| `buildAssistantTurn()` | Conversation + PAME category inference |
| `confidenceFromIntent()` | High / medium / low from phrasing |

---

## Related

- [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) — PAME
- [LIFE_OPERATING_SYSTEM.md](./LIFE_OPERATING_SYSTEM.md) — daily/evening assistance
- [RELATIONSHIP_SOCIAL_INTELLIGENCE.md](./RELATIONSHIP_SOCIAL_INTELLIGENCE.md) — people & relationships
