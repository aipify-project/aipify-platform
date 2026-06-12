# Aipify Business Operating System (ABOS)

**Version 1.0 · Product Architecture · Canonical**

This document defines **ABOS** — the product architecture framing for Aipify. ABOS is not an AI chatbot. It is the **operational layer** that connects existing business systems, surfaces what matters, and helps organizations run with clarity, control, and continuity.

**Governance order:** [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) → [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) → **ABOS (this document)** → [ARCHITECTURE.md](./ARCHITECTURE.md) → Implementation → Skills

**Related:** [DEVELOPMENT_PRIORITY_ROADMAP.md](./DEVELOPMENT_PRIORITY_ROADMAP.md) · [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md) · [INTERNAL_LANGUAGE_MODEL.md](./INTERNAL_LANGUAGE_MODEL.md)

ILM corpus: `aipify-core/knowledge/internal-language-model/abos-foundation.txt` · Code: `lib/internal-language-model/abos-vocabulary.ts`

---

## 1. What is ABOS?

**Aipify Business Operating System (ABOS)** is the coordinated product architecture for how Aipify operates inside customer organizations.

| ABOS is | ABOS is not |
|---------|-------------|
| An operational layer connecting existing systems | A replacement for ERP, CRM, or helpdesk software |
| Install-first intelligence where teams already work | A daily-login admin panel customers must adopt |
| Assistance, automation, and governance with human control | An autonomous agent that runs the company |
| A structured set of engines under six pillars | A single chatbot interface |

Artificial Intelligence is a **technology** Aipify uses. **ABOS** is the **product architecture** — how capabilities compose into a business operating system.

> Aipify works in the background so businesses can move forward.

---

## 2. Six pillars

ABOS organizes Aipify capabilities into six pillars. Each pillar maps to implemented repo phases and planned work.

| Pillar | Purpose | Representative phases |
|--------|---------|----------------------|
| **Knowledge** | Trusted, approved information for people and AI | A.5 KC · A.34 Org Memory · BDE · EKE · Learning Engine |
| **Assistance** | Human-centered help across admin, support, and personal work | A.6 · A.7 · A.12 · PAME · LifeOS · RSI · A.76 Self Love (planned) |
| **Automation** | Safe, approved execution of repeatable work | A.3 Secure AI Actions · AEF · ASO · Install Engine |
| **Intelligence** | Explainable insights, recommendations, and strategic context | A.16 · A.31 · A.35 · A.44 · DSE · Learning Engine |
| **Governance** | Permissions, policies, audit, trust, and compliance | A.2 · A.4 · A.14 · A.29 · Trust & Action · License Center |
| **Operations** | Day-to-day operational visibility, integrations, and health | A.8 · A.9 · A.13 · A.19 · A.22 · A.32 · A.75 Org & Workspace |

### Pillar detail

**Knowledge** — Organizations need one place for approved documentation, FAQs, business DNA, employee knowledge, and organizational memory. Knowledge powers Support AI, Admin Assistant, and every explainable recommendation. Raw customer content is never stored without approval.

**Assistance** — Aipify augments administrators, support staff, and individual users through assistants that understand context — not command syntax. Assistance includes operational modules (admin, support) and personal companion capabilities (memory, life, relationships, identity). **Self Love Engine™ (A.76, planned)** is a core ABOS assistance capability: Aipify maintains its own operational wellbeing — quality checks, health narratives, and gentle recovery guidance — so the platform can better support others.

**Automation** — Repetitive, reversible work may run within approved boundaries. High-risk and critical actions require explicit human approval. Automation never bypasses governance or tenant isolation.

**Intelligence** — Analytics, executive insights, strategic intelligence, and decision support provide explainable recommendations. Intelligence informs; humans decide.

**Governance** — Roles, permissions, audit logs, action policies, license capacity, and compliance readiness ensure every capability operates within defined trust boundaries.

**Operations** — Integrations, operations dashboards, install runtime, observability, and quality monitoring connect ABOS to real business environments. Install-first delivery is the primary operations surface.

