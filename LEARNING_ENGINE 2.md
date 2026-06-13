# Aipify Learning Engine

**Phase 29 · Critical priority**

Controlled customer learning: Aipify improves over time while customers remain in control.

**Prerequisites:** [CUSTOMER_APP.md](./CUSTOMER_APP.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · Phase 25 self-learning foundation

**Code:** `lib/learning/` · `components/app/learning/` · RPCs in `20260611700000_learning_engine_phase29.sql`

---

## Core principle

**Aipify learns WITH the customer — not FROM the customer.**

Customers choose the learning mode, review what was learned, remove learnings, and disable learning entirely.

---

## Learning modes

| Mode | Behaviour |
|------|-----------|
| **Disabled** | No adaptation. Predefined rules only. For highly regulated industries. |
| **Assisted** (default) | Observes patterns, suggests improvements. Humans approve. Learns approved behaviours. |
| **Adaptive** | Adapts within approved boundaries (tone, timing, frequency, summaries). Requires explicit consent and eligible plan. |

---

## Allowed learning sources

- Approved recommendations, automations, responses
- Skill health outcomes
- Recommendation acceptance
- User preferences (adaptive only)
- Notification engagement (adaptive only)
- Support resolution outcomes

## Forbidden in memory

Sensitive PII, raw email, private conversations, payment data, passwords, auth secrets, confidential business records.

Learning memory stores **metadata only**: pattern type, approval source, confidence, skill key, explanation, timestamps.

---

## Customer Review Center

**Route:** `/app/learning`

**RPC:** `get_customer_learning_center`

Displays recent learnings, suggested improvements, confidence levels, approval history, mode controls, remove/disable actions.

Linked from **Settings** → Learning & privacy.

---

## Platform governance

**Route:** `/platform/intelligence/learning-queue` (governance panel above queue)

**RPC:** `get_learning_governance_overview`

Platform admins manage rollout pipeline (Internal → Unonight → Beta → GA), safeguards, and pilot validation.

---

## Rollout pipeline

1. Aipify Internal
2. Unonight pilot
3. Beta customers
4. General availability

New learning behaviours are validated internally before customer rollout.

---

## Explanation engine

`lib/learning/explanation.ts` and `lib/learning/confidence.ts` provide human-readable confidence and behaviour-change explanations.

Examples:

- "Based on 23 similar approvals, Aipify is highly confident."
- "Aipify noticed that you approve executive summaries before 09:00 and adjusted delivery timing."

---

## Key RPCs

| RPC | Purpose |
|-----|---------|
| `get_customer_learning_center` | Customer Review Center bundle |
| `update_customer_learning_settings` | Mode + adaptive consent |
| `record_customer_learning_memory` | Record approved pattern (metadata only) |
| `remove_customer_learning_memory` | Customer removes a learning |
| `get_learning_governance_overview` | Platform admin governance |
| `perform_customer_recommendation_action` | Records learning on approve |

---

## i18n

- Customer: `locales/{en,no,sv,da}/customerApp.json` → `learning.*`
- Platform: `locales/*/platform.json` → `intelligence.learningGovernance.*`
