# Aipify Architecture Review & Stabilization

**Phase 23 · Review date: June 2026 · Status: Complete**

This document is the internal architecture audit for Phases 1–22. It classifies what exists today, flags layer drift, and defines cleanup priorities **without deleting functionality**.

**Repo convention:** Paths use `app/`, `lib/`, `components/` at project root — **not** `src/app/` (spec references to `src/` map to root paths here).

**Governance references:** [ARCHITECTURE.md](./ARCHITECTURE.md) · [layer-ownership rule](./.cursor/rules/layer-ownership.mdc) · Phases 17–22 engine docs

---

## Executive summary

Aipify has a **sound three-layer foundation** with clear separation intent. Phases 17–22 added Install Engine, Update Engine, Trust Architecture, License Center, Impact Metrics, and SkillOS with consistent patterns (migration + `lib/` module + platform/customer surfaces + cursor rules).

**Strengths**

- Platform Admin (`/platform/*`) is predominantly internal Aipify Group operations
- Customer App canonical routes (`/app/*`) and Install Engine APIs (`/api/install/*`, `/api/embed/*`) are established
- Shared Core (`lib/core/`) centralises plans, risk, skills registry, tenant helpers
- SkillOS, Trust, License, Update, and Impact layers have dedicated tables and RPCs
- `proxy.ts` replaces deprecated Edge `middleware.ts` (Vercel stability)

**Primary risks**

1. **Dual customer shell** — `/dashboard/*` (legacy nav) and `/app/*` (canonical nav) run in parallel; most `/app` links still alias to `/dashboard`
2. **Platform sidebar length** — 18 top-level items; needs grouping before more modules
3. **Naming collisions** — “Executive”, “Support”, “Automations” exist in Platform and Customer contexts with different meanings
4. **Legacy metrics tables** — `support_cases`, `activity_logs` store operational metadata; must not hold chat/email content (trust review)
5. **Empty service layers** — `services/platform/`, `services/app/`, `services/core/` are stubs; logic still lives in `lib/` and route handlers
6. **Install API split** — `/api/install/*` (runtime) vs `/api/installations/*` (wizard/admin); both are Install Engine but path inconsistency may confuse contributors

**Verdict:** Architecture is **ready for the next customer-facing product phase** after completing Layer 2 migration (`/dashboard` → `/app`) and sidebar grouping. No WRONG LAYER blockers found that require emergency moves.

---

## 1. Layer classification legend

| Status | Meaning |
|--------|---------|
| **CORRECT** | Matches approved layer today |
| **SHOULD MOVE LATER** | Acceptable now; planned migration documented |
| **WRONG LAYER** | Violates separation; needs move (none marked urgent) |
| **NEEDS REVIEW** | Ambiguous naming, dual purpose, or trust boundary to watch |

---

## 2. Route classification

### Platform Admin (`/platform/*`)

