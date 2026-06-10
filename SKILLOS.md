# Aipify Skill Operating System (SkillOS)

**Phase 22 · Version 1.0 · Critical**

Unified operational framework governing how Skills are built, deployed, secured, updated, monitored, and evolved.

**Prerequisites:** [SKILL_ENGINE.md](./SKILL_ENGINE.md) · [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) · [IMPACT_METRICS.md](./IMPACT_METRICS.md)

**Code:** `lib/skillos/` · Platform: `/platform/skills` · Customer: `/app/skills` · Install: `/api/install/skill-health`

---

## Layer ownership

| Surface | Layer | Responsibility |
|---------|-------|----------------|
| Skill definitions, versions, global governance | **Platform Admin** | `/platform/skills` |
| Installed skills, permissions, learning prefs | **Customer App** | `/app/skills` |
| Execution health, permission validation | **Install Engine** | `POST /api/install/skill-health` |
| Skill constants & registry bridge | **Shared** | `lib/skillos/` + `lib/core/skills/` |

Phase 16 code registry (`lib/core/skills/registry.ts`) remains the definition source. SkillOS persists runtime state in Postgres.

---

## 1. Purpose

SkillOS provides a standard framework for all Skills:

- Registration · Permissions · Lifecycle · Health · Updates
- Learning governance · Audit logging · Marketplace preparation

**Philosophy:** Aipify grows through Skills, not uncontrolled feature expansion.

---

## 2. Data model

| Table | Purpose |
|-------|---------|
| `skills` | Platform skill definitions (key, category, plan, status) |
| `skill_versions` | Version history, release notes, rollback support |
| `tenant_skills` | Per-tenant install state, learning mode |
| `skill_permissions` | Least-privilege permission grants |
| `skill_health` | Health score, execution counters |
| `skill_events` | Operational events (no private content) |
| `skill_audit_logs` | Activation, permission, learning audit |

---

## 3. Categories

Operational · Support · Executive · Commerce · Marketing · Moderation · Communication · Analytics · Companion · Custom

Categories are free-text — new categories require no schema changes.

---

## 4. Learning modes

| Mode | Default |
|------|---------|
| `disabled` | |
| `assisted` | ✓ |
| `adaptive` | |

Customers must understand what a Skill learns, why, and how to disable learning.

---

## 5. Lifecycle

```
Installed → Configured → Awaiting Approval → Active → Learning → Updated → Paused → Disabled → Archived
```

---

## 6. Success score (0–100)

Factors: execution success rate, health score, health status.

RPC: `compute_skill_success_score(tenant_skill_id)`

---

## 7. Release pipeline

```
Aipify Internal → Unonight Pilot → Beta Customers → Stable Release
```

No Skill bypasses this process.

---

## 8. Security principles

- Tenant isolation · Least privilege · Approval policies
- Immutable audit · Data ownership (Phase 19)
- Permissions never expand automatically

---

## 9. RPCs

| RPC | Access |
|-----|--------|
| `get_platform_skillos_dashboard` | Platform Admin |
| `get_customer_skill_workspace` | Customer App (tenant-scoped) |
| `record_skill_audit_log` | Authenticated |
| `record_install_skill_health` | Install token (anon) |
| `compute_skill_success_score` | Authenticated |

---

## 10. Marketplace preparation

Database structures seeded for Support AI, Executive AI, Commerce AI, Moderation AI, Marketing AI, Analytics AI.

**No public marketplace UI in Phase 22.**

---

## Final principle

Features create software. Skills create intelligence. SkillOS creates an ecosystem.
