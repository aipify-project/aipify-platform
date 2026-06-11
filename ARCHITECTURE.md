# Aipify Product Architecture

**Prerequisites:** Read **[CORE_FOUNDATION.md](./CORE_FOUNDATION.md)** then **[OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md)** — foundation, behaviour, safety, and packages are decided before architecture and implementation. New skills come last.

Aipify is split into **three layers**. Before adding a feature, decide which layer it belongs to.

| Question | Layer | Route prefix |
|----------|--------|--------------|
| Internal Aipify Group AS operations? | **Platform Admin** | `/platform` |
| Product customers buy and log into? | **Customer App** | `/app` |
| Runs inside a customer's website/admin? | **Embedded / Install** | `/api/install`, `/api/embed` |

**Do not mix layers.**

This repo uses Next.js App Router at the project root (`app/`, not `src/app/`). The tables below map spec paths to actual paths.

---

## Layer 1 — Platform Admin

**Purpose:** Internal control center for Aipify Group AS. Platform admins only.

**Routes:** `/platform`, `/platform/*`

**Code locations:**

| Area | Path |
|------|------|
| Routes | `app/platform/` |
| Components | `components/platform/` |
| Business logic | `lib/platform/` |
| Types | `types/platform/` (re-exports `lib/platform/types.ts`) |
| Services | `services/platform/` |

**Examples:** customers, subscriptions, billing, invoices, global intelligence, learning queue, action center (internal), platform metrics, system status, audit logs.

**Rule:** Platform Admin is **not** the customer product. Do not add customer-facing product features here unless they administer all tenants.

---

## Layer 2 — Customer App (Control Center)

**Purpose:** The software product each customer buys (e.g. Unonight, Sportsklær). All data **must** be scoped by `tenant_id` / `customer_id` / `company_id`.

**Routes:** `/app`, `/app/*` (canonical). `/dashboard` is the **legacy** prefix during migration.

**Code locations:**

| Area | Path |
|------|------|
| Routes | `app/app/` |
| Components | `components/app/` |
| Business logic | `lib/app/` |
| Types | `types/app/` |
| Services | `services/app/` |

**Customer sidebar (target):** Overview, Presence, Assistant, Support, Actions, Recommendations, Installations, Domains, Team, Billing, Settings.

**Migration:** `lib/app/route-aliases.ts` maps `/app/*` → `/dashboard/*` until pages move. New customer features go under `app/app/` and `lib/app/`, not under `app/platform/`.

**Roles:** `owner`, `admin`, `support`, `staff`, `read_only`

---

## Layer 3 — Embedded / Install Runtime

**Purpose:** Aipify inside the customer's existing admin (WordPress, Shopify, custom CMS, Unonight admin).

**Routes:** `/api/install/*`, `/api/embed/*`

**Code locations:**

| Area | Path |
|------|------|
| API routes | `app/api/install/`, `app/api/embed/` |
| Components | `components/embed/` |
| Business logic | `lib/install/`, `lib/embed/` |
| Types | `types/install/` |
| Services | `services/install/` |

**Must validate:** `installation_token`, domain, subscription status, license limits, allowed modules.

**Install Engine (Phase 17):** See [INSTALL_ENGINE.md](./INSTALL_ENGINE.md) — workflow, discovery, heartbeat, human validation, learning phase.

**Update Engine (Phase 18):** See [UPDATE_ENGINE.md](./UPDATE_ENGINE.md) — safe version deployment, maintenance windows, migration approval, rollback, audit logging.

**Trust Architecture (Phase 19):** See [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) — data ownership, access levels, metadata-first storage, immutable audit, Security Dashboard.

**License & Trust Center (Phase 20):** See [LICENSE_CENTER.md](./LICENSE_CENTER.md) — sidebar license panel, `/app/license`, payment grace period, pause/reactivation policy.

**Anonymised Impact Metrics (Phase 21):** See [IMPACT_METRICS.md](./IMPACT_METRICS.md) — `/platform/impact`, marketing proof export, install metric events, Trust Center disclosure.

**Skill Operating System (Phase 22):** See [SKILLOS.md](./SKILLOS.md) — skill registry tables, tenant skills, permissions, health, audit, `/platform/skills`, `/app/skills`.

**Architecture Review (Phase 23):** See [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) — layer audit, migration priorities, stabilization rules. `/dashboard/*` is legacy; `/app/*` is canonical.