| Route | File | Layer | Status | Notes |
|-------|------|-------|--------|-------|
| `/platform` | `app/platform/page.tsx` | Platform Admin | CORRECT | Internal overview |
| `/platform/executive` | `app/platform/executive/page.tsx` | Platform Admin | NEEDS REVIEW | Cross-tenant business executive — not customer Executive Dashboard; rename clarity later |
| `/platform/customers` | `app/platform/customers/page.tsx` | Platform Admin | CORRECT | Tenant administration |
| `/platform/customers/[id]` | `app/platform/customers/[id]/page.tsx` | Platform Admin | NEEDS REVIEW | CRM workspace; must stay metadata-only per Trust Architecture |
| `/platform/subscriptions` | `app/platform/subscriptions/page.tsx` | Platform Admin | CORRECT | |
| `/platform/billing` | `app/platform/billing/page.tsx` | Platform Admin | CORRECT | Platform billing ops |
| `/platform/invoices` | `app/platform/invoices/page.tsx` | Platform Admin | CORRECT | |
| `/platform/payment-providers` | `app/platform/payment-providers/page.tsx` | Platform Admin | CORRECT | Was missing from sidebar nav — **fixed Phase 23** |
| `/platform/installations` | `app/platform/installations/page.tsx` | Platform Admin | CORRECT | Cross-tenant install overview |
| `/platform/install-engine` | `app/platform/install-engine/page.tsx` | Platform Admin | CORRECT | Orchestration UI (not runtime) |
| `/platform/updates` | `app/platform/updates/page.tsx` | Platform Admin | CORRECT | Update Engine governance |
| `/platform/updates/[id]` | `app/platform/updates/[id]/page.tsx` | Platform Admin | CORRECT | |
| `/platform/trust` | `app/platform/trust/page.tsx` | Platform Admin | CORRECT | Trust governance |
| `/platform/impact` | `app/platform/impact/page.tsx` | Platform Admin | CORRECT | Anonymised impact only |
| `/platform/metrics` | `app/platform/metrics/page.tsx` | Platform Admin | CORRECT | MRR/subscription KPIs |
| `/platform/stats` | `app/platform/stats/page.tsx` | Platform Admin | CORRECT | Redirects to `/platform/metrics` |
| `/platform/support` | `app/platform/support/page.tsx` | Platform Admin | NEEDS REVIEW | Internal support queue; `support_cases.subject` — no chat body storage |
| `/platform/automations` | `app/platform/automations/page.tsx` | Platform Admin | NEEDS REVIEW | `platform_automations` — internal ops automations, not customer automations |
| `/platform/intelligence/*` | `app/platform/intelligence/**` | Platform Admin | CORRECT | Brain, learning queue, patterns, self-healing, audit |
| `/platform/actions/*` | `app/platform/actions/**` | Platform Admin | CORRECT | Cross-tenant action governance |
| `/platform/skills` | `app/platform/skills/page.tsx` | Platform Admin | CORRECT | SkillOS governance |
| `/platform/system` | `app/platform/system/page.tsx` | Platform Admin | CORRECT | System status |

### Customer App (`/app/*` and legacy `/dashboard/*`)

| Route | File | Layer | Status | Notes |
|-------|------|-------|--------|-------|
| `/app` | `app/app/[[...slug]]/page.tsx` | Customer App | SHOULD MOVE LATER | Redirects to `/dashboard` via aliases |
| `/app/skills` | `app/app/skills/page.tsx` | Customer App | CORRECT | SkillOS workspace |
| `/app/license` | `app/app/license/page.tsx` | Customer App | CORRECT | Trust & License Center |
| `/app/connections` | `app/app/connections/page.tsx` | Customer App | CORRECT | Install connections |
| `/app/learning` | `app/app/learning/page.tsx` | Customer App | CORRECT | Learning phase |
| `/app/settings/security` | `app/app/settings/security/page.tsx` | Customer App | CORRECT | Security Dashboard |
| `/app/settings/updates` | `app/app/settings/updates/page.tsx` | Customer App | CORRECT | Read-only update visibility |
| `/dashboard` | `app/dashboard/page.tsx` | Customer App | SHOULD MOVE LATER | Legacy overview — canonical target `/app` |
| `/dashboard/assistant` | `app/dashboard/assistant/page.tsx` | Customer App | SHOULD MOVE LATER | Move to `app/app/assistant/` |
| `/dashboard/support` | `app/dashboard/support/page.tsx` | Customer App | SHOULD MOVE LATER | Customer Support AI surface |
| `/dashboard/billing` | `app/dashboard/billing/page.tsx` | Customer App | CORRECT | Billing view (also under legacy path) |
| `/dashboard/license` | `app/dashboard/license/page.tsx` | Customer App | SHOULD MOVE LATER | Alias of `/app/license` |
| `/dashboard/settings/*` | `app/dashboard/settings/**` | Customer App | SHOULD MOVE LATER | |
| `/dashboard/team` | `app/dashboard/team/page.tsx` | Customer App | SHOULD MOVE LATER | |
| `/dashboard/installs` | `app/dashboard/installs/page.tsx` | Customer App | SHOULD MOVE LATER | Installations |
| `/dashboard/analytics` | `app/dashboard/analytics/page.tsx` | Customer App | SHOULD MOVE LATER | |
| `/dashboard/commerce` | `app/dashboard/commerce/page.tsx` | Customer App | SHOULD MOVE LATER | |
| `/dashboard/notifications` | `app/dashboard/notifications/page.tsx` | Customer App | SHOULD MOVE LATER | |

**Customer App gaps (nav targets without dedicated `/app` pages yet)**

