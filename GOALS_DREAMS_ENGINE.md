# Goals & Dreams Engine (GDE)

**Phase 36 · Support aspirations, not just obligations**

Helps users make consistent progress toward meaningful long-term outcomes — without pressure, guilt, or manipulation.

**Prerequisites:** [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) · [LIFE_OPERATING_SYSTEM.md](./LIFE_OPERATING_SYSTEM.md) · [CONTEXT_ENGINE.md](./CONTEXT_ENGINE.md) · [IDENTITY_ENGINE.md](./IDENTITY_ENGINE.md)

**Code:** `lib/goals-dreams-engine/` · migration `20260612400000_goals_dreams_phase36.sql`

---

## Vision

From *"I need help remembering things"* → *"I need help becoming the person I want to be."*

The user defines success. Aipify helps them move toward it.

---

## Goal categories

| Category | Examples |
|----------|----------|
| Personal development | Exercise, reading, skills, routines |
| Career | Promotion, business, product launch |
| Financial | Savings, debt, emergency fund |
| Family | Quality time, traditions, presence |
| Health | Activity, nutrition, stress management |
| Education | Courses, languages, certifications |
| Lifestyle | Travel, hobbies, volunteering |

---

## Database

| Table | Purpose |
|-------|---------|
| `gde_settings` | Accountability, celebrations, setback support |
| `user_goals` | Goals with category, timeframe, progress |
| `goal_milestones` | Planned · in progress · completed |
| `goal_actions` | Practical next steps |
| `goal_activity` | Check-ins, celebrations, setback support |

---

## Customer route

| Route | Purpose |
|-------|---------|
| `/app/assistant/goals` | Goals dashboard — active/completed goals, milestones, celebrations |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/assistant/goals` | GET, PATCH, POST (actions) |
| `/api/assistant/goals/export` | GET (JSON download) |

---

## Chat integration

Natural language detection via `detectGoalIntent()`:

- *"I want to get healthier"* → clarification questions
- *"I'd love to start my own company"* → goal proposal with milestones
- User confirms before `create_user_goal`

---

## Ethical principles

- Encourage progress — never shame setbacks
- User controls accountability level
- Celebrations stay authentic
- Goals remain private — platform sees aggregates only
- Shared goals (future) require explicit consent

---

## Integration matrix

| Phase | Relationship |
|-------|--------------|
| PAME (31) | Memories inform priorities |
| LifeOS (32) | Schedules time for goals |
| RSI (33) | Family goals respect boundaries |
| Identity (34) | Encouragement adapts to style |
| Context (35) | Finds natural moments for goal work |
| Learning (29) | May improve strategies — user retains control |
