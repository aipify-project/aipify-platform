# Model-Agnostic Intelligence

**Mandatory principle · Critical priority**

Aipify must never become dependent on a single language model provider.

**Prerequisites:** [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) · [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

**Code:** `lib/intelligence/` — task catalog, model profiles, tenant policy, router

---

## Core principle

> **Aipify Intelligence is the product. Models are infrastructure.**

| Rule | Meaning |
|------|---------|
| **Replaceable models** | GPT, Claude, Gemini, and others are swappable components — not the product |
| **Customer purchases Aipify** | Customers do not purchase access to a specific model brand |
| **Task-based routing** | Aipify selects the most appropriate model profile per task |
| **Core independence** | Business logic, learning, trust, and tenancy live in Aipify Core — not in a provider SDK |
| **Enterprise BYOM** | Future enterprise customers may supply customer-approved model profiles |

---

## Intelligence tasks

Aipify routes by task, not by provider default:

| Task | Examples |
|------|----------|
| `executive_summary` | Morning briefings, executive dashboard summaries |
| `support_response` | Support Assistant, embedded help |
| `recommendation` | Operational improvement suggestions |
| `knowledge_retrieval` | Knowledge base answers |
| `email_draft` | Notification and outreach drafts |
| `presence_briefing` | Presence Center updates |
| `installation_guidance` | Install wizard assistance |
| `risk_explanation` | Approval and risk context copy |

Source: `lib/intelligence/tasks.ts`

---

## Model profiles

Profiles are **internal infrastructure identifiers** — never customer-facing product names:

- `aipify-fast` — low-latency responses
- `aipify-balanced` — general operational intelligence
- `aipify-reasoning` — deeper analysis (executive, risk)

Provider keys (`managed-fast`, `managed-balanced`, etc.) map to actual LLM backends in deployment configuration. Swapping a provider must not require changes to Customer App, skills, or learning logic.

---

## Tenant policies

| Mode | Behaviour |
|------|-----------|
| **aipify_managed** (default) | Aipify selects the best profile per task |
| **customer_approved** (enterprise) | Only tenant-approved profile IDs may be used |

Router: `selectModelProfile()` in `lib/intelligence/router.ts`

---

## Implementation rules

1. **Never** hardcode a provider SDK at the skill or UI layer — route through `lib/intelligence/`
2. **Never** brand customer UI with model provider names (GPT, Claude, Gemini, etc.)
3. **Never** couple learning memory, approvals, or tenancy to a single provider response format
4. **Always** keep prompts, policies, and outcomes in Aipify Core — models execute, Core decides
5. Customer integrations (e.g. their own OpenAI key for their CMS) are **customer infrastructure**, not Aipify product branding

---

## Architecture placement

| Concern | Layer |
|---------|-------|
| Task routing & profiles | `lib/intelligence/` (shared core) |
| Generation execution | Core services / API routes (provider adapters) |
| Customer experience | Skills, Presence, Recommendations — model-agnostic |
| Enterprise model policy | Future: tenant settings + platform governance |

---

## Final principle

> **Models may change. Aipify remains.**