**Modern Install Experience (Phase 24):** See [MODERN_INSTALL_EXPERIENCE.md](./MODERN_INSTALL_EXPERIENCE.md) — `/app/install` assistant, Developer Settings at `/app/settings/developer`, install tokens (not license keys), platform detection, support escalations.

**Desktop Presence Foundation (Phase 25):** See [DESKTOP_PRESENCE_FOUNDATION.md](./DESKTOP_PRESENCE_FOUNDATION.md) — notifications, quiet hours, actionable alerts, `/api/presence/*` for future desktop clients, Unonight pilot at `/platform/presence-pilot`.

**Command Center & Notification Engine (Phase 26):** See [COMMAND_CENTER.md](./COMMAND_CENTER.md) — `/app/command-center`, executive feed, quick actions, plan packaging, `lib/notification/`, single Core event infrastructure for web/desktop/mobile.

**Desktop Command Center (Phase 27):** See [DESKTOP_COMMAND_CENTER.md](./DESKTOP_COMMAND_CENTER.md) — Tauri client at `apps/command-center/`, macOS Phase 1, pairing at `/app/command-center/connect`, desktop APIs at `/api/desktop/*`, `lib/desktop/`, hashed session tokens (Business+ plan).

**Customer App 1.0 (Phase 28):** See [CUSTOMER_APP.md](./CUSTOMER_APP.md) — complete customer product at `/app/*` (home, executive, presence, recommendations, approvals, skills, installations, domains, team, license, security, settings). `lib/app/customer-app/`, Core RPCs for health score and centers. `/dashboard/*` is legacy.

**Learning Engine (Phase 29):** See [LEARNING_ENGINE.md](./LEARNING_ENGINE.md) — controlled learning at `/app/learning`, modes (disabled / assisted / adaptive), learning memory metadata only, platform governance at `/platform/intelligence/learning-queue`, `lib/learning/`, migration `20260611700000_learning_engine_phase29.sql`.

**Trust & Action Engine (Phase 30):** See [TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md) — governed AI actions at `/app/approvals`, action levels 0–4, policies, explainability, audit, emergency stop, APIs at `/api/actions/*`, platform dashboard at `/platform/trust`. `lib/trust-action/`, migration `20260611800000_trust_action_engine_phase30.sql`.

**Personal Assistant Memory Engine / PAME (Phase 31):** See [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) — natural conversation at `/app/assistant`, PAME memory types (people, events, tasks, habits, goals), clarification + reminder engines, `/app/assistant/memory` dashboard. Separate from Learning Engine. `lib/assistant-memory/`, migrations `20260611900000_assistant_memory_phase31.sql`, `20260611910000_pame_phase31.sql`.

**Life Operating System / LifeOS (Phase 32):** See [LIFE_OPERATING_SYSTEM.md](./LIFE_OPERATING_SYSTEM.md) — daily briefings, evening reviews, priority engine, conflict detection, checklists, `/app/assistant/life` dashboard. Builds on PAME; suggestions only. `lib/life-os/`, migration `20260612000000_life_os_phase32.sql`.

**Relationship & Social Intelligence / RSI (Phase 33):** See [RELATIONSHIP_SOCIAL_INTELLIGENCE.md](./RELATIONSHIP_SOCIAL_INTELLIGENCE.md) — important people directory, social reminders, relationship timeline, follow-ups, gift planning, `/app/assistant/relationships`. Never impersonates user. `lib/relationship-intelligence/`, migration `20260612100000_rsi_phase33.sql`.

**Identity Engine / AIE (Phase 34):** See [IDENTITY_ENGINE.md](./IDENTITY_ENGINE.md) — per-user communication identity, observation approval, reply adaptation, `/app/assistant/identity`. Transparent — never manipulative. `lib/identity-engine/`, migration `20260612200000_identity_engine_phase34.sql`.

**Context Engine & Universal Calendar Layer / ACE + UCL (Phase 35):** See [CONTEXT_ENGINE.md](./CONTEXT_ENGINE.md) — orchestrates calendars users already trust; context modes, daily briefings, conflict detection, natural language scheduling. `/app/assistant/context`, `/app/assistant/calendars`. `lib/context-engine/`, migration `20260612300000_context_calendar_phase35.sql`.

