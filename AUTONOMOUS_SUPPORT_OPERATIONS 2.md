# Autonomous Support Operations (ASO)

**Phase 40 · Intelligent support operator with human oversight**

Transforms Aipify from a support assistant into a trusted digital support employee — automating repetitive cases while escalating uncertainty and sensitive situations.

**Prerequisites:** [BUSINESS_DNA_ENGINE.md](./BUSINESS_DNA_ENGINE.md) · [TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md) · [LEARNING_ENGINE.md](./LEARNING_ENGINE.md)

**Code:** `lib/autonomous-support-operations/` · migration `20260612800000_autonomous_support_phase40.sql`

---

## Vision

From *"AI helps write support replies"* → *"Aipify independently handles appropriate cases while escalating what needs human expertise."*

---

## Route mapping

| Spec | Aipify route |
|------|----------------|
| `/admin/support-operations` | `/app/settings/support-operations` |

---

## Autonomy levels

| Level | Name | Capabilities |
|-------|------|--------------|
| 0 | Human Only | Suggestions and drafts only |
| 1 | Assisted | Drafts, categorization, human approval |
| 2 | Supervised | Low-risk auto-replies with oversight |
| 3 | Trusted | Approved categories managed autonomously |

---

## Database tables

| Table | Purpose |
|-------|---------|
| `aso_settings` | Autonomy level, thresholds, channels |
| `support_categories` | Per-tenant classification config |
| `support_cases` | Incoming cases with triage results |
| `support_audit_logs` | Full audit trail |
| `support_knowledge_gaps` | Self-healing gap detection |
| `support_proactive_alerts` | Proactive support alerts |

---

## Triage flow

1. Classify intent (BDE `classify_support_email_intent`)
2. Assess risk (low → critical)
3. Consult Business DNA (templates, knowledge, escalation)
4. Calculate confidence (90+ autonomous, 70+ draft, 50+ review, &lt;50 escalate)
5. Check autonomy policy → action: draft, auto-reply, or escalate
6. Audit log + knowledge gap detection

---

## Confidence bands

| Score | Band | Action |
|-------|------|--------|
| 90–100% | autonomous | Auto-reply if level ≥2 and low risk |
| 70–89% | draft | Draft with optional approval |
| 50–69% | review | Human review recommended |
| &lt;50% | escalate | Human required |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/support-operations` | GET, PATCH, POST (proactive check) |
| `/api/support-operations/triage` | POST |
| `/api/support-operations/readiness` | GET |
| `/api/support/triage` | POST (omnichannel entry) |

---

## Key RPCs

- `triage_support_case()` — core triage engine
- `get_customer_support_operations_center()` — admin dashboard
- `calculate_automation_readiness_score()` — integrates BDE health
- `run_proactive_support_check()` — knowledge gap alerts
- `summarize_support_case()` — human collaboration summaries
- `get_platform_support_operations_overview()` — aggregates only

---

## i18n

`customerApp.supportOperations.*` · `platform.supportOperations.*` (en/no/sv/da)
