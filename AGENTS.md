<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Aipify Group AS — company foundation (mandatory first)

Read **[AIPIFY_GROUP_AS_COMPANY_FOUNDATION_DIRECTIVE.md](./AIPIFY_GROUP_AS_COMPANY_FOUNDATION_DIRECTIVE.md)** first. **Aipify Group AS** is the parent company (Norway · *From Norway. For the world.*) — not merely a project name. All development, documentation, legal copy, investor material, and platform communications must reflect this identity.

## Aipify core foundation — mandatory before every capability

Read **[CORE_FOUNDATION.md](./CORE_FOUNDATION.md)** next. This is the non-negotiable product foundation (identity, mission, human control, privacy, presence, actions, core package). Then read **[OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md)** for agent governance and skills checklist. Read **[ENTERPRISE_DESIGN_COMMUNICATION_STANDARD.md](./ENTERPRISE_DESIGN_COMMUNICATION_STANDARD.md)** before UX, copy, onboarding, dashboards, Companion UI, marketing strings, pricing copy, or Knowledge Center content. For product architecture framing, read **[ABOS_FOUNDATION.md](./ABOS_FOUNDATION.md)** and **[ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md)** — use **Aipify Business Operating System (ABOS)** in all generated docs unless a specific module name is required.

New capabilities must never bypass company foundation, core principles, plan limits, tenant isolation, approval policy, or layer separation.

**Master Structure Blueprint (Phase 500):** Read **[AIPIFY_MASTER_STRUCTURE_BLUEPRINT.md](./AIPIFY_MASTER_STRUCTURE_BLUEPRINT.md)** before any feature, route, Business Pack, or permission work. Five layers: SUPER ADMIN → PLATFORM → APP / PARTNERS → EMPLOYEES. Code registry: `lib/core/master-structure/`. **If placement is unclear, pause before implementation.**

**Governance order:** Company Foundation Directive → Core Foundation → Operating Principles → Enterprise Design & Communication Standard → **Master Structure Blueprint (Phase 500)** → Architecture → Implementation → Skills.