| Expected feature | Nav href | Current resolution | Status |
|------------------|----------|-------------------|--------|
| Presence Center | `/app/presence` | Alias → `/dashboard` | SHOULD MOVE LATER |
| Customer Actions | `/app/actions` | Alias → `/dashboard` | SHOULD MOVE LATER |
| Recommendations | `/app/recommendations` | Alias → `/dashboard` | SHOULD MOVE LATER |
| Domains | `/app/domains` | Alias → `/dashboard/installs` | SHOULD MOVE LATER |
| Executive Dashboard | (not in nav yet) | Only `/platform/executive` exists | SHOULD MOVE LATER — build `/app/executive` |
| Customer Automations | (not in nav) | Platform has `/platform/automations` | SHOULD MOVE LATER — separate customer automations |

### Install Engine APIs

| Route | File | Layer | Status | Notes |
|-------|------|-------|--------|-------|
| `/api/install/heartbeat` | `app/api/install/heartbeat/route.ts` | Install Engine | CORRECT | |
| `/api/install/discover` | `app/api/install/discover/route.ts` | Install Engine | CORRECT | |
| `/api/install/verify` | `app/api/install/verify/route.ts` | Install Engine | CORRECT | |
| `/api/install/version` | `app/api/install/version/route.ts` | Install Engine | CORRECT | Update reporting |
| `/api/install/update-status` | `app/api/install/update-status/route.ts` | Install Engine | CORRECT | |
| `/api/install/metric-event` | `app/api/install/metric-event/route.ts` | Install Engine | CORRECT | Impact metrics |
| `/api/install/skill-health` | `app/api/install/skill-health/route.ts` | Install Engine | CORRECT | SkillOS health |
| `/api/install/validate-discovery` | `app/api/install/validate-discovery/route.ts` | Install Engine | CORRECT | |
| `/api/installations/*` | `app/api/installations/**` | Install Engine | NEEDS REVIEW | Wizard/admin APIs — same layer, different prefix |
| `/api/embed/assistant` | `app/api/embed/assistant/route.ts` | Embedded Aipify | CORRECT | |

### Platform Admin APIs (`/api/platform/*`)

| Route | Layer | Status |
|-------|-------|--------|
| `/api/platform/actions/*` | Platform Admin | CORRECT |
| `/api/platform/customers/[id]/*` | Platform Admin | NEEDS REVIEW — intelligence/timeline; metadata only |
| `/api/platform/impact/marketing-proof` | Platform Admin | CORRECT |
| `/api/platform/executive/monthly-report` | Platform Admin | CORRECT |
| `/api/platform/invoices/[id]/actions` | Platform Admin | CORRECT |
| `/api/platform/intelligence/patterns/[id]/review` | Platform Admin | CORRECT |
| `/api/platform/learning` | Platform Admin | CORRECT |

### Customer APIs (legacy prefix)

| Route | Layer | Status | Notes |
|-------|-------|--------|-------|
| `/api/dashboard/domains` | Customer App | SHOULD MOVE LATER | Rename to `/api/app/domains` |
| `/api/dashboard/onboarding` | Customer App | SHOULD MOVE LATER | Rename to `/api/app/onboarding` |

### Auth / marketing (Shared)

| Route | Layer | Status |
|-------|-------|--------|
| `/`, `/login`, `/register`, `/forgot-password`, `/reset-password` | Shared | CORRECT |
| `/api/webhooks/payment` | Shared Core | CORRECT |

---

## 3. Component classification

| Path | Layer | Status | Notes |
|------|-------|--------|-------|
| `components/platform/*` | Platform Admin | CORRECT | 50+ panels; executive, customers, intelligence, actions, skills, impact |
| `components/app/*` | Customer App | CORRECT | license, trust, skills, install-engine, settings, update-engine |
| `components/embed/*` | Embedded Aipify | CORRECT | Assistant, presence, recommendation shells |
| `components/dashboard/*` | Customer App (shared shell) | NEEDS REVIEW | Used by **both** `/dashboard` and `/app` layouts — acceptable shared shell, not platform |
| `components/branding/*` | Shared | CORRECT | |
| `components/shared/*` | Shared | CORRECT | Stub — underused |
| `components/ui/*` | Shared | CORRECT | |
| `components/auth/*` | Shared | CORRECT | |
| `components/presence/*` | Customer App + Shared | CORRECT | Presence engine UI |

