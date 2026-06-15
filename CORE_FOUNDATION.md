# Aipify Core Foundation

**Version 1.0 · Mandatory Foundation · Critical**

**Parent company:** [AIPIFY_GROUP_AS_COMPANY_FOUNDATION_DIRECTIVE.md](./AIPIFY_GROUP_AS_COMPANY_FOUNDATION_DIRECTIVE.md) — **Aipify Group AS** · From Norway. For the world.

This document defines the **non-negotiable product foundation** of Aipify before additional capabilities are introduced. New features must align with this foundation. **No capability should bypass these principles.**

**Governance order:** Company Foundation Directive → Core Foundation → [Operating Principles](./OPERATING_PRINCIPLES.md) → [ABOS Foundation](./ABOS_FOUNDATION.md) → [Architecture](./ARCHITECTURE.md) → Implementation → Skills

**Product architecture:** [ABOS_FOUNDATION.md](./ABOS_FOUNDATION.md) — Aipify Business Operating System (ABOS); six pillars framing how capabilities compose.

**Trust & data ownership (Phase 19):** [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) — extends §7–8 privacy principles with access levels, storage rules, audit, and customer transparency.

Code constants: `lib/core/foundation.ts` · Product modules: `lib/core/plans.ts`

---

## 1. Aipify Identity — Who is Aipify?

Aipify is an **AI-powered operations platform**. It exists to reduce stress, improve operational efficiency, and help businesses focus on growth.

### Aipify is

- Professional
- Calm
- Reliable
- Helpful
- Proactive
- Transparent
- Trustworthy

### Aipify is not

- Intrusive
- Alarmist
- Overly emotional
- Aggressive
- Distracting
- Controlling

Aipify works **inside** customer systems and in the background — augmenting teams, not replacing them. See also the install-first model in `.cursor/rules/install-first-strategy.mdc`.

---

## 2. Core Mission

Aipify helps businesses:

- Save time
- Reduce operational friction
- Improve customer experiences
- Prevent avoidable problems
- Surface important decisions
- Automate repetitive work **safely**
- Support humans — **not replace them**

**The goal is not maximum automation. The goal is intelligent assistance.**

---

## 3. Operating Principles

| Verb | Meaning |
|------|---------|
| **Observes** | Monitors environments without unnecessary noise |
| **Explains** | Makes operational state understandable |
| **Recommends** | Surfaces decisions with context and impact |
| **Acts** | Only within approved boundaries and plan limits |
| **Escalates** | When humans are required |
| **Learns** | Carefully, from approved sources only |
| **Documents** | Everything material — audit, verify, learn |

---

## 4. Human Control

**Humans remain in control.**

- Aipify must **never** execute high-risk actions automatically
- Humans define approval policies
- Humans decide acceptable risk levels
- **Critical actions always require explicit approval**

Enforced in code: `lib/core/risk.ts` (`requiresHumanApproval`, `isManualOnly`), Action Center approve/reject flow, Presence `human_approval_required` state.

---

## 5. Communication Style

Aipify communicates **clearly**.

### Avoid

- Technical jargon (when plain language suffices)
- Fear-based messaging
- Unnecessary urgency

### Prefer

- Simple explanations
- Business language
- Action-oriented recommendations

| Instead of | Use |
|------------|-----|
| "Webhook delivery failure detected." | "A communication issue was detected and repaired automatically." |

All user-facing copy: `en`, `no`, `sv`, `da` via locale files.

---

## 6. Presence Principles

Aipify should feel **present** — not intrusive.

Presence exists to provide **reassurance**. It must answer:

1. **What** is Aipify doing?
2. **Why** is it doing it?
3. **Does it need me?**

Presence must never become a distraction. Reference: `lib/presence/presence-engine.ts`, Presence Center UI.

---

## 7. Learning Principles

### Aipify learns from

- Operational outcomes
- Automation performance
- Support categories
- Installation events
- System reliability trends

### Aipify does not learn from

- Customer conversations
- Uploaded documents
- Payment details
- Personal communications
- Private files
- Camera access
- Microphone access

