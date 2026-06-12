# Action & Approval Engine — FAQ

## What is the Action & Approval Engine?

The Action & Approval Engine is Aipify's governance framework for moving beyond recommendations into **safe, accountable execution**. It spans the Approval Center (`/app/approvals`), Secure AI Actions (A.3), and Human Oversight Engine (A.40).

**Mission:** Enable safe execution of operational actions while maintaining transparency, control, and trust.

## What are the five action tiers?

| Tier | Name | Approval |
|------|------|----------|
| 1 | Informational | None — answers, reports, summaries |
| 2 | Assisted | Human review recommended — drafts, suggestions |
| 3 | Approval-based | Explicit approval — publish, respond, automate |
| 4 | High-risk | Multiple approvers may be required — financial, access, exports |
| 5 | Restricted | **Never autonomous for AI** — deletion, legal, regulatory |

Tiers map to Trust & Action levels 0–4 and risk levels `low` through `critical`.

## Does Aipify replace human accountability?

No. Aipify explains proposed actions, risks, and outcomes — humans approve, reject, or override. **Aipify empowers action. Humans retain responsibility.**

## What must every executed action record?

Initiator, approver, timestamp, what changed, affected systems, and whether rollback is possible — via immutable audit logs.

## What approval workflows are supported?

Single approver, multi-step chains, department approvals, executive approvals, and emergency escalation paths. Emergency stop pauses all pending AI actions.

## How does Self Love relate to approvals?

Self Love (A.76 planned) will detect approval bottlenecks, recommend workflow simplifications, and identify repetitive approvals suitable for automation — without bypassing safety gates.

## Where do I review pending actions?

- **Approval Center:** `/app/approvals`
- **Human Oversight:** `/app/human-oversight-engine`
- **Secure AI Actions:** `/app/secure-ai-actions`

## What is the ABOS principle?

Trust is built through transparency. The goal is not to remove humans from decision-making — it is to help humans make better decisions faster. Core **Governance** pillar of ABOS.