**Platform components that touch customer data (watch list)**

- `CustomerDetailView`, `CustomerMasterDetailView`, `CustomerActivityTimeline` — Platform Admin CRM; **metadata and aggregates only**
- `PlatformSupportPanel` — lists `support_cases`; subjects only, no message bodies in schema
- `PlatformExecutiveCenterPanel` — platform business KPIs, not tenant operational inbox

---

## 4. Library & services classification

### Shared Core (`lib/core/`)

| Module | Purpose | Status |
|--------|---------|--------|
| `lib/core/plans.ts` | Plan limits, module gating | CORRECT |
| `lib/core/risk.ts` | Risk classification | CORRECT |
| `lib/core/tenant.ts` | Tenant utilities | CORRECT |
| `lib/core/presence.ts` | Presence states | CORRECT |
| `lib/core/layers.ts` | Layer path helpers | CORRECT — updated to include `/api/installations` |
| `lib/core/skills/` | Skill registry (33 skills) | CORRECT |

### Domain engines (cross-referenced, not duplicated logic)

| Module | Layer ownership | Status |
|--------|-----------------|--------|
| `lib/install/`, `lib/embed/` | Install Engine | CORRECT |
| `lib/trust/` | Shared + Trust rules | CORRECT |
| `lib/update/` | Shared + Platform rollout | CORRECT |
| `lib/license/` | Shared + Customer UI | CORRECT |
| `lib/impact/` | Shared + Platform aggregates | CORRECT |
| `lib/skillos/` | Shared + Platform/Customer/Install | CORRECT |
| `lib/platform/*` | Platform Admin | CORRECT |
| `lib/app/*` | Customer App | CORRECT — thin; many labels only |

### Duplication flags (SHOULD MOVE LATER — consolidate, not delete)

| Area | Locations | Action |
|------|-----------|--------|
| Customer navigation | `lib/dashboard/nav-config.ts` vs `lib/app/nav-config.ts` | Unify on `lib/app/nav-config.ts` when migration completes |
| License types/helpers | `lib/platform/license.ts` vs `lib/license/` | Platform uses domain types; customer uses Phase 20 engine — document boundary |
| Action engine naming | `lib/platform/action-engine.ts` vs skill `action-engine` | Different purposes; add comment cross-links |
| Metrics | `lib/platform/metrics-dashboard.ts` vs `lib/impact/` | Platform KPIs vs anonymised impact — **keep separate** (CORRECT) |

### Services layer

| Path | Status |
|------|--------|
| `services/platform/`, `services/app/`, `services/install/`, `services/core/` | NEEDS REVIEW | Empty stubs — extract orchestration from API routes in future phase |

### Types layer

| Path | Status |
|------|--------|
| `types/platform/`, `types/app/`, `types/install/`, `types/core/` | CORRECT | Re-export pattern established |

---

## 5. SkillOS verification (Phase 22)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| `skills` table | ✅ | `20260610900000_skillos_phase22.sql` |
| `skill_versions` | ✅ | |
| `tenant_skills` | ✅ | |
| `skill_permissions` | ✅ | |
| `skill_health` | ✅ | |
| `skill_events` | ✅ | |
| `skill_audit_logs` | ✅ | |
| Code registry (33 skills) | ✅ | `lib/core/skills/registry.ts` |
| Platform governance UI | ✅ | `/platform/skills` + `PlatformSkillOSPanel` |
| Customer workspace UI | ✅ | `/app/skills` + `CustomerSkillOSPanel` |
| Install health API | ✅ | `/api/install/skill-health` |
| Learning modes | ✅ | `disabled` / `assisted` / `adaptive` |
| Rollout pipeline | ✅ | Documented in RPC + `lib/skillos/lifecycle.ts` |
| Marketplace UI | ✅ Not built (per spec) | DB seeds only |

**Flag:** Code registry and DB `skills` table are **not auto-synced** — SHOULD MOVE LATER: sync job or seed RPC from registry.

---

## 6. Trust Architecture verification (Phase 19)