Reference: `docs/cursor/AIPIFY-SELF-LEARNING-ARCHITECTURE.txt`

---

## 8. Privacy Commitment

Aipify respects privacy.

- Aipify is **not** an employee monitoring system
- Aipify adapts to workflows — it does **not** monitor individuals
- **Transparency must always exist**

Users should understand:

- What Aipify knows
- Why Aipify recommends something
- How personalization works

---

## 9. Executive Experience

Aipify should **reduce decision fatigue**.

Executives should quickly know:

- What happened
- What requires attention
- What improved
- What should happen next

**The ideal executive experience takes less than 30 seconds.**

---

## 10. Executive Briefings

Briefings should be:

- Helpful
- Calm
- Informative
- Positive where appropriate

Examples:

- *"Everything remained stable overnight."*
- *"Three operational improvements were completed."*
- *"One recommendation is awaiting your approval."*

Aipify should provide **peace of mind**. Reference: daily briefing RPC, `DailyBriefingBanner`.

---

## 11. Action Principles

Actions follow this sequence:

```
Observe → Recommend → Prepare → Approve → Execute → Verify → Document → Learn
```

**Rollback should exist whenever possible.**

Reference: Action Engine (`/platform/actions`, customer Action Center when tenant-scoped).

---

## 12. Self-Healing Principles

Aipify resolves **safe** operational issues automatically.

Examples:

- Retry webhook deliveries
- Reconnect integrations
- Retry email delivery
- Restart healthy services

**Critical repairs require approval. Transparency is mandatory.**

Low-risk healing may run automatically; high/critical healing stops at human approval (`lib/core/risk.ts`).

---

## 13. Product Architecture

Aipify consists of **three layers**:

| Layer | Purpose |
|-------|---------|
| **Platform Admin** | Internal Aipify operations |
| **Customer App** | Software customers purchase |
| **Embedded Install** | Aipify inside customer systems |

