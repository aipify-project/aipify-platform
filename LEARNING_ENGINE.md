# Aipify Learning Engine

**Phase 29 · Critical priority**

Controlled, transparent learning that improves Aipify over time while customers remain in control.

**Prerequisites:** [CUSTOMER_APP.md](./CUSTOMER_APP.md) · [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) · [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md)

**Code:** `lib/learning/` · `components/app/learning/` · migration `20260611700000_learning_engine_phase29.sql`

---

## Core principle

> Aipify learns **WITH** the customer — not **FROM** the customer.

Customers always know what was learned, why, how to disable learning, and how to remove individual learnings.

---

## Learning modes

| Mode | Behaviour |
|------|-----------|
| **Disabled** | No adaptation. Predefined rules only. Recommended for regulated industries. |
| **Assisted** (default) | Observes patterns, suggests improvements, learns only after human approval. |
| **Adaptive** | Automatic adaptation within approved boundaries (tone, timing, frequency). Requires explicit consent. |

---

## Allowed learning sources

Metadata only — never raw customer content:

- Approved recommendations, automations, responses
- Skill health outcomes
- Recommendation acceptance
- User preferences
- Notification engagement
- Support resolution outcomes

**Never stored:** sensitive PII, raw email, private conversations, payment data, secrets, confidential records.

---

## Customer route

| Route | Purpose |
|-------|---------|
| `/app/learning` | Learning Review Center — modes, recent learnings, suggestions, approval history, remove/disable |

---

## Core RPCs

| RPC | Purpose |
|-----|---------|
| `get_customer_learning_center()` | Learning Review Center bundle |
| `update_customer_learning_settings()` | Set mode + adaptive consent |
| `remove_customer_learning_memory()` | Customer removes a learning |
| `record_customer_learning_memory()` | Record approved pattern (Core) |
| `get_platform_learning_governance()` | Platform Admin policies & rollout |

`perform_customer_recommendation_action()` records learning memory on approve (Phase 29).

---

## Platform governance

Platform Admin manages learning at `/platform/intelligence/learning-queue`:

- Learning policies per environment (`platform_learning_policies`)
- Rollout: Internal → Unonight Pilot → Beta → GA
- Global safeguards (human approval, no content storage, tenant isolation)

---

## Unonight pilot

Seed learning memory and pilot policy (`pilot_unonight`) validate explanation engine and review UX before beta rollout.

---

## Principle

> Intelligence without learning becomes repetitive. Learning without trust becomes dangerous. Aipify must achieve both.
