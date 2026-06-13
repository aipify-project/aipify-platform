# Identity Engine (AIE)

**Phase 34 · An assistant designed specifically for you**

Shapes how Aipify communicates with each user — familiarity and consistency without fake personality or manipulation.

**Prerequisites:** [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) · [LIFE_OPERATING_SYSTEM.md](./LIFE_OPERATING_SYSTEM.md) · [RELATIONSHIP_SOCIAL_INTELLIGENCE.md](./RELATIONSHIP_SOCIAL_INTELLIGENCE.md)

**Code:** `lib/identity-engine/` · migration `20260612200000_identity_engine_phase34.sql`

---

## Vision

From *"I use an AI assistant"* → *"Aipify understands how I prefer to work and communicate."*

The user never adapts to Aipify. Aipify adapts to the user.

---

## Identity dimensions

| Dimension | Options |
|-----------|---------|
| Communication style | minimal · professional · friendly · conversational · supportive · … |
| Proactivity | passive · reactive · balanced · proactive · highly_proactive |
| Tone | direct · encouraging · calm · energetic · neutral · supportive |
| Name usage | always · occasional · avoid · professional_title |
| Identity modes | minimal · professional · supportive · companion · custom |

---

## Observation & approval

Patterns surface as **suggestions** — never silent profile changes.

*"I've noticed you prefer shorter updates. Would you like me to adjust my communication style?"*

User: Yes · No · Ask me later

---

## Database

| Table | Purpose |
|-------|---------|
| `identity_profiles` | Per-user communication identity |
| `interaction_observations` | Pattern suggestions awaiting approval |

---

## Customer route

| Route | Purpose |
|-------|---------|
| `/app/assistant/identity` | Identity dashboard — style, proactivity, notifications, observations |

---

## Integration

| System | Relationship |
|--------|--------------|
| PAME (31) | Memory separate from identity |
| LifeOS (32) | Respects proactivity settings |
| RSI (33) | Respects boundaries |
| Learning Engine (29) | May enhance recommendations — user retains control |

Assistant replies adapted via `adaptReplyToIdentity()` in `/api/assistant`.

---

## Ethical boundaries

- Never manipulate emotions
- Never encourage dependency
- No guilt or pressure
- Transparency mandatory — explainability always available
- Opt-out always exists

---

## Key RPCs

`get_customer_identity_center` · `update_identity_profile` · `respond_to_identity_observation` · `get_platform_identity_overview`