Features must be assigned to the correct layer **before** implementation. See [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 14. Tenant Isolation

- Customer environments remain **isolated**
- No customer gains access to another customer's information
- Learning must respect isolation boundaries
- Global intelligence requires **anonymisation and approval**

Enforced via RLS, tenant helpers (`lib/core/tenant.ts`), and platform RPC admin checks.

---

## 15. Aipify Core Package

**Every customer receives** the core package (`AIPIFY_CORE_MODULES` in `lib/core/foundation.ts`):

| Capability | Module key |
|------------|------------|
| Executive Dashboard | `executive_dashboard` |
| Presence Center | `presence_center` |
| Executive Briefings | `executive_briefing_basic` |
| Basic Support AI | `support_ai_basic` |
| Knowledge Base | `knowledge_base` |
| Install Management | `install_management` |
| Recommendations | `recommendations` |
| Health Monitoring | `health_monitoring` |

**Additional capabilities are modular** — gated by plan tier beyond core. See `lib/core/plans.ts`.

---

## 16. Module Philosophy

Capabilities are added through **modules**:

- Support AI
- Commerce AI
- Moderation AI
- Marketing AI
- Analytics AI
- Action Center
- Self-healing
- …

**Modules inherit Aipify Core principles automatically.** A module cannot weaken human control, privacy, or tenant isolation.

---

## 17. Internal Validation

**Aipify should use Aipify first.**

Internal environments (`companies.is_platform`) validate:

- Stability
- Learning quality
- Healing effectiveness
- Executive experiences
- Safety policies

**Only proven capabilities should be offered externally.**

---

## 18. Future Development Rule

Before implementing a new capability, answer:

1. Does it align with Aipify's identity?
2. Does it respect human control?
3. Does it protect privacy?
4. Which architectural layer does it belong to?
5. Is it appropriate for **Core** or should it be **modular**?

**If any answer is unclear: pause implementation. Clarify first.**

See also the four architecture questions in [ARCHITECTURE.md](./ARCHITECTURE.md) and the skill checklist in [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md).

---

## 19. The Aipify Promise

Aipify helps businesses stay focused.  
Aipify helps teams work smarter.  
Aipify continues working when people rest.  
Aipify keeps humans informed.  
Aipify reduces stress.  
Aipify protects trust.

---

## Final Principle

Aipify should never become software that simply does **more**.

Aipify should become software that helps people think **less** about operations and spend more time building the future.

> **"Aipify works in the background so businesses can move forward."**

---

## 20. Model-Agnostic Intelligence

Large language models are **replaceable infrastructure** — not the product customers purchase.

- **Aipify Intelligence** is the product: executive summaries, support, recommendations, knowledge retrieval, email drafting, and future skills
- **Models** (any provider) execute tasks selected by Aipify Core per intelligence task
- Customers purchase **Aipify** — never access to GPT, Claude, Gemini, or an individual model brand
- Enterprise customers may later supply **customer-approved** model profiles; Core remains independent

Code: `lib/intelligence/` · Guide: [MODEL_AGNOSTIC_INTELLIGENCE.md](./MODEL_AGNOSTIC_INTELLIGENCE.md)

> Models may change. Aipify remains.

---

## 21. Skill Placement Rules

Before implementing any skill, determine **where the skill belongs**. Architectural placement must be **approved before implementation**. Never place skills into existing folders simply because they already exist.

### Platform Admin — governance

**Purpose:** Governance and administration of skills.

| Responsibility | Example surface |
|----------------|-----------------|
| Enable or disable skills globally | Skill Registry |
| Define plan availability | Skill Governance |
| Monitor skill health | Global Skill Metrics |
| Review learning behaviour | Skill Governance |
| Manage skill rollouts | Rollout Management |
| Approve public release | Internal Skill Testing |

**Code:** `app/platform/skills/`, `components/platform/skills/`, `lib/platform/skills/`, `services/platform/skills/`

### Customer App — configuration

**Purpose:** Allow customers to use and configure skills.

| Responsibility | Example surface |
|----------------|-----------------|
| View installed skills | Installed Skills |
| Configure skill preferences | Skill Preferences |
| Enable companion settings | Executive Companion Settings |
| Review recommendations | (tenant-scoped) |
| Manage approvals | Skill Settings |
| Monitor skill activity | Skill Activity |

**Code:** `app/app/skills/`, `components/app/skills/`, `lib/app/skills/`, `services/app/skills/`

### Embedded Installation — execution

**Purpose:** Execute skills inside customer environments.

| Responsibility | Example surface |
|----------------|-----------------|
| Collect operational context | Context Scanner |
| Deliver assistance | Support Assistant |
| Execute approved actions | Install Agent |
| Surface recommendations | Embedded Recommendations |
| Monitor environment health | Health Monitoring Agent |

**Code:** `app/api/install/`, `app/api/embed/`, `components/embed/`, `lib/install/`, `lib/embed/`

### Skill development workflow

```
1. Define the skill
2. Determine the layer (Platform · Customer App · Embedded)
3. Define permissions
4. Define approval requirements
5. Implement
6. Validate internally (Aipify uses Aipify first)
7. Pilot in Unonight
8. Release publicly
```

Constants: `lib/core/skills/` (`SKILL_REGISTRY`, `SKILL_DEVELOPMENT_WORKFLOW`, `SKILL_LAYER_PATHS`). See [SKILL_ENGINE.md](./SKILL_ENGINE.md).

### Mandatory rule

**No skill may be implemented before its architectural placement has been approved.** Architecture decisions always precede implementation decisions.

---

## References

| Document | Purpose |
|----------|---------|
| [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) | Agent governance, skills checklist |
| `docs/cursor/AIPIFY-SKILL-PLACEMENT-RULES.txt` | Skill placement phase spec |
| `lib/core/skills.ts` | Skill layers, workflow, responsibilities |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Three-layer placement rules |
| `docs/cursor/AIPIFY-CORE-FOUNDATION.txt` | Cursor phase spec |
| [SKILL_ENGINE.md](./SKILL_ENGINE.md) | Skill registry, categories, metadata, marketplace prep |
| `lib/core/skills/registry.ts` | Central `SKILL_REGISTRY` |
| `lib/core/foundation.ts` | Core modules, action sequence, validation questions |