---

## 3. Pillar → phase mapping

Full mapping of ABOS pillars to A-phases and related engines in this repository.

| Pillar | Phase / engine | Document |
|--------|----------------|----------|
| **Knowledge** | A.5 Knowledge Center Engine | [KNOWLEDGE_CENTER_ENGINE_PHASE_A5.md](./KNOWLEDGE_CENTER_ENGINE_PHASE_A5.md) |
| | A.34 Organizational Memory Engine | [ORGANIZATIONAL_MEMORY_ENGINE_PHASE_A34.md](./ORGANIZATIONAL_MEMORY_ENGINE_PHASE_A34.md) |
| | Business DNA Engine (BDE) | [BUSINESS_DNA_ENGINE.md](./BUSINESS_DNA_ENGINE.md) |
| | Employee Knowledge Engine (EKE) | [EMPLOYEE_KNOWLEDGE_ENGINE.md](./EMPLOYEE_KNOWLEDGE_ENGINE.md) |
| | Learning Engine (Phase 29) | [LEARNING_ENGINE.md](./LEARNING_ENGINE.md) |
| **Assistance** | A.6 Admin Assistant Engine | [ADMIN_ASSISTANT_ENGINE_PHASE_A6.md](./ADMIN_ASSISTANT_ENGINE_PHASE_A6.md) |
| | A.7 Support AI Engine | [SUPPORT_AI_ENGINE_PHASE_A7.md](./SUPPORT_AI_ENGINE_PHASE_A7.md) |
| | A.12 Aipify Self-Support Engine | [AIPIFY_SELF_SUPPORT_ENGINE_PHASE_A12.md](./AIPIFY_SELF_SUPPORT_ENGINE_PHASE_A12.md) |
| | Personal Assistant Memory (PAME) | [ASSISTANT_MEMORY_ENGINE.md](./ASSISTANT_MEMORY_ENGINE.md) |
| | LifeOS · RSI · Identity · Context · GDE · TAG · DSE | Companion assistant modules under `/app/assistant/*` |
| | A.78 Relationship Intelligence Engine (organizational) | [RELATIONSHIP_INTELLIGENCE_ENGINE.md](./RELATIONSHIP_INTELLIGENCE_ENGINE.md) — tenant-level; distinct from personal RSI |
| | **A.76 Self Love Engine™ (planned)** | Roadmap — [DEVELOPMENT_PRIORITY_ROADMAP.md](./DEVELOPMENT_PRIORITY_ROADMAP.md) |
| **Automation** | A.3 Secure AI Action Engine | [SECURE_AI_ACTION_ENGINE_PHASE_A3.md](./SECURE_AI_ACTION_ENGINE_PHASE_A3.md) |
| | Autonomous Execution Framework (AEF) | [AUTONOMOUS_EXECUTION_FRAMEWORK.md](./AUTONOMOUS_EXECUTION_FRAMEWORK.md) |
| | Autonomous Support Operations (ASO) | [AUTONOMOUS_SUPPORT_OPERATIONS.md](./AUTONOMOUS_SUPPORT_OPERATIONS.md) |
| | Install Engine (Phase 17 / A.22) | [INSTALL_ENGINE.md](./INSTALL_ENGINE.md) · [AIPIFY_INSTALL_ENGINE_PHASE_A22.md](./AIPIFY_INSTALL_ENGINE_PHASE_A22.md) |
| **Intelligence** | A.16 Analytics & Insights Engine | [ANALYTICS_INSIGHTS_ENGINE_PHASE_A16.md](./ANALYTICS_INSIGHTS_ENGINE_PHASE_A16.md) |
| | A.31 Strategic Intelligence Foundation | [STRATEGIC_INTELLIGENCE_FOUNDATION_ENGINE_PHASE_A31.md](./STRATEGIC_INTELLIGENCE_FOUNDATION_ENGINE_PHASE_A31.md) |
| | A.35 Executive Insights Engine | [EXECUTIVE_INSIGHTS_ENGINE_PHASE_A35.md](./EXECUTIVE_INSIGHTS_ENGINE_PHASE_A35.md) |
| | A.44 Industry Intelligence Foundation | [INDUSTRY_INTELLIGENCE_FOUNDATION_ENGINE_PHASE_A44.md](./INDUSTRY_INTELLIGENCE_FOUNDATION_ENGINE_PHASE_A44.md) |
| | Decision Support Engine (DSE) | [DECISION_SUPPORT_ENGINE.md](./DECISION_SUPPORT_ENGINE.md) |
| **Governance** | A.2 Identity, Roles & Permission Engine | [IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md](./IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md) |
| | A.4 Audit Log & Accountability Engine | [AUDIT_ACCOUNTABILITY_ENGINE_PHASE_A4.md](./AUDIT_ACCOUNTABILITY_ENGINE_PHASE_A4.md) |
| | A.14 Governance & Policy Engine | [GOVERNANCE_POLICY_ENGINE_PHASE_A14.md](./GOVERNANCE_POLICY_ENGINE_PHASE_A14.md) |
| | A.29 Compliance & Regulatory Readiness | [COMPLIANCE_REGULATORY_READINESS_ENGINE_PHASE_A29.md](./COMPLIANCE_REGULATORY_READINESS_ENGINE_PHASE_A29.md) |
| | Trust & Action Engine (Phase 30) | [TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md) |
| | License & Trust Center (Phase 20) | [LICENSE_CENTER.md](./LICENSE_CENTER.md) |
| **Operations** | A.8 Integration Engine | [INTEGRATION_ENGINE_PHASE_A8.md](./INTEGRATION_ENGINE_PHASE_A8.md) |
| | A.9 Operations Dashboard Engine | [OPERATIONS_DASHBOARD_ENGINE_PHASE_A9.md](./OPERATIONS_DASHBOARD_ENGINE_PHASE_A9.md) |
| | A.13 Quality Guardian Engine | [QUALITY_GUARDIAN_ENGINE_PHASE_A13.md](./QUALITY_GUARDIAN_ENGINE_PHASE_A13.md) |
| | A.19 Observability & Platform Health | [OBSERVABILITY_PLATFORM_HEALTH_ENGINE_PHASE_A19.md](./OBSERVABILITY_PLATFORM_HEALTH_ENGINE_PHASE_A19.md) |
| | A.32 Operations Center Foundation | [OPERATIONS_CENTER_FOUNDATION_ENGINE_PHASE_A32.md](./OPERATIONS_CENTER_FOUNDATION_ENGINE_PHASE_A32.md) |
| | A.75 Organization & Workspace Engine | [ORGANIZATION_WORKSPACE_ENGINE_PHASE_A75.md](./ORGANIZATION_WORKSPACE_ENGINE_PHASE_A75.md) |

