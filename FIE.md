# Friction Intelligence Engine (FIE) — Phase 49

Opportunity discovery — identify recurring inefficiencies and simplify work.

**Spec:** `aipify-core/modules/friction-intelligence-engine/phase-49-friction-intelligence-engine.txt`  
**Code:** `lib/aipify/friction-intelligence/`  
**Dashboard:** `/app/friction`  
**Executive report:** `/app/friction/executive-report` (Enterprise)  
**API:** `/api/aipify/friction/*`

---

## Principle

> Aipify identifies friction. Aipify explains impact. Aipify suggests improvements. Humans decide what changes.

Not failure detection. Not blame. Improvement-oriented visibility.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter / Growth | Upgrade message only |
| Business Pro | Friction dashboard, core categories, recommendations, history |
| Enterprise | + Team friction, executive report, cross-system signals |

Module gate: `friction_intelligence` in `lib/core/plans.ts` (business+).

---

## Friction categories

`support` · `sales` · `process` · `customer` · `meeting` · `email` · `task` · `team` (Enterprise)

## Score levels (calm wording)

`low` · `moderate` · `elevated` · `high`

---

## Database

- `aipify_friction_events` — detected friction points
- `aipify_friction_scores` — category and overall scores over time
- `aipify_friction_recommendations` — improvement suggestions with Action Center links

**RPCs:** `get_customer_friction_center()`, `detect_friction_for_tenant()`, `get_friction_history()`, `get_friction_recommendations()`, `get_friction_scores()`, `accept_friction_recommendation()`, `dismiss_friction_recommendation()`, `send_friction_to_action_center()`

Migration: `supabase/migrations/20260613700000_friction_intelligence_engine_phase49.sql`

---

## Integrations

- **Business Pulse** — pulse changes explain underlying friction patterns
- **Strategic Goals** — at-risk goals boost friction recommendation priority
- **Action Center** — send recommendations as approval-based actions (`created_by_module: fie`)
- **Continuous Improvement** — persistent friction feeds improvement priorities (planned)

---

## Ethics

Never rank employees, hidden monitoring, or productivity punishment. Aggregated team views only. Transparent explanations.
