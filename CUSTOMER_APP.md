# Aipify Customer App 1.0

**Phase 28 · Version 1.0 · Critical priority**

The first complete customer-facing product experience. Customers interact with **their** Aipify — separate from Platform Admin.

**Prerequisites:** [COMMAND_CENTER.md](./COMMAND_CENTER.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

**Code:** `app/app/` · `components/app/` · `lib/app/customer-app/` · RPCs in migration `20260611500000_customer_app_phase28.sql`

---

## Layer ownership

| Surface | Layer | Path |
|---------|-------|------|
| Customer App UI | **Customer App** | `app/app/*`, `components/app/*` |
| Business logic | **Aipify Core** | Supabase RPCs — never duplicated in UI |
| Platform Admin | **Platform** | `/platform/*` — never exposed to customers |

---

## Canonical routes (Phase 28)

| Route | Center |
|-------|--------|
| `/app` | Customer home — welcome, health score, activity, quick actions |
| `/app/executive` | Executive dashboard |
| `/app/presence` | Presence center — timeline, briefing, feed |
| `/app/recommendations` | Recommendations center |
| `/app/skills` | Skills center (SkillOS) |
| `/app/approvals` | Approval center (Trust & Action Engine) |
| `/app/action-center` | AEF Action Center — pending, approved, executed, and blocked business actions |
| `/app/installations` | Installations center |
| `/app/domains` | Domains center |
| `/app/team` | Team center |
| `/app/license` | Trust & License center |
| `/app/security` | Security dashboard |
| `/app/settings` | Settings center |
| `/app/learning` | Learning Review Center (Phase 29) |
| `/app/assistant` | Natural conversation assistant — PAME (Phase 31) |
| `/app/assistant/memory` | Personal memory dashboard — people, events, tasks, habits, goals |
| `/app/assistant/life` | LifeOS dashboard — briefings, priorities, checklists, life balance |
| `/app/assistant/relationships` | RSI dashboard — important people, milestones, follow-ups, gift planning |
| `/app/assistant/identity` | AIE dashboard — communication style, proactivity, observations, boundaries |
| `/app/assistant/context` | ACE dashboard — context mode, briefings, conflicts, workload, prioritization |
| `/app/assistant/calendars` | UCL dashboard — multi-provider calendars, sync, permissions, internal calendar |
| `/app/assistant/goals` | GDE dashboard — goals, milestones, celebrations, accountability settings |
| `/app/assistant/attention` | TAG dashboard — focus protection, attention audit, energy & meeting insights |
| `/app/assistant/decisions` | DSE dashboard — pending recommendations, business insights, risk indicators, decision history |
| `/app/settings/business-dna` | BDE Knowledge Approval Center — profile, templates, knowledge, escalation, automation readiness |
| `/app/settings/support-operations` | ASO Admin Control Center — autonomy levels, triage, performance, approval queue, knowledge gaps |
| `/app/settings/employee-knowledge` | EKE Internal Knowledge Dashboard — coverage, gaps, onboarding, role permissions, employee Q&A |
| `/app/settings/billing` | Commercial billing — current package, usage, upgrades, add-on marketplace |
| `/app/settings/modules` | Module management — enable/disable licensed modules, upgrade recommendations |

Legacy: `/dashboard/*` remains during migration. `/app/command-center` remains for Command Center / desktop pairing.

---

## Health score

Computed server-side via `_compute_customer_health_score()`:

| Score | Label |
|-------|-------|
| 95–100 | Excellent |
| 80–94 | Healthy |
| 60–79 | Needs attention |
| Below 60 | Action recommended |

Combines installation health, skill status, pending approvals, and critical events.

---

## Core RPCs

| RPC | Purpose |
|-----|---------|
| `get_customer_app_home_bundle()` | Home overview |
| `get_customer_executive_dashboard()` | Executive dashboard |
| `get_customer_presence_center()` | Presence timeline & feed |
| `get_customer_recommendations_center()` | Recommendations list |
| `perform_customer_recommendation_action()` | Approve / dismiss (records learning on approve) |
| `get_customer_learning_center()` | Learning Review Center |
| `update_customer_learning_settings()` | Learning mode & adaptive consent |
| `remove_customer_learning_memory()` | Remove a learning |
| `get_customer_approvals_center()` | Approval inbox (actions, notifications, patterns) |
| `approve_action_request()` / `reject_action_request()` | Governed AI action decisions |
| `set_tenant_emergency_state()` | Emergency stop all AI actions |
| `get_customer_trust_actions_center()` | Trust & actions dashboard bundle |
| `get_customer_team_center()` | Team members & invitations |
| `_compute_customer_health_score()` | Health score helper |

Reuses `get_command_center_bundle_for_tenant()` — one Aipify Core.

---

## Design principles

Professional · Calm · Elegant · Progressive disclosure · Tenant-scoped only

Customers must never see other tenants, platform billing controls, or global intelligence governance.

---

## Unonight pilot

Validate executive usefulness, recommendation quality, presence engagement, approval completion, and simplicity via `/platform/presence-pilot` (extended metrics in Phase 28 migration).

---

## Principle

> Aipify should simplify operations — not complicate them. The Customer App provides clarity, confidence, and awareness.
