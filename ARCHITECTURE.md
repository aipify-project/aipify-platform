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

**UI:** Minimal — Ask Aipify, Recommendations, Activity, Settings.

---

## Shared code

| Concern | Path |
|---------|------|
| UI primitives & brand | `components/ui/`, `components/shared/` |
| Cross-layer logic | `lib/core/`, `services/core/`, `types/core/` |

Shared modules include plan limits, tenant utilities, domain validation, risk classification, and presence states. **Do not duplicate** design components across platform / app / embed — import from `components/shared/`.

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
