# Time & Attention Guardian (TAG)

**Phase 37 · Protect time, energy, and attention**

Helps users focus on what matters most — not do more, but do what matters. Support without pressure or guilt.

**Prerequisites:** [CONTEXT_ENGINE.md](./CONTEXT_ENGINE.md) · [GOALS_DREAMS_ENGINE.md](./GOALS_DREAMS_ENGINE.md) · [IDENTITY_ENGINE.md](./IDENTITY_ENGINE.md)

**Code:** `lib/attention-guardian/` · migration `20260612500000_attention_guardian_phase37.sql`

---

## Vision

From *"Too many things competing for my attention"* → *"Aipify helps me protect time for what matters."*

---

## Attention states

| State | Meaning |
|-------|---------|
| Focused | Active focus session |
| Balanced | Healthy allocation |
| Overloaded | High workload detected |
| Distracted | Meeting overload |
| Recovery needed | Rest recommended |
| Planning required | Intentional planning helpful |

---

## Database

| Table | Purpose |
|-------|---------|
| `tag_settings` | Focus protection, interruptions, quiet hours, privacy |
| `focus_sessions` | Active/historical focus mode |
| `protected_time_blocks` | Intentional protected calendar blocks |
| `tag_activity` | Transparency log |

---

## Customer route

| Route | Purpose |
|-------|---------|
| `/app/assistant/attention` | Time & Attention dashboard |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/assistant/attention` | GET, PATCH, POST (activate/deactivate focus, create block) |
| `/api/assistant/attention/analyze` | POST |
| `/api/assistant/attention/summary` | GET (`?type=daily_focus\|end_of_day`) |

---

## Chat integration

`detectFocusIntent()` — e.g. *"I'm working on Aipify this morning"* → focus mode proposal with user confirmation.

Activating focus mode also sets Context Engine to `focus` mode.

---

## Ethical principles

- Never pressure, guilt, or judge
- User defines success — Aipify supports alignment
- Attention data is private; tracking can be disabled
- Platform sees aggregates only

---

## Integration matrix

| Phase | Relationship |
|-------|--------------|
| Context (35) | Calendar intelligence, focus mode sync |
| Goals (36) | Goal alignment insights |
| LifeOS (32) | Quiet hours, life balance |
| Identity (34) | Encouragement style |
| UCL (35) | Meeting overload detection |