**Goals & Dreams Engine / GDE (Phase 36):** See [GOALS_DREAMS_ENGINE.md](./GOALS_DREAMS_ENGINE.md) — long-term aspirations, milestones, accountability, celebrations, setback support. `/app/assistant/goals`. `lib/goals-dreams-engine/`, migration `20260612400000_goals_dreams_phase36.sql`.

**Time & Attention Guardian / TAG (Phase 37):** See [ATTENTION_GUARDIAN.md](./ATTENTION_GUARDIAN.md) — focus protection, attention audit, energy management, goal alignment, meeting protection. `/app/assistant/attention`. `lib/attention-guardian/`, migration `20260612500000_attention_guardian_phase37.sql`.

**Decision Support Engine / DSE (Phase 38):** See [DECISION_SUPPORT_ENGINE.md](./DECISION_SUPPORT_ENGINE.md) — business-first prioritization, escalation guidance, executive insights, explainability, confidence indicators. `/app/assistant/decisions`. `lib/decision-support-engine/`, migration `20260612600000_decision_support_phase38.sql`.

**Business DNA Engine / BDE (Phase 39):** See [BUSINESS_DNA_ENGINE.md](./BUSINESS_DNA_ENGINE.md) — tenant Business DNA profiles, email templates, support knowledge, workflows, escalation rules, health score, email draft pipeline. `/app/settings/business-dna`. `lib/business-dna-engine/`, migration `20260612700000_business_dna_phase39.sql`.

**Autonomous Support Operations / ASO (Phase 40):** See [AUTONOMOUS_SUPPORT_OPERATIONS.md](./AUTONOMOUS_SUPPORT_OPERATIONS.md) — autonomy levels, triage engine, confidence scoring, proactive support, knowledge gaps, case summarization. `/app/settings/support-operations`. `lib/autonomous-support-operations/`, migration `20260612800000_autonomous_support_phase40.sql`.

**Model-Agnostic Intelligence:** See [MODEL_AGNOSTIC_INTELLIGENCE.md](./MODEL_AGNOSTIC_INTELLIGENCE.md) — Aipify Intelligence is the product; LLMs are swappable infrastructure. Task-based routing via `lib/intelligence/` (`selectModelProfile`). Never brand customer UI with model providers. Enterprise BYOM via `customer_approved` policy.

**UI:** Minimal — Ask Aipify, Recommendations, Activity, Settings.

---

## Shared code

| Concern | Path |
|---------|------|
| UI primitives & brand | `components/ui/`, `components/shared/` |
| Cross-layer logic | `lib/core/`, `lib/intelligence/`, `services/core/`, `types/core/` |

Shared modules include plan limits, tenant utilities, domain validation, risk classification, presence states, and model-agnostic intelligence routing. **Do not duplicate** design components across platform / app / embed — import from `components/shared/`.

---

## Product packages

Defined in `lib/core/plans.ts`:

| Plan | Domains | Installations | Users | Highlights |
|------|---------|---------------|-------|------------|
| **Starter** | 1 | 1 | 1 | Presence, basic briefing, basic Support AI, knowledge base |
| **Growth** | 3 | 3 | 5 | + Action Center, health monitoring, recommendations, basic automations |
| **Business** | 10 | 10 | 25 | + Self-healing, advanced insights, Executive Center, teams |
| **Enterprise** | Custom | Custom | Custom | + Dedicated intelligence, permissions, custom modules, privacy controls |

---

## Feature placement rules

| If the feature… | Place under |
|-----------------|-------------|
| Manages **all** customers (Klarna, global patterns, platform billing) | `/platform` |
| Is used by **one** customer (team, domains, customer presence) | `/app` |
| Runs **inside** the customer's site (widget, heartbeat, embed assistant) | `/api/install`, `/api/embed` |

---

## Skill placement rules (Core Foundation §21)

Skills span all three layers. **Placement must be approved before implementation.**

| Layer | Purpose | Routes | Components |
|-------|---------|--------|------------|
| **Platform Admin** | Global skill governance, rollouts, metrics | `app/platform/skills/` | `components/platform/skills/` |
| **Customer App** | Installed skills, settings, activity, preferences | `app/app/skills/` | `components/app/skills/` |
| **Embedded** | Context, assistance, approved actions, health | `app/api/install/`, `app/api/embed/` | `components/embed/` |