Foundation phases A.1 (Multi-Tenant) underpin all pillars.

---

## 4. Self Love within ABOS

**Self Love Engine™** is a planned core ABOS capability (Phase **A.76**). It is not a separate product — it is how ABOS maintains operational wellbeing.

Self Love covers:

- Quality and health monitoring narratives (extends A.13, A.19)
- Knowledge Center–integrated maintenance guidance (A.5)
- Positive, non-alarmist communication when Aipify needs attention
- Human approval gates for any recovery action above low risk (A.3)

Partial overlap exists today in Quality Guardian and Observability engines. A dedicated A.76 phase will unify Self Love as an ABOS assistance pillar capability.

> Because systems that take care of themselves are better equipped to take care of others.

---

## 5. Design principles

These principles apply to every ABOS pillar and every new capability.

1. **Install-first** — Primary daily use happens inside the customer's existing system, not a separate login workflow.
2. **Human control** — Critical actions require explicit approval; high-risk automation is prohibited for AI.
3. **Not a chatbot** — Natural language is an interface; the product is operational intelligence across pillars.
4. **Connect, don't replace** — ABOS integrates with existing tools; it does not force rip-and-replace.
5. **Transparency** — Explain what Aipify is doing, why, and whether human input is needed.
6. **Metadata-first privacy** — Store patterns and outcomes, not raw customer records, unless explicitly approved.
7. **Augment people** — Support employees and customers; never impersonate or replace human judgment.
8. **Tenant isolation** — Every query and action scoped to one organization; no cross-tenant leakage.
9. **Aipify as product name** — Prefer "Aipify Business Operating System (ABOS)" over "AI Business Operating System." See [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md).
10. **Modular growth** — Pillars compose; customers license modules they need.

