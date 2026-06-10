# Aipify Install Engine

**Phase 17 · Version 1.0 · Critical**

The Install Engine connects Aipify to customer systems, understands environments, recommends skills, and configures a safe supervised starting point.

**Prerequisites:** [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) · [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [SKILL_ENGINE.md](./SKILL_ENGINE.md)

**Code:** `lib/install/` · APIs: `app/api/install/`, `app/api/installations/`

---

## 1. Mission

- Connect Aipify to customer systems
- Understand the customer's environment
- Discover operational workflows
- Recommend relevant skills
- Configure a safe starting point
- Begin a supervised learning phase

**Goal:** Reduce onboarding friction. Installing Aipify should feel like onboarding a capable operations assistant — not configuring another complicated platform.

---

## 2. Installation workflow (10 steps)

| Step | ID | Layer |
|------|-----|-------|
| 1 | `create_account` | Platform |
| 2 | `select_plan` | Customer |
| 3 | `register_domains` | Customer |
| 4 | `connect_systems` | Customer |
| 5 | `environment_discovery` | Embedded |
| 6 | `recommend_skills` | Shared |
| 7 | `customer_approval` | Customer |
| 8 | `activate` | Embedded |
| 9 | `learning_phase` | Shared |
| 10 | `first_executive_briefing` | Customer |

Constants: `INSTALL_WORKFLOW_STEPS` in `lib/install/engine.ts`.

The existing 7-step customer wizard (`lib/platform/installation-engine.ts`) maps to steps 3–8 during Layer 2 migration.

---

## 3. Environment discovery

Aipify identifies:

- Business type (SaaS, e-commerce, membership, consulting, etc.)
- Operational workflows (support, billing, onboarding, …)
- Connected services (Shopify, Stripe, Supabase, …)
- Automation opportunities and support needs
- Skill recommendations

**Code:** `lib/install/discovery.ts` · **API:** `POST /api/install/discover`

---

## 4. Human validation (§9)

Aipify never assumes complete accuracy. Present findings and ask:

> *"Have we understood your business correctly?"*

Users may **approve**, **modify**, or **reject**.

**API:** `POST /api/install/validate-discovery` · **UI:** `DiscoveryValidationPanel`

---

## 5. Domain management & plan enforcement

Every installation requires approved domains. Plan limits reuse `lib/core/plans.ts`:

| Plan | Domains | Installations |
|------|---------|---------------|
| Starter | 1 | 1 |
| Growth | 3 | 3 |
| Business | 10 | 10 |
| Enterprise | Custom | Custom |

**Code:** `getPlanInstallLimits()` in `lib/install/engine.ts`

---

## 6. Install tokens & heartbeat

Each installation receives: Installation ID, token, tenant ID, domain registration, activation status, heartbeat schedule.

**Embedded heartbeat statuses:** `healthy` · `warning` · `disconnected` · `pending_update` · `paused`

**API:** `POST /api/install/heartbeat` · **Client:** `lib/embed/heartbeat.ts`

Default interval: 15 minutes (`DEFAULT_HEARTBEAT_INTERVAL_MINUTES`).

---

## 7. Learning phase

Default duration: **30 days** (`LEARNING_PHASE_DAYS`).

Purpose: observe workflows, evaluate recommendations, improve relevance. No aggressive automation during this period — learning remains supervised.

**Customer UI:** `/app/learning`

---

## 8. Install health score

Maturity dimensions (0–100 each):

- Connectivity
- Skill adoption
- Support effectiveness
- Recommendation acceptance
- Operational stability

**Code:** `computeInstallMaturityScore()` in `lib/install/health.ts`

---

## 9. Architecture placement (§18)

| Layer | Responsibility | Paths |
|-------|----------------|-------|
| **Platform Admin** | Supported integrations, templates, global metrics | `app/platform/install-engine/`, `app/platform/installations/` |
| **Customer App** | Wizard, connections, domains, learning, skill recommendations | `app/app/connections/`, `app/app/learning/`, `app/app/installations/` |
| **Embedded** | Context scanner, heartbeat, discovery | `lib/embed/`, `app/api/install/` |

---

## 10. Security principles

- Only approved domains may activate installations
- Tenant isolation is mandatory
- Minimize installation permissions
- No unnecessary sensitive data collection
- Explicit consent before elevated capabilities

---

## 11. Rollout order (§21)

1. Aipify internal systems
2. Unonight pilot
3. Limited external beta
4. Public availability

Constants: `INSTALL_ROLLOUT_STAGES` in `lib/install/engine.ts`

---

## 12. Success criteria

A new customer should:

- Complete installation quickly
- Understand recommended skills
- Feel confident during onboarding
- Receive value within days
- Require minimal manual setup

---

## 13. Related installation skills

Registered in `lib/core/skills/installation/`:

`workflow-discovery` · `integration-detection` · `domain-validation` · `health-scanning` · `system-mapping` · `configuration-assessment` · `improvement-recommendations`