**Workflow:** define skill → determine layer → permissions → approval requirements → implement → validate internally → pilot (Unonight) → public release. See `lib/core/skills.ts`.

**Mandatory:** Never place skills in existing folders out of convenience. Architecture before implementation.

---

## Database & authorization

- **Platform tables** may read across tenants (with admin checks).
- **Customer app tables** must filter by tenant on every query.
- **Install/embed** must validate tenant + installation + license.

**Platform roles:** `super_admin`, `platform_support` (see `platform_admins`)

**Customer roles:** `owner`, `admin`, `support`, `staff`, `read_only`

---

## Current inventory (migration status)

### Platform-only (stay under `/platform`)

Executive Center, Action Center (internal ops), Intelligence brain/learning/self-healing, global patterns, platform metrics, all customers/subscriptions/billing, system status, internal automations.

### Customer product (belongs under `/app`, currently partly under `/dashboard`)

Customer overview, assistant, installs, support, analytics, commerce, team, billing, settings, Presence Center (customer surface), daily briefings.

### Install / embed (partially exists)

`app/api/install/verify`, installation wizard APIs — extend under `app/api/install/` and `app/api/embed/`.

---

## Mandatory development rule

**Before implementing any new feature**, explicitly answer all four questions below. State the answers in the implementation plan or PR description. **If any question cannot be answered, pause implementation** until the architecture decision is made.

Architecture decisions come **before** implementation decisions. Never place new functionality into existing folders simply because they already exist.

### 1. Which layer does this belong to?

- [ ] **Platform Admin** — internal Aipify Group AS operations; manages all tenants
- [ ] **Customer App** — product customers buy and log into; one tenant per session
- [ ] **Embedded Installation** — runs inside the customer's website or admin system

### 2. Who is the user?

- [ ] **Aipify Internal Staff** (`super_admin`, `platform_admin`, `platform_support`)
- [ ] **Customer Owner** (`owner`)
- [ ] **Customer Team Member** (`admin`, `support`, `staff`, `read_only`)
- [ ] **Embedded End User** — operator inside the customer's CMS, store admin, or site (role mapped from host system)

### 3. What isolation level is required?

- [ ] **Global** — cross-tenant; platform tables and admin checks only
- [ ] **Tenant** — scoped by `tenant_id` / `customer_id` / `company_id` on every read and write
- [ ] **Installation** — scoped by installation token, domain, license limits, and allowed modules

### 4. Where should the code live?

Use this repo's paths (`app/`, not `src/app/`):

| Layer | Routes | Components | Logic | Types | Services |
|-------|--------|------------|-------|-------|----------|
| **Platform** | `app/platform/` | `components/platform/` | `lib/platform/` | `types/platform/` | `services/platform/` |
| **Customer** | `app/app/` | `components/app/` | `lib/app/` | `types/app/` | `services/app/` |
| **Embedded** | `app/api/install/`, `app/api/embed/` | `components/embed/` | `lib/install/`, `lib/embed/` | `types/install/` | `services/install/` |

Shared cross-layer code: `lib/core/`, `services/core/`, `types/core/`, `components/shared/`, `components/ui/`.

### After the decision

1. Create files **only** in the chosen layer's folders (see tables above).
2. Reuse `lib/core/` and `components/shared/` for shared behavior — do not duplicate.
3. Enforce tenant or installation isolation for Customer App and Embedded layers.
4. Update this document if you introduce a new top-level area.

---

## References

- [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) — non-negotiable identity, mission, human control, privacy, core package
- [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) — agent governance, escalation, learning, presence, skills checklist
- Spec: `docs/cursor/AIPIFY-CORE-FOUNDATION.txt`
- Spec: `docs/cursor/AIPIFY-PRODUCT-ARCHITECTURE-SEPARATION.txt`
- Spec: `docs/cursor/AIPIFY-OPERATING-PRINCIPLES.txt`
- Spec: `docs/cursor/AIPIFY-SKILL-PLACEMENT-RULES.txt`
- [SKILL_ENGINE.md](./SKILL_ENGINE.md) — central skill registry and metadata
- Skill placement: `lib/core/skills/`
- Layer helpers: `lib/core/layers.ts`
- Plan limits: `lib/core/plans.ts`
- Customer nav: `lib/app/nav-config.ts`
