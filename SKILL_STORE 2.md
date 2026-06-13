# Skill Store (Phase 63)

Aipify Skill Store lets businesses discover, install, configure, approve, and manage modular capabilities called **Skills** without modifying the core platform.

## Philosophy

Discover → Install → Configure → Approve → Use → Improve

## Customer App routes

| Route | Purpose |
|-------|---------|
| `/app/skills` | Browse catalog and install new skills |
| `/app/skills/installed` | View installed skills |
| `/app/skills/[key]` | Skill detail — permissions, dependencies, install/disable |
| `/app/skills/history` | Install and lifecycle audit trail |

## Database tables

Extends Phase 22 SkillOS tables:

- `skills` — global skill registry (slug, category, risk_level, required_permissions, module_key, …)
- `tenant_skills` — per-tenant installations
- `skill_versions` — version history
- `skill_dependencies` — required/optional dependencies
- `skill_install_events` — install, activate, disable, update audit
- `skill_settings` — per-tenant skill configuration

## API (`/api/aipify/skills/*`)

- `GET card` — home summary (installed vs available counts)
- `GET catalog` — browse skills (`?category=`)
- `GET [key]` — skill detail with dependency check
- `POST install` — install with optional governance approval
- `POST [key]/disable` — disable tenant skill
- `GET history` — install event history
- `POST unonight/seed` — Unonight pilot skill activation

## Risk levels

| Level | Meaning |
|-------|---------|
| **Low** | Read-only skills |
| **Medium** | Skills creating recommendations |
| **High** | Skills performing actions |

## Initial catalog skills

Support AI, Knowledge Center, Quality Guardian, Desktop Companion, Executive Briefing, Approval Center, Image Guardian, Performance Guardian, Predictive Insights, Memory Engine — plus dependencies across Phases 54–62 modules.

## Unonight pilot

Early adopter activation for: Support AI, Quality Guardian, Executive Briefing, Desktop Companion, Memory Engine via `seed_unonight_pilot_skills` RPC and `/api/aipify/skills/unonight/seed`.

## Integrations

- **Governance (Phase 54)** — approval for medium/high-risk installs
- **Knowledge Center** — FAQ at `content/knowledge/aipify/skills/faq/`, category `skill-store`
- **Audit** — `skill_install_events` + Phase 22 `skill_audit_logs`
- **Desktop Companion, Executive Briefing, Memory Engine** — seeded as installable skills

## Library

`lib/aipify/skills/` — `types.ts`, `parse.ts`, `presets/unonight-skills.ts`, `jobs.ts` (server-only, not barrel-exported)

## Migration

`supabase/migrations/20260615200000_skill_store_phase63.sql`

## Knowledge Center import

After deploy:

```bash
POST /api/aipify/knowledge/import-seed-content
{ "overwrite": true }
```
