# Strategic Goal Engine (SGE) — Phase 48

Connect daily operations to meaningful business outcomes.

**Spec:** `aipify-core/modules/strategic-goal-engine/phase-48-strategic-goal-engine.txt`  
**Code:** `lib/aipify/strategic-goals/`  
**Dashboard:** `/app/goals`  
**API:** `/api/aipify/goals/*`

---

## Principle

> Goals create direction. Aipify provides awareness. Aipify supports execution. Humans define success.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter / Growth | Upgrade message only |
| Business Pro | Goal creation, dashboard, progress, health, milestones, briefings, pulse integration |
| Enterprise | + Goal hierarchy (`parent_goal_id`), department/org alignment |

Module gate: `strategic_goal_engine` in `lib/core/plans.ts` (business+).

---

## Goal categories

`sales` · `support` · `operations` · `marketing` · `hr` · `custom`

## Statuses (calm wording)

`not_started` · `on_track` · `needs_attention` · `at_risk` · `behind_schedule` · `completed` · `archived`

## Priorities

`critical` · `high` · `standard` · `low`

---

## Database

- `aipify_goals` — tenant strategic goals
- `aipify_goal_milestones` — 25/50/75/100% milestones (auto-created)
- `aipify_goal_activity` — audit trail of goal changes

**RPCs:** `get_customer_strategic_goals_center()`, `create_strategic_goal()`, `update_strategic_goal()`, `archive_strategic_goal()`, `delete_strategic_goal()`, `get_strategic_goal_progress()`, `get_strategic_goals_briefing()`, `refresh_strategic_goals_health()`

Migration: `supabase/migrations/20260613600000_strategic_goal_engine_phase48.sql`

---

## Integrations

- **Business Pulse** — pulse status influences goal health for matching categories
- **Action Center** — recommended actions include “Supports Goal: …” hints
- **Continuous Improvement** — repeated at-risk goals suggest improvements (planned)
- **Adaptive Working Style** — presentation by user profile (planned)

---

## Privacy

- Tenant isolation mandatory
- Goal writes require owner/admin role
- No hidden employee scoring
- Enterprise hierarchy respects `parent_goal_id` only on Enterprise plans