| Rule | Status | Notes |
|------|--------|-------|
| Customer owns operational data | CORRECT | Documented in Trust + License Center |
| `trust_audit_events` immutable | CORRECT | Trigger blocks update/delete |
| Platform avoids customer content | NEEDS REVIEW | `support_cases.subject`, `activity_logs.details` jsonb — audit contents |
| Anonymised impact only for marketing | CORRECT | Phase 21 `anonymised_metric_events` — counts only |
| Security Dashboard (customer) | CORRECT | `/app/settings/security` |
| Embed validation | CORRECT | `lib/embed/validation.ts` |

---

## 7. License & payment state verification (Phase 20)

| State | Where | Status |
|-------|-------|--------|
| `active` | `subscriptions.status`, `license_service_status` | CORRECT |
| `trialing` | `subscriptions.status` | CORRECT |
| `past_due` / `overdue` | `subscriptions.status`, `customers.status` | CORRECT — dual fields |
| `grace_period` | `license_service_status` | CORRECT |
| `paused` | `license_service_status`, `subscriptions.status` | CORRECT |
| `cancelled` | `subscriptions.status`, `customers.status` | CORRECT |
| 3-day grace | `PAYMENT_GRACE_PERIOD_DAYS` in `lib/license/` | CORRECT |
| Pause preserves data | `assert_license_capacity`, docs | CORRECT |
| Billing + License Center when paused | Customer routes exist | CORRECT |

---

## 8. Update System verification (Phase 18)

| Requirement | Status |
|-------------|--------|
| `platform_updates`, `platform_update_targets` | ✅ |
| `platform_update_audit_log` | ✅ |
| Version tracking | ✅ `lib/embed/version.ts` |
| Rollback structure | ✅ `lib/update/rollback.ts` |
| Migration approval rules | ✅ `lib/update/safety.ts` |
| Customer read-only updates | ✅ `/app/settings/updates` |
| Install version reporting | ✅ `/api/install/version` |
| Silent data modification forbidden | ✅ Documented + safety checks |

---

## 9. Database review

### Tenant isolation (customer-owned records)

Tables with `customer_id` / `tenant_id` / `company_id` include: `customers`, `subscriptions`, `invoices`, `installations`, `tenant_skills`, `trust_audit_events`, `anonymised_metric_events`, `usage_statistics`, `support_cases`, `activity_logs`, `customer_recommendations`, `presence_*`, `platform_actions` (tenant-scoped actions), and others.

**Status:** CORRECT pattern — customer records are keyed by tenant.

### Engine tables (by phase)

| Phase | Tables | Status |
|-------|--------|--------|
| 17 Install | `installations`, `installation_integrations`, `customer_onboarding`, … | CORRECT |
| 18 Update | `platform_updates`, `platform_update_targets`, `platform_update_audit_log` | CORRECT |
| 19 Trust | `trust_audit_events` | CORRECT |
| 20 License | `subscriptions` extensions, `license_checks` | CORRECT |
| 21 Impact | `anonymised_metric_events`, `impact_audit_log` | CORRECT |
| 22 SkillOS | 7 skill tables | CORRECT |

### Sensitivity watch list

| Table | Risk | Status |
|-------|------|--------|
| `support_cases` | `subject` text | NEEDS REVIEW — ensure no email/chat bodies |
| `activity_logs` | `details` jsonb | NEEDS REVIEW — enforce allowlist in writers |
| `customer_timeline` | event descriptions | NEEDS REVIEW — platform CRM view |
| `ai_learning_events` | learning inputs | NEEDS REVIEW — must align with `lib/trust/learning.ts` allowlist |
| `anonymised_metric_events` | counts only | CORRECT |
| `global_patterns` | aggregated | CORRECT |

### Scalability notes

- **CORRECT:** Reusable engine tables vs one-off patterns
- **SHOULD MOVE LATER:** Sync `skills` DB from code registry
- **SHOULD MOVE LATER:** Consider archiving strategy for `skill_events`, `impact_audit_log`, `trust_audit_events` at scale
- **NEEDS REVIEW:** `platform_automations` naming vs future customer `tenant_automations`

---

## 10. UI / sidebar review