Before any new capability, answer [CORE_FOUNDATION.md §18](./CORE_FOUNDATION.md#18-future-development-rule): identity, human control, privacy, layer, core vs modular. If unclear, **pause**.

For **skills**, read **[SKILL_ENGINE.md](./SKILL_ENGINE.md)**. Register every capability in `lib/core/skills/registry.ts`. Follow [CORE_FOUNDATION.md §21](./CORE_FOUNDATION.md#21-skill-placement-rules) for layer placement. No skill before registry entry and placement approval.

For **installation and onboarding**, read **[INSTALL_ENGINE.md](./INSTALL_ENGINE.md)**. Shared constants live in `lib/install/`; embedded runtime in `lib/embed/` and `app/api/install/`. Extend the existing wizard (`lib/platform/installation-engine.ts`) — do not replace without migration plan.

For **safe updates and version deployment**, read **[UPDATE_ENGINE.md](./UPDATE_ENGINE.md)**. Constants in `lib/update/`; platform rollout at `app/platform/updates/`; embedded reporting at `app/api/install/version`. Database migrations require explicit approval — updates must never silently alter customer data.

**Before shipping a phase with new tables/RPCs**, apply its SQL migration to Supabase Core first:

1. `npm run supabase:sql` — list pending migrations
2. `npm run supabase:sql:apply -- --from <version>` — apply pending from a version
3. `npm run supabase:sql:apply -- --file supabase/migrations/<file>.sql` — apply one file

Uses the Supabase Management API (`scripts/supabase-apply-sql.mjs`) with token from `npx supabase login` or `SUPABASE_ACCESS_TOKEN`. Prefer this over `supabase db push` when CLI history drift blocks push.

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

For **Context Engine & Universal Calendar Layer (ACE + UCL)**, read **[CONTEXT_ENGINE.md](./CONTEXT_ENGINE.md)**. Constants in `lib/context-engine/`; dashboards at `/app/assistant/context` and `/app/assistant/calendars`; APIs at `/api/assistant/context` and `/api/assistant/calendars`. Orchestrates calendars — never replaces them; natural language scheduling via `detectSchedulingIntent()` with user confirmation.

For **Goals & Dreams Engine (GDE)**, read **[GOALS_DREAMS_ENGINE.md](./GOALS_DREAMS_ENGINE.md)**. Constants in `lib/goals-dreams-engine/`; dashboard at `/app/assistant/goals`; APIs at `/api/assistant/goals`. Supports aspirations with milestones and accountability — never guilt; natural language via `detectGoalIntent()` with user confirmation.

For **Time & Attention Guardian (TAG)**, read **[ATTENTION_GUARDIAN.md](./ATTENTION_GUARDIAN.md)**. Constants in `lib/attention-guardian/`; dashboard at `/app/assistant/attention`; APIs at `/api/assistant/attention`. Protects focus and attention — never pressure; natural language via `detectFocusIntent()` with user confirmation; syncs Context Engine focus mode.

For **Decision Support Engine (DSE)**, read **[DECISION_SUPPORT_ENGINE.md](./DECISION_SUPPORT_ENGINE.md)**. Constants in `lib/decision-support-engine/`; dashboard at `/app/assistant/decisions`; APIs at `/api/assistant/decisions`. Business-first guidance with explainability — never dictates outcomes; natural language via `detectDecisionIntent()`; integrates Trust Actions, goals, calendar, and tasks.

For **Business DNA Engine (BDE)**, read **[BUSINESS_DNA_ENGINE.md](./BUSINESS_DNA_ENGINE.md)**. Constants in `lib/business-dna-engine/`; Knowledge Approval Center at `/app/settings/business-dna`; APIs at `/api/business-dna/*` and `/api/support/email/*`. Tenant-specific products, templates, tone, escalation; email template priority chain; human review default; integrates Install Engine, Learning Engine, and Trust & Action.

For **Autonomous Support Operations (ASO)**, read **[AUTONOMOUS_SUPPORT_OPERATIONS.md](./AUTONOMOUS_SUPPORT_OPERATIONS.md)**. Constants in `lib/autonomous-support-operations/`; Admin Control Center at `/app/settings/support-operations`; APIs at `/api/support-operations/*` and `/api/support/triage`. Autonomy levels 0–3, triage engine, confidence scoring, knowledge gaps; integrates Business DNA and Trust & Action; escalates uncertainty.

For **Employee Knowledge Engine (EKE)**, read **[EMPLOYEE_KNOWLEDGE_ENGINE.md](./EMPLOYEE_KNOWLEDGE_ENGINE.md)**. Constants in `lib/employee-knowledge-engine/`; Internal Knowledge Dashboard at `/app/settings/employee-knowledge`; APIs at `/api/employee-knowledge/*`. Approved ingestion only, role-based permissions, employee Q&A, step-by-step guidance, onboarding paths, knowledge gaps, health score; integrates Business DNA; natural language via `detectEmployeeKnowledgeIntent()`.

For **Commercial Packages & Modular Architecture**, read **[COMMERCIAL_PACKAGES.md](./COMMERCIAL_PACKAGES.md)**. Constants in `lib/commercial-packages/`; Billing at `/app/settings/billing`; Module Management at `/app/settings/modules`; APIs at `/api/commercial-packages/*`. Starter through Enterprise packages, tenant module licensing, usage tracking, feature flags, upgrade recommendations; integrates License Center and existing `plans`/`subscriptions`.

For **Autonomous Execution Framework (AEF)**, read **[AUTONOMOUS_EXECUTION_FRAMEWORK.md](./AUTONOMOUS_EXECUTION_FRAMEWORK.md)**. Constants in `lib/aipify/execution/`; Action Center at `/app/action-center`; APIs at `/api/aipify/*`. Execution levels observer→autonomous; package-gated to Business and Enterprise; safety checker blocks forbidden actions; mock adapters for email, support, tasks, FAQ, notifications; full audit via `aipify_action_logs`.

For **Internal Language Model (ILM)**, read **[INTERNAL_LANGUAGE_MODEL.md](./INTERNAL_LANGUAGE_MODEL.md)**. ILM corpus in `aipify-core/knowledge/internal-language-model/`; `lib/internal-language-model/`; command, natural language, proactive guidance, and reminder follow-up detection; `getProactiveGuidance()` and `getReminderFollowupLanguage()` for system-triggered scenarios; never imply Aipify replaces employees. **Brand identity:** [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md) — `detectBrandAddressIntent()`, `getBrandAddressResponse()`, `adaptReplyToBrandIdentity()`; Aipify-first self-reference in assistant replies and customer-facing copy. **Companion Golden Rule:** [AIPIFY_COMPANION_GOLDEN_RULE.md](./AIPIFY_COMPANION_GOLDEN_RULE.md) — never stop at information; `formatCompanionInsight()`, `validateCompanionInsight()`, `detectInformationOnlyPattern()`; applies to all Companion modules and Business Packs.

## Aipify architecture — mandatory before every feature

Read **[ARCHITECTURE.md](./ARCHITECTURE.md)**. Read **[AIPIFY_MASTER_STRUCTURE_BLUEPRINT.md](./AIPIFY_MASTER_STRUCTURE_BLUEPRINT.md)** (Phase 500) for the permanent five-layer model. **Before implementing any new feature**, explicitly answer these four questions. If any cannot be answered, **stop and ask** — do not write code until the architecture decision is made.

**Never** place new functionality into existing folders simply because they already exist (e.g. do not add customer product features under `app/platform/` or `app/dashboard/` when they belong in `app/app/`).

### 1. Which layer?

- [ ] Super Admin (`/super/*`)
- [ ] Platform Admin (`/platform/*`)
- [ ] Customer App / APP (`/app/*`)
- [ ] Employees (role-scoped inside APP)
- [ ] Partners (`/partners/*`)
- [ ] Embedded / Install (APP-owned: `/api/install`, `/api/embed`)

See `lib/core/master-structure/` and `validateFeaturePlacement()`.

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
