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

For **installation and onboarding**, read **[INSTALL_ENGINE.md](./INSTALL_ENGINE.md)**. Shared constants live in `lib/install/`; embedded runtime in `lib/embed/` and `app/api/install/`. Extend the existing wizard (`lib/platform/installation-engine.ts`) — do not replace without migration plan.

For **safe updates and version deployment**, read **[UPDATE_ENGINE.md](./UPDATE_ENGINE.md)**. Constants in `lib/update/`; platform rollout at `app/platform/updates/`; embedded reporting at `app/api/install/version`. Database migrations require explicit approval — updates must never silently alter customer data.

For **trust, privacy, and data ownership**, read **[TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md)**. Rules in `lib/trust/`; customer Security Dashboard at Settings → Security; installation validation in `lib/embed/validation.ts`. Customer owns data — store metadata, not operational records, unless explicitly approved.

For **licensing and ownership transparency**, read **[LICENSE_CENTER.md](./LICENSE_CENTER.md)**. Constants in `lib/license/`; sidebar panel + Trust Center at `/app/license`; 3-day payment grace period before service pause.

For **anonymised impact metrics and marketing proof**, read **[IMPACT_METRICS.md](./IMPACT_METRICS.md)**. Constants in `lib/impact/`; global dashboard at `/platform/impact`; install reporting at `/api/install/metric-event`; minimum 5 tenants for public marketing statements.

For **the Skill Operating System**, read **[SKILLOS.md](./SKILLOS.md)**. Constants in `lib/skillos/`; platform governance at `/platform/skills`; customer workspace at `/app/skills`; install health at `/api/install/skill-health`. Register every capability in `lib/core/skills/registry.ts` first.

For **architecture review and stabilization**, read **[ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md)** (Phase 23). Canonical customer routes are `/app/*`; `/dashboard/*` is legacy. Do not expand Platform Admin with customer daily workflows.

For **modern install experience and license engine**, read **[MODERN_INSTALL_EXPERIENCE.md](./MODERN_INSTALL_EXPERIENCE.md)**. Constants in `lib/install/experience.ts`; customer assistant at `/app/install`; developer settings at `/app/settings/developer`; token-free flow via `POST /api/install/begin`. Standard users never see install tokens.

For **desktop presence and notification architecture**, read **[DESKTOP_PRESENCE_FOUNDATION.md](./DESKTOP_PRESENCE_FOUNDATION.md)**. Constants in `lib/presence/notifications.ts`; desktop-ready APIs at `/api/presence/*`. Native desktop apps are not built in this phase.

For **Command Center and Notification Engine**, read **[COMMAND_CENTER.md](./COMMAND_CENTER.md)**. Constants in `lib/notification/`; unified UI at `/app/command-center`; bundle via `GET /api/presence/command-center`. All clients consume one Aipify Core — never duplicate business logic.

For **Desktop Command Center (Tauri)**, read **[DESKTOP_COMMAND_CENTER.md](./DESKTOP_COMMAND_CENTER.md)**. Desktop client at `apps/command-center/`; pairing at `/app/command-center/connect`; APIs at `/api/desktop/*`. Session tokens only — never store installation secrets on the desktop client.

For **Customer App 1.0**, read **[CUSTOMER_APP.md](./CUSTOMER_APP.md)**. Canonical routes at `/app/*`; centers for home, executive, presence, recommendations, approvals, skills, installations, domains, team, license, security, settings. Business logic in Core RPCs — UI panels are thin clients. Never mix Platform Admin into Customer App.

For **Trust & Action Engine**, read **[TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md)**. Constants in `lib/trust-action/`; customer Approval Center at `/app/approvals`; APIs at `/api/actions/*`; platform governance at `/platform/trust`. Level 4 (critical) actions are prohibited for AI. Every action requires explanation and audit.

For **Personal Assistant Memory Engine (PAME)**, read **[ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md)** and **[HUMAN_MEMORY_INTENT_DATASET.md](./HUMAN_MEMORY_INTENT_DATASET.md)**. Intent patterns in `lib/assistant-memory/memory-intent-dataset.ts`; natural conversation at `/app/assistant`; memory dashboard at `/app/assistant/memory`; APIs at `/api/assistant/*`. Teach understanding, not commands. Metadata only — never store raw chat.

For **Life Operating System (LifeOS)**, read **[LIFE_OPERATING_SYSTEM.md](./LIFE_OPERATING_SYSTEM.md)**. Constants in `lib/life-os/`; life dashboard at `/app/assistant/life`; APIs at `/api/assistant/life/*`. Daily briefings, priorities, conflict detection, checklists. Builds on PAME — suggestions only, user always decides.

For **Relationship & Social Intelligence (RSI)**, read **[RELATIONSHIP_SOCIAL_INTELLIGENCE.md](./RELATIONSHIP_SOCIAL_INTELLIGENCE.md)**. Constants in `lib/relationship-intelligence/`; dashboard at `/app/assistant/relationships`; APIs at `/api/assistant/relationships/*`. Never impersonate user or send automated messages. Conversation notes require explicit approval.

For **Identity Engine (AIE)**, read **[IDENTITY_ENGINE.md](./IDENTITY_ENGINE.md)**. Constants in `lib/identity-engine/`; dashboard at `/app/assistant/identity`; APIs at `/api/assistant/identity`. Per-user communication style; observations require approval; `adaptReplyToIdentity()` on assistant replies.

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
