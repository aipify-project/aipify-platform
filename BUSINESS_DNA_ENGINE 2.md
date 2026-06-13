# Business DNA Engine (BDE)

**Phase 39 · Business-specific operational intelligence**

Teaches Aipify how each customer's business actually works — products, workflows, templates, tone, and escalation rules. Aipify adapts to the business; the business does not adapt to Aipify.

**Prerequisites:** [INSTALL_ENGINE.md](./INSTALL_ENGINE.md) · [LEARNING_ENGINE.md](./LEARNING_ENGINE.md) · [TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md) · [DECISION_SUPPORT_ENGINE.md](./DECISION_SUPPORT_ENGINE.md)

**Code:** `lib/business-dna-engine/` · migration `20260612700000_business_dna_phase39.sql`

---

## Vision

From *"AI answers questions"* → *"Aipify understands how this business operates."*

---

## Route mapping

| Spec | Aipify route |
|------|----------------|
| `/admin/business-dna` | `/app/settings/business-dna` (Knowledge Approval Center) |

Customer App uses `/app/*` — owner/admin gated in RPCs.

---

## Database tables

| Table | Purpose |
|-------|---------|
| `business_dna_profiles` | Company profile, tone, languages, approval status |
| `bde_settings` | Human review mode, automation, connected systems, email channel |
| `business_products` | Product & service catalog |
| `business_workflows` | How work is handled |
| `support_knowledge_items` | Approved Q&A by category |
| `business_email_templates` | Approved templates with variables |
| `business_tone_profiles` | Tone examples and avoid phrases |
| `business_escalation_rules` | When to escalate |
| `business_knowledge_sources` | Transparent import log |
| `business_template_suggestions` | Learning loop suggestions |
| `business_email_drafts` | Human review drafts |
| `business_dna_audit_logs` | Full audit trail |

---

## Email template priority

1. Approved company template
2. Similar approved knowledge
3. Business tone + profile
4. Professional default

---

## Confidence scoring

| Level | Rule |
|-------|------|
| High | Approved template + verified context |
| Medium | Approved knowledge or approved profile |
| Low | No approved knowledge — escalate |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/business-dna/profile` | GET, PATCH, POST (seed from install) |
| `/api/business-dna/knowledge` | GET, POST |
| `/api/business-dna/templates` | GET, POST |
| `/api/business-dna/templates/[id]` | PATCH (approve) |
| `/api/business-dna/workflows` | GET, POST |
| `/api/business-dna/escalation-rules` | GET, POST |
| `/api/business-dna/health` | GET |
| `/api/support/email/analyze` | POST |
| `/api/support/email/draft` | POST |
| `/api/support/email/send-approved` | POST |

---

## Key RPCs

- `get_customer_business_dna_center()` — dashboard bundle
- `seed_business_dna_from_install()` — Install Engine → DNA
- `analyze_support_email()` / `draft_support_email_response()`
- `calculate_business_dna_health()` — 0–100 automation readiness
- `get_platform_business_dna_overview()` — aggregates only

---

## Integrations

| Engine | Role |
|--------|------|
| Install Engine | Initial discovery → Business DNA |
| Learning Engine | Approved reply patterns only |
| Trust & Action | Send, refund, publish permissions |
| Decision Support | Operational recommendations |
| Support Assistant skill | Uses DNA for customer responses |

---

## i18n

`customerApp.businessDna.*` · `platform.businessDna.*` (en/no/sv/da)
