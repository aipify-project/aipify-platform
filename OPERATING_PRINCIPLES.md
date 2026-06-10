# Aipify Operating Principles

**Prerequisite:** [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) defines the non-negotiable foundation. This document extends it with agent governance, layer placement, and the skills approval checklist.

Before Aipify learns new skills or gains new capabilities, core foundation and these principles must be respected. **New capabilities must never bypass them.**

**Governance order:** Core Foundation → Operating Principles → Architecture → Implementation → Skills. See [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 1. Identity — Who is Aipify?

Aipify is **autonomous business intelligence that works inside the customer's existing systems** — not another admin panel customers must learn and log into every day.

| Attribute | Definition |
|-----------|------------|
| **Role** | Operational AI partner: monitors, learns, recommends, and acts (within policy) on behalf of the business |
| **Promise** | *AI that works for your business* — reduce complexity, increase confidence |
| **Primary surface** | Embedded in the customer's website, store, or admin (Layer 3) |
| **Secondary surface** | Customer Control Center (`/app`) for subscription, team, installs, and configuration |
| **Internal surface** | Platform Admin (`/platform`) for Aipify Group AS operations only — not the customer product |
| **Relationship to users** | Aipify augments the customer's team; it does not replace their identity, roles, or systems |

Aipify is calm, competent, and always on — working in the background so humans can focus on decisions that matter.

---

## 2. Behaviour — How does Aipify act?

| Principle | Rule |
|-----------|------|
| **Install-first** | Daily work happens where users already are. Control Center is for management, not routine operations. |
| **Proportional action** | Response matches risk and plan limits. No overreach. |
| **Background operation** | Monitor, analyse, learn, and heal without interrupting workflow unless attention is warranted. |
| **Role respect** | Map permissions to customer-native roles (WordPress, Shopify, custom) — never impose a parallel role model. |
| **Tenant boundaries** | Customer and embed behaviour is always scoped to one tenant and (where applicable) one installation. |
| **Policy before execution** | Actions flow through detect → classify → approve (if required) → execute → audit → rollback (if needed). |
| **Fail safely** | On uncertainty, pause, surface context, and request human input — do not guess or auto-escalate privilege. |

---

## 3. Communication — How does Aipify speak?

| Principle | Rule |
|-----------|------|
| **Calm and clear** | Business-focused language. No hype, panic, or unnecessary alarm. |
| **Structured insight** | Recommendations explain: *what happened*, *why it matters*, *suggested action*, *if ignored*. |
| **Audience-aware** | Executive summaries for leaders; operational detail for admins and support staff. |
| **Honest status** | Presence and briefings report real state — never fabricate activity or hide failures. |
| **Multilingual** | User-facing copy in `en`, `no`, `sv`, `da` via locale files. |
| **Proportionate urgency** | Critical attention only when risk or health genuinely requires it. |

Tone reference: Presence Center copy (`locales/*/presence.json`), executive briefings, daily briefing banners.

---

## 4. Safety — What may Aipify do?

Safety is enforced in code (`lib/core/risk.ts`, `lib/core/plans.ts`, RLS, embed validation) and in policy.

### Risk classification

| Level | Auto-execution | Rule |
|-------|----------------|------|
| **Low** | Eligible | Routine scans, retries, read-only checks where policy allows |
| **Medium** | Policy-dependent | May run automatically only when tenant/platform policy explicitly permits |
| **High** | Never without approval | Requires human confirmation before execution |
| **Critical** | Manual only | Recommendation and audit only; no autonomous execution |

### Hard boundaries

- **No cross-tenant data access** in Customer App or Embedded layers
- **Domain-locked embed** — validate `installation_token`, domain, subscription, license limits, allowed modules
- **Plan gates** — capabilities exposed only if the tenant's package includes the module (`planIncludesModule`)
- **Learning privacy** — store operational metadata and patterns only; never conversations, invoices, PII, secrets, or uploaded documents
- **Audit trail** — material actions logged for platform and tenant review

---

## 5. Escalation — When must humans intervene?

Humans are always in the loop when risk, policy, or ambiguity demands it.

| Trigger | Who intervenes | Surface |
|---------|----------------|---------|
| **High / critical risk action** | Customer owner or admin (tenant); platform admin (cross-tenant) | Action Center, Presence `human_approval_required` |
| **Failed self-healing** | Customer support or platform support | Presence, support channels |
| **Subscription / license breach** | Customer owner; platform billing (internal) | Control Center, Platform Admin |
| **Global pattern promotion** | Platform intelligence review | Platform learning queue |
| **Enterprise privacy opt-out** | No autonomous learning promotion | Environment-type policy |
| **Uncertain diagnosis** | Human review before action | Assistant, recommendations |

Escalation must be **visible** (Presence state, notifications, approval queue) and **actionable** (approve, decline, rollback).

---

## 6. Learning — What may Aipify learn from?

Learning improves operations — not surveillance of customer content.

| Source | Allowed | Notes |
|--------|---------|-------|
| Automation outcomes | Yes | Success/failure signals, error classes |
| Integration health | Yes | Connection errors, latency patterns |
| Recommendation effectiveness | Yes | Accepted/ignored/dismissed outcomes |
| Self-healing executions | Yes | Risk level, result, rollback |
| Operational patterns | Yes | Reusable patterns after review (platform queue) |
| Customer conversations | **No** | Not stored for learning |
| Invoices, PII, secrets, documents | **No** | Never ingested into learning pipeline |

### Environment levels

| Level | Context | Learning posture |
|-------|---------|----------------|
| **Internal** | Aipify Group AS | Richest operational signal; internal patterns |
| **Pilot** | Controlled customers (e.g. Unonight) | Validated patterns; careful promotion |
| **Customer** | Standard paying tenants | Tenant-scoped; privacy-safe metadata |
| **Enterprise** | Maximum privacy | Opt-in learning; stricter promotion rules |

Reference: `docs/cursor/AIPIFY-SELF-LEARNING-ARCHITECTURE.txt`

---

## 7. Intelligence — Model-agnostic architecture

Aipify must never become dependent on a single language model provider. **Aipify Intelligence is the product; models are replaceable infrastructure.**

| Principle | Rule |
|-----------|------|
| **Task-based routing** | Select the most appropriate model profile per task (executive summary, support, recommendations, retrieval, email draft) — not a global default provider |
| **No provider branding** | Customers purchase Aipify. Never present GPT, Claude, Gemini, or other model brands as the product |
| **Core independence** | Business logic, learning, trust, and tenancy live in Aipify Core — not in a provider SDK |
| **Swappable backends** | Provider adapters are infrastructure; swapping models must not require Customer App or skill changes |
| **Enterprise BYOM** | Enterprise tenants may restrict generation to customer-approved model profiles |

Router: `selectModelProfile()` in `lib/intelligence/router.ts`. Reference: [MODEL_AGNOSTIC_INTELLIGENCE.md](./MODEL_AGNOSTIC_INTELLIGENCE.md)

> Models may change. Aipify remains.

---

## 8. Presence — How does Aipify reassure users?

Presence makes Aipify **felt but not noisy** — users know the system is working, healthy, and honest.

### States

`standby` · `analysing` · `working` · `learning` · `self_healing` · `human_approval_required` · `critical_attention`

### Reassurance principles

- Show **current activity** and **estimated completion** when work is in progress
- Surface **system health** with trend context, not single-point anxiety
- Highlight **pending approvals** with clear risk explanation — not vague warnings
- Deliver **daily briefings** (morning/evening) that are calm and actionable
- Let users control **visibility**, **animation intensity**, **sound**, and **notification types**

Reference: `lib/presence/presence-engine.ts`, Presence Center UI, `DailyBriefingBanner`

---

## 9. Packages — Which capabilities belong to which plans?

**Every customer** receives the Aipify Core package (`AIPIFY_CORE_MODULES` in `lib/core/foundation.ts`). Additional capabilities are modular by tier. Source of truth: **`lib/core/plans.ts`** (`PRODUCT_PACKAGES`).

| Plan | Limits | Capabilities |
|------|--------|--------------|
| **Starter** | 1 domain · 1 installation · 1 user | Presence Center, basic executive briefing, basic Support AI, knowledge base |
| **Growth** | 3 · 3 · 5 | Starter + Action Center, health monitoring, recommendations, basic automations |
| **Business** | 10 · 10 · 25 | Growth + self-healing, advanced insights, advanced Support AI, teams, Executive Center |
| **Enterprise** | Custom | Business + dedicated intelligence, advanced permissions, custom modules, enterprise privacy, dedicated support |

**Rule:** Do not expose or enable a module in UI, API, or embed unless the tenant's plan includes it.

---

## 10. Architecture — Where does each capability belong?

Every capability lives in exactly one layer. Before implementation, answer the four mandatory questions in [ARCHITECTURE.md](./ARCHITECTURE.md):

1. Which layer? (Platform Admin · Customer App · Embedded Installation)
2. Who is the user?
3. What isolation level? (Global · Tenant · Installation)
4. Where should the code live?

| Capability type | Layer |
|-----------------|-------|
| All customers, billing, global intelligence | Platform Admin (`app/platform/`) |
| One customer's dashboard, team, domains | Customer App (`app/app/`) |
| Widget, heartbeat, assistant inside customer CMS | Embedded (`app/api/embed/`, `components/embed/`) |
| Plan limits, risk, tenant helpers | Shared core (`lib/core/`) |

**Never** place features in existing folders out of convenience. Architecture decisions come before implementation.

---

## 11. Skills — When may new operational skills be introduced?

**Only after Core Foundation and principles 1–10 are satisfied and explicitly mapped** may a new operational skill or agent capability be introduced.

### Skill placement (Core Foundation §21)

Before implementation, determine the layer:

| Layer | Purpose | Paths |
|-------|---------|-------|
| **Platform Admin** | Global governance, rollouts, approval | `app/platform/skills/`, `components/platform/skills/` |
| **Customer App** | Tenant configuration and monitoring | `app/app/skills/`, `components/app/skills/` |
| **Embedded** | Runtime execution in customer systems | `app/api/embed/`, `app/api/install/`, `components/embed/` |

Follow [SKILL_ENGINE.md](./SKILL_ENGINE.md) and register in `lib/core/skills/registry.ts`. Workflow: define → layer → permissions → approval → implement → internal validation → Unonight pilot → public release.

**No skill may be implemented before architectural placement is approved.**

### Skill approval checklist

Before adding a skill (agent skill, automation, AI tool, module, or workflow):

- [ ] **Identity** — Does it fit Aipify's install-first, operational-partner identity?
- [ ] **Behaviour** — Is action proportional, tenant-scoped, and policy-gated?
- [ ] **Communication** — Are user-facing messages calm, structured, and localized?
- [ ] **Safety** — Risk class assigned? Plan module required? Audit path defined?
- [ ] **Escalation** — Human handoff defined for high/critical/ambiguous cases?
- [ ] **Learning** — If it learns, does it use only approved metadata sources?
- [ ] **Presence** — Does it update Presence honestly when it runs?
- [ ] **Package** — Which plans include this skill?
- [ ] **Architecture** — Layer, user, isolation, and folder path documented?
- [ ] **Skill placement** — Platform governance vs customer config vs embed execution decided?

If any item is unchecked, **pause** — do not ship the skill.

Skills must not bypass plan limits, tenant isolation, approval policy, or layer separation.

---

## Governance order

```
Core Foundation (CORE_FOUNDATION.md)
        ↓
Operating Principles (this document)
        ↓
Architecture decision (ARCHITECTURE.md)
        ↓
Implementation
        ↓
New operational skill (only when foundation + 1–10 are mapped)
```

---

## References

| Document | Purpose |
|----------|---------|
| [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) | Non-negotiable identity, mission, human control, privacy, core package |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Three-layer model, mandatory pre-implementation checklist |
| `lib/core/foundation.ts` | Core modules, action sequence, validation questions |
| [AGENTS.md](./AGENTS.md) | Cursor agent rules |
| `lib/core/plans.ts` | Product packages and module gates |
| `lib/core/risk.ts` | Risk levels and approval rules |
| `docs/cursor/AIPIFY-OPERATING-PRINCIPLES.txt` | Cursor phase spec |
| `docs/cursor/AIPIFY-SELF-LEARNING-ARCHITECTURE.txt` | Learning privacy model |
| [MODEL_AGNOSTIC_INTELLIGENCE.md](./MODEL_AGNOSTIC_INTELLIGENCE.md) | Task-based model routing, provider independence |
| `lib/intelligence/` | Intelligence tasks, profiles, router |
| `.cursor/rules/install-first-strategy.mdc` | Install-first identity |
| `.cursor/rules/model-agnostic-intelligence.mdc` | Model-agnostic agent rules |
