# Aipify Enterprise Pricing Philosophy & Commercial Model

**Value-based pricing for the Aipify Business Operating System (ABOS)**

**Feature owner:** Customer App (billing/license transparency); platform overview optional read-only

**Prerequisites:** [COMMERCIAL_PACKAGES.md](./COMMERCIAL_PACKAGES.md) · [LICENSE_CENTER.md](./LICENSE_CENTER.md)

**Code:** `lib/commercial-packages/pricing-philosophy.ts` · migration `20261114000000_enterprise_pricing_philosophy_commercial_model.sql`

**Routes:** `/app/settings/billing` · `/app/license` · `/app/settings/modules`

---

## 1. Purpose

Document and surface Aipify's **value-based pricing philosophy** — Aipify as a **Business Operating System**, not token or chatbot pricing. Recommended prices are **guidance metadata** for sales, partners, and customer transparency. They do **not** override live subscription amounts in `plans` / `subscriptions` or enforcement in `lib/core/plans.ts`.

---

## 2. Core philosophy

Aipify augments people inside the customer's existing systems. Pricing should reflect **operational partnership** — scope, outcomes, and governance — not intelligence consumption meters.

**Principle:** Aipify is priced as a Business Operating System — value follows operational scope, outcomes, and trust governance, not token consumption or chat volume.

---

## 3. Value-based pricing

### Avoid pricing based on

- Per-token or per-message chatbot pricing
- Generic AI API meter billing as the primary product
- Comparing Aipify to consumer chatbot subscriptions
- Usage-only pricing without operational context
- Hidden overage traps on intelligence volume

### Price based on

- **Operational scope** — installs, domains, users, and licensed modules
- **Business outcomes** — support resolution, knowledge retention, workflow automation
- **Governance depth** — approvals, audit, enterprise security, and SLA
- **Implementation and change management** for Enterprise
- **Partner-led consulting** and onboarding via Sales Experts

---

## 4. Target segments

| Segment | Description | Typical plan |
|---------|-------------|--------------|
| **Micro** | Solo entrepreneurs and micro businesses — one install, light support | Starter |
| **Small** | Growing SMBs automating support with Aipify Support | Growth (`growth` / `professional`) |
| **Growth** | Teams with internal processes, employee knowledge, multiple installs | Business |
| **Enterprise** | Large orgs — governance, executive visibility, dedicated success | Enterprise |

---

## 5. Plan guidance (USD monthly — sales guidance)

Growth maps to existing `growth` plan_key and `professional` package_key in Commercial Packages.

| Plan | USD guidance | Included capabilities (Aipify-first naming) |
|------|--------------|-----------------------------------------------|
| **Aipify Starter** | $79–$149 | Aipify Core, Install Engine, Aipify Companion (essential), Aipify Support (FAQ knowledge), Human approval mode, Basic analytics |
| **Aipify Growth** | $199–$399 | Business DNA, Aipify Support (autonomous operations), Workflow Orchestration, Confidence Engine, Proactive Companion, Support dashboards |
| **Aipify Business** | $499–$999 | Employee Knowledge Engine, Role-based knowledge access, Onboarding Companion, Knowledge Health, Internal search, Meeting Companion, Action Center |
| **Aipify Enterprise** | Custom — typically $1,500+ | All Aipify suites, Executive Insights, Advanced security & audit, SLA agreements, Multi-region options, Dedicated Aipify success, Custom workflows & integrations |

Optional add-on: **Aipify Insights** — operational intelligence (see [COMMERCIAL_PACKAGES.md](./COMMERCIAL_PACKAGES.md)).

---

## 6. Enterprise implementation model

Enterprise engagements combine **subscription** with scoped **implementation**:

| Item | Guidance |
|------|----------|
| **NOK range** | NOK 100,000–500,000+ |
| **Scope** | Discovery, integration, governance design, rollout, training |

**Typical services:**

- Discovery and operational mapping
- Install and domain architecture
- Business DNA and knowledge migration
- Governance, approvals, and trust policy design
- Change management and executive briefing
- Training and Sales Expert handoff
- Post-launch optimization review

---

## 7. Sales Expert model

Sales Experts are **independent businesses**. They provide discovery, implementation, training, and advisory services.

**Commercial split:**

- **Aipify subscription:** Customer ↔ Aipify
- **Consulting & implementation:** Customer ↔ Sales Expert

| Service | NOK guidance |
|---------|--------------|
| Discovery meeting & fit assessment | NOK 2,500–5,000 |
| Implementation project (SMB) | NOK 50,000–150,000 |
| Enterprise rollout program | NOK 150,000–500,000+ |
| Training workshop (half day) | NOK 15,000–30,000 |
| Ongoing advisory retainer | NOK 5,000–15,000 / month |

---

## 8. Aipify revenue model

| Stream | Description |
|--------|-------------|
| **Subscription** | Recurring SaaS — Starter, Growth, Business, Enterprise |
| **Implementation** | Enterprise and partner-led rollout (separate from core subscription) |
| **Partner** | Sales Expert and partner ecosystem on qualified relationships |
| **Expansion** | Upgrades as volume, modules, and governance needs grow |

---

## 9. Positioning principle

| Avoid | Prefer |
|-------|--------|
| AI chatbot with per-message pricing | Aipify Business Operating System (ABOS) with modular operational suites |
| Helpdesk AI add-on | Aipify Support — installed operational companion inside your systems |
| Token meter like a generic LLM API | Licensed modules and outcomes — support, knowledge, workflows |
| Consumer AI subscription | Professional operations platform with human approval and audit |

---

## 10. Pricing signal principle

- Customers expect transparent plan scope — modules, limits, and upgrade paths.
- Enterprise buyers expect implementation scoping separate from subscription.
- Sales Experts quote implementation in NOK; Aipify quotes subscription in plan currency.
- No surprise token overages — intelligence volume is part of operational scope.
- Upgrade signals follow usage patterns (support volume, employee knowledge, governance needs).

---

## 11. ABOS principle

Price Aipify as the **Aipify Business Operating System (ABOS)** — an install-first operations layer, not a chat interface. Companions (**Aipify Support**, **Meeting Companion**, **Onboarding Companion**) are product capabilities, not separate AI tools.

See [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md) and [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md).

---

## 12. Vision

- Organizations pay for operational partnership — not for counting messages.
- Value grows as Aipify learns the business and expands across installs.
- Enterprise trust requires governance pricing — not cheapest token rates.
- Sales Experts extend Aipify with human implementation; subscription stays with Aipify.
- Aipify works in the background so businesses can move forward.

---

## 13. Implementation surfaces

| Surface | Content |
|---------|---------|
| `get_customer_billing_center()` | `enterprise_pricing_philosophy` block — owner/admin only |
| `get_customer_license_center()` | `pricing_philosophy_note` — brief read-only note |
| Settings → Billing | Pricing philosophy section (thin client) |
| ILM | `enterprise-pricing-philosophy-commercial-model.txt` |
| KC FAQ | `content/knowledge/aipify/commercial-packages/faq/enterprise-pricing-philosophy-faq.md` |

---

## Cross-references

- [COMMERCIAL_PACKAGES.md](./COMMERCIAL_PACKAGES.md) — modular packages, module gates, billing center
- [LICENSE_CENTER.md](./LICENSE_CENTER.md) — Trust & License Center, grace period, service pause
- [COMMERCIAL_PACKAGES.md § APIs](./COMMERCIAL_PACKAGES.md) — `get_customer_billing_center()`
