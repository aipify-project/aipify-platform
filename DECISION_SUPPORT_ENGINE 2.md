# Decision Support Engine (DSE)

**Phase 38 · Clarity about options — humans decide**

Helps users and businesses think more clearly when facing choices, priorities, and competing demands. Aipify acts as a trusted advisor — never an autonomous decision-maker.

**Prerequisites:** [ATTENTION_GUARDIAN.md](./ATTENTION_GUARDIAN.md) · [GOALS_DREAMS_ENGINE.md](./GOALS_DREAMS_ENGINE.md) · [CONTEXT_ENGINE.md](./CONTEXT_ENGINE.md) · Trust & Action Engine (Phase 30)

**Code:** `lib/decision-support-engine/` · migration `20260612600000_decision_support_phase38.sql`

---

## Vision

From *"Too many decisions competing for my attention"* → *"I have clarity about my options."*

Aipify reduces uncertainty — not responsibility.

---

## Core principles

- Present relevant information and highlight trade-offs
- Recommend based on context; respect user values
- Explain reasoning on every recommendation
- Confidence reflects evidence quality, not certainty
- User retains final authority

---

## Decision types

| Type | Examples |
|------|----------|
| Operational | Support prioritization, workflow, staff allocation |
| Strategic | Business priorities, initiative sequencing |
| Personal | Time management, goal alignment, meeting evaluation |

---

## Database

| Table | Purpose |
|-------|---------|
| `dse_settings` | Recommendations on/off, domains, proactivity, privacy |
| `decision_recommendations` | Pending guidance with reasoning, confidence, risks |
| `decision_history` | User responses (accept, defer, dismiss) |

---

## Customer route

| Route | Purpose |
|-------|---------|
| `/app/assistant/decisions` | Decision dashboard |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/assistant/decisions` | GET (center), PATCH (settings), POST (analyze, respond) |

---

## RPCs

- `ensure_dse_settings` · `update_dse_settings`
- `analyze_decisions` — generates recommendations from action requests, tasks, goals, calendar
- `respond_to_decision` — user records response; never auto-executes
- `get_customer_decisions_center` — dashboard bundle
- `get_platform_decisions_overview` — aggregates only

---

## Chat integration

`detectDecisionIntent()` in `lib/decision-support-engine/detection.ts` handles phrases like:

- *"What should I focus on first?"*
- *"Should I accept this meeting?"*
- *"I don't know where to start."*
- *"Which of these options fits my goals best?"*

Returns explainability + trade-offs + link to Decisions dashboard. No confirmation action — guidance only.

---

## Business integrations

| Source | DSE use |
|--------|---------|
| `action_requests` | Support prioritization, escalation risk |
| `personal_memories` (tasks) | Workload capacity |
| `user_goals` | Goal alignment, stale goal alerts |
| `calendar_events` | Meeting-load decisions |

---

## Platform

`PlatformDecisionPanel` on `/platform/trust` — `get_platform_decisions_overview` (no recommendation content).

---

## i18n

`customerApp.decisionSupport.*` · `platform.decisionSupport.*` (en/no/sv/da)
