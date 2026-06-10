<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Aipify core foundation — mandatory before every capability

Read **[CORE_FOUNDATION.md](./CORE_FOUNDATION.md)** first. This is the non-negotiable foundation (identity, mission, human control, privacy, presence, actions, core package). Then read **[OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md)** for agent governance and skills checklist.

New capabilities must never bypass core principles, plan limits, tenant isolation, approval policy, or layer separation.

**Governance order:** Core Foundation → Operating Principles → Architecture → Implementation → Skills.

Before any new capability, answer [CORE_FOUNDATION.md §18](./CORE_FOUNDATION.md#18-future-development-rule): identity, human control, privacy, layer, core vs modular. If unclear, **pause**.

For **skills**, read **[SKILL_ENGINE.md](./SKILL_ENGINE.md)**. Register every capability in `lib/core/skills/registry.ts`. Follow [CORE_FOUNDATION.md §21](./CORE_FOUNDATION.md#21-skill-placement-rules) for layer placement. No skill before registry entry and placement approval.

## Aipify architecture — mandatory before every feature

Read **[ARCHITECTURE.md](./ARCHITECTURE.md)**. **Before implementing any new feature**, explicitly answer these four questions. If any cannot be answered, **stop and ask** — do not write code until the architecture decision is made.

**Never** place new functionality into existing folders simply because they already exist (e.g. do not add customer product features under `app/platform/` or `app/dashboard/` when they belong in `app/app/`).

### 1. Which layer?

- [ ] Platform Admin
- [ ] Customer App
- [ ] Embedded Installation

### 2. Who is the user?

- [ ] Aipify Internal Staff
- [ ] Customer Owner
- [ ] Customer Team Member
- [ ] Embedded End User

### 3. What isolation level?

- [ ] Global
- [ ] Tenant
- [ ] Installation

### 4. Where should the code live?

| Layer | Paths (this repo uses `app/`, not `src/app/`) |
|-------|-----------------------------------------------|
| Platform | `app/platform/`, `components/platform/`, `lib/platform/` |
| Customer | `app/app/`, `components/app/`, `lib/app/` |
| Embedded | `app/api/install/`, `app/api/embed/`, `components/embed/`, `lib/install/`, `lib/embed/` |
| Shared | `lib/core/`, `components/shared/`, `components/ui/` |

Architecture decisions come **before** implementation decisions.