---

## 6. Install-first and ABOS

ABOS is designed for **install-first delivery**:

| Surface | Role in ABOS |
|---------|--------------|
| Customer's admin (WordPress, Shopify, custom) | Primary operations — support, assistant, embedded modules |
| Aipify Control Center (`/app/*`) | Management — billing, team, install, governance, settings |
| Platform Admin (`/platform/*`) | Aipify Group AS internal SaaS operations only |

The Install Engine (Embedded layer) discovers context, validates domains, and activates capabilities inside customer environments. ABOS pillars reach users where they already work.

See `.cursor/rules/install-first-strategy.mdc` and [INSTALL_ENGINE.md](./INSTALL_ENGINE.md).

---

## 7. Long-term vision

ABOS evolves toward a complete business operating system:

- **Stable foundation** — Multi-tenant architecture, governance, knowledge, and secure actions (Phases A.1–A.14, A.75)
- **Operational maturity** — Self Love (A.76), workspace isolation, and unified operations centers
- **Enterprise readiness** — Compliance, deployment, device rollout, partner ecosystem
- **Commerce intelligence** — Phases 100–104 when foundation is stable (see roadmap)
- **Continuous learning** — Assisted and adaptive learning with human approval; organizational memory that improves recommendations without storing prohibited content

Aipify becomes the intelligent layer **above** existing systems — calm, professional, and trustworthy.

Reference: [AIPIFY_MANIFESTO_FOUNDING_VISION_PHASE99.md](./AIPIFY_MANIFESTO_FOUNDING_VISION_PHASE99.md) · [DEVELOPMENT_PRIORITY_ROADMAP.md](./DEVELOPMENT_PRIORITY_ROADMAP.md)

---

## 8. Knowledge Center

FAQ (10 items): `content/knowledge/aipify/abos/faq/abos-foundation-faq.md`

Required articles (ABOS Brand Terminology Standard):

- `content/knowledge/aipify/abos/articles/what-is-abos.md`
- `content/knowledge/aipify/abos/articles/understanding-self-love.md`
- `content/knowledge/aipify/abos/articles/how-aipify-assists-organizations.md`
- `content/knowledge/aipify/abos/articles/governance-and-approvals.md`
- `content/knowledge/aipify/abos/articles/security-principles.md`

Terminology standard: [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md)

Category seed: migration `20260919000000_abos_foundation_knowledge_seed.sql`

---

## 9. Implementation surfaces

| Surface | ABOS role |
|---------|-----------|
| Customer App `/app/*` | Pillar dashboards, assistants, approvals, settings |
| Embedded `/api/install/*`, `/api/embed/*` | Install-first operational delivery |
| Platform `/platform/*` | Global governance — never customer daily workspace |
| ILM `lib/internal-language-model/` | Preferred ABOS phrasing in assistant and system copy |
| Marketing & KC | Consistent "Aipify Business Operating System (ABOS)" positioning |

---

## References

| Document | Purpose |
|----------|---------|
| [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) | Non-negotiable identity, human control, privacy |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Three-layer placement rules |
| [DEVELOPMENT_PRIORITY_ROADMAP.md](./DEVELOPMENT_PRIORITY_ROADMAP.md) | Build order and phase alignment |
| [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md) | Aipify naming — not generic AI |
| [INTERNAL_LANGUAGE_MODEL.md](./INTERNAL_LANGUAGE_MODEL.md) | ILM corpus and detection |
| [INSTALL_ENGINE.md](./INSTALL_ENGINE.md) | Install-first runtime |