| Shell | Nav items | Status | Recommendation |
|-------|-----------|--------|----------------|
| Platform Admin | 18 (+ sub-navs for Intelligence, Actions) | NEEDS REVIEW | Group into: **Commercial**, **Operations**, **Intelligence**, **Governance** |
| Customer App (canonical) | 12 in `lib/app/nav-config.ts` | CORRECT | Simpler than platform — good |
| Customer App (legacy) | 10 in `lib/dashboard/nav-config.ts` | SHOULD MOVE LATER | Missing presence, skills — retire after migration |
| Embedded | Minimal embed shell | CORRECT | |

---

## 11. What is correct (keep as-is)

- Three-layer route prefixes: `/platform`, `/app`, `/api/install`, `/api/embed`
- Phase 17–22 engine docs, cursor rules, and migration numbering
- `proxy.ts` session auth (Node runtime)
- Separate `/platform/metrics` (business KPIs) vs `/platform/impact` (anonymised proof)
- Skill registry in code + SkillOS persistence
- Trust immutable audit + License Center transparency
- Update safety and rollback documentation
- i18n en/no/sv/da across platform and customer surfaces

---

## 12. Should move later (migration plan — do not delete)

### Priority A — Customer App canonicalisation

1. Move pages from `app/dashboard/*` → `app/app/*` one module at a time
2. Update `APP_ROUTE_ALIASES` — remove entries as pages migrate
3. Retire `lib/dashboard/nav-config.ts`; use `lib/app/nav-config.ts` everywhere
4. Add missing pages: `/app/presence`, `/app/actions`, `/app/recommendations`, `/app/domains`, `/app/executive`
5. Rename `/api/dashboard/*` → `/api/app/*`

### Priority B — Platform clarity

1. Rename or subtitle `/platform/executive` → “Platform Executive” to avoid customer confusion
2. Rename `/platform/automations` labels → “Internal Automations” in i18n
3. Group Platform sidebar (commercial / ops / intelligence / governance)
4. Add SkillOS registry ↔ DB sync

### Priority C — Install Engine path consistency

1. Document `/api/installations/*` as Install Engine “admin/wizard” surface
2. Optional: alias under `/api/install/wizard/*` for single prefix

### Priority D — Services extraction

1. Move orchestration from fat API routes into `services/platform/`, `services/app/`

---

## 13. Wrong layer (none urgent)

No routes were classified **WRONG LAYER** requiring immediate relocation. Ambiguity is primarily **naming** and **incomplete migration**, not fundamental misplacement.

---

## 14. Immediate fixes completed (Phase 23)

| Fix | File | Why |
|-----|------|-----|
| Added Payment Providers to Platform sidebar | `lib/platform/nav-config.ts` | Route existed but was not in `PLATFORM_ADMIN_NAV` |
| Extended layer detection for installations API | `lib/core/layers.ts` | `/api/installations` is Install Engine |
| Created this review | `ARCHITECTURE_REVIEW.md` | Phase 23 deliverable |

---

## 15. Recommended next phase

**Phase 24 — Customer App Migration & Shell Unification**

1. Complete `/dashboard` → `/app` page migration (start with presence, support, billing — already partially live)
2. Build customer Executive Dashboard at `/app/executive` (distinct from `/platform/executive`)
3. Group Platform Admin sidebar
4. SkillOS registry ↔ database sync
5. Audit `activity_logs.details` and `support_cases` writers for Trust allowlist

**Do not start:** new Skills, Klarna, live customer system integrations, or marketplace UI until Phase 24 migration milestones are met.

---

## 16. Where future features belong

| Feature type | Owner |
|--------------|-------|
| Cross-tenant billing, rollouts, audit | **Platform Admin** |
| Customer workflows, skills, settings | **Customer App** |
| Heartbeat, discovery, health, install tokens | **Install Engine** |
| Embed assistant, presence in host site | **Embedded Aipify** |
| Plans, risk, registry constants | **Shared Core** |
| New Skill runtime state | **SkillOS** tables + layer UI |

Declare **Feature owner** before implementation ([layer-ownership rule](./.cursor/rules/layer-ownership.mdc)).

---

## Final principle

Aipify must scale through structure, not chaos. This review confirms the foundation is **separated enough to proceed**, with a clear migration path for the remaining `/dashboard` legacy shell.

*Review performed without deleting functionality, without new features, and without risky refactors.*
