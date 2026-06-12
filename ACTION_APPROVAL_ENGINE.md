# Action & Approval Engine

**Canonical specification · ABOS Governance pillar**

Cross-reference: [TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md) · [SECURE_AI_ACTION_ENGINE_PHASE_A3.md](./SECURE_AI_ACTION_ENGINE_PHASE_A3.md) · [HUMAN_OVERSIGHT_ENGINE_PHASE_A40.md](./HUMAN_OVERSIGHT_ENGINE_PHASE_A40.md) · [ABOS_FOUNDATION.md](./ABOS_FOUNDATION.md)

---

## Purpose

The Action & Approval Engine enables Aipify to move beyond recommendations and become an active operational companion — within clearly defined governance boundaries. Aipify assists humans; it does not replace human accountability.

**Mission:** Enable safe execution of operational actions while maintaining transparency, control, and trust.

---

## Action tiers

| Tier | Name | Approval | Maps to |
|------|------|----------|---------|
| **1** | Informational | None | Trust Action level 0 · `low` risk |
| **2** | Assisted | Human review recommended | Trust Action level 1 · `medium` risk |
| **3** | Approval-based | Explicit approval required | Trust Action level 2 · `medium`/`high` |
| **4** | High-risk | Multiple approvals may be required | Trust Action level 3 · `high` risk |
| **5** | Restricted | **Never autonomous** | Trust Action level 4 · `critical` — AI prohibited |

### Tier 1 — Informational

No operational impact. No approval required.

Examples: answering questions, recommendations, reports, meeting summaries, improvement suggestions.

### Tier 2 — Assisted

Moderate impact. Human review recommended.

Examples: draft customer emails, support response drafts, knowledge update suggestions, marketing drafts, task recommendations.

### Tier 3 — Approval-based

Direct business impact. Explicit approval required.

Examples: publishing content, updating documentation, customer responses, triggering automations, support tickets, workflow changes.

### Tier 4 — High-risk

Significant impact. Multiple approvals may be required.

Examples: financial approvals, contract generation, user access changes, organization-wide changes, data exports.

### Tier 5 — Restricted

Never executed autonomously by AI.

Examples: permanent data deletion, legal commitments, regulatory filings, executive termination, irreversible system modifications.

---

## Approval workflows

Organizations configure:

- Single approver models
- Multi-step approval chains
- Department approvals
- Executive approvals
- Emergency escalation paths

**Implementation:** `/app/approvals` (Trust & Action) · `/app/human-oversight-engine` (A.40) · `/app/secure-ai-actions` (A.3)

---

## Aipify responsibilities

Aipify must:

- Explain what action is proposed and why
- Describe expected outcomes and associated risks
- Present approval requests clearly
- Record all actions in audit logs

---

## Audit logging

Every executed action records: initiator, approver, timestamp, what changed, affected systems, rollback availability.

**Tables:** `action_audit_logs` · `action_requests` · Secure AI Action audit · Human Oversight audit

---

## Self Love integration (A.76 planned)

Self Love monitors operational health: approval bottlenecks, workflow simplification, repetitive approvals suitable for automation, governance improvements — without compromising safety.

---

## ABOS principle

> Trust is built through transparency. The goal is not to remove humans from decision-making — it is to help humans make better decisions faster.

---

## Vision

Organizations should always understand what is happening, why it is happening, and who remains accountable.

**Aipify empowers action. Humans retain responsibility.**

---

## Implementation map

| Surface | Route | Role |
|---------|-------|------|
| Approval Center | `/app/approvals` | Unified approve/reject inbox (Phase 30) |
| Secure AI Actions | `/app/secure-ai-actions` | Risk-classified AI action catalog (A.3) |
| Human Oversight | `/app/human-oversight-engine` | Accountability layer, tier display (A.40) |
| Governance & Policy | `/app/governance-policy-engine` | Policy enforcement (A.14) |
| Emergency stop | `/api/actions/emergency-stop` | Pause all pending AI actions |

Programmatic tiers: `lib/internal-language-model/action-approval-vocabulary.ts` · ILM corpus: `action-approval-engine.txt`

KC FAQ: `content/knowledge/aipify/action-approval-engine/faq/action-approval-engine-faq.md`
