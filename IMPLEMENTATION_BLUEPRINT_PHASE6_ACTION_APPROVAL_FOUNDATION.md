# Implementation Blueprint — Phase 6: Action & Approval Foundation

**Feature owner:** Customer App  
**Implementation:** [Action & Approval Engine](./ACTION_APPROVAL_ENGINE.md) · [Trust & Action Engine (Phase 30)](./TRUST_ACTION_ENGINE.md)

Enable Aipify to execute actions safely, transparently, and responsibly while humans remain informed and empowered.

## Mission

Allow Aipify to automate and perform approved actions while ensuring humans remain informed and empowered.

## Core philosophy

**Assist. Recommend. Execute responsibly.**

Never perform irreversible or sensitive actions without appropriate authorization.

## Action categories (ABOS blueprint)

| Risk | Examples | Approval |
|------|----------|----------|
| **Low** | Draft responses, reminders, organize info, reports, recommend articles | Automatic execution permitted |
| **Medium** | Approved emails, update docs, support tickets, schedule meetings, modify records | Human review recommended |
| **High** | Delete data, change permissions, financial actions, external publish, governance | Explicit approval required |

Maps to five-tier model in [ACTION_APPROVAL_ENGINE.md](./ACTION_APPROVAL_ENGINE.md) and Trust Action levels 0–4.

## Transparency

Users understand: what is proposed, why recommended, systems affected, approval requirement, success outcome.

## ABOS principle

> Automation should strengthen human capability. Not replace human responsibility.

## Routes

| Surface | Route |
|---------|-------|
| Approval Center | `/app/approvals` |
| Human Oversight | `/app/human-oversight-engine` |
| Secure AI Actions | `/app/secure-ai-actions` |
| Trust & Explainability | `/app/trust` |

## Migration

`supabase/migrations/20260951000000_implementation_blueprint_phase6_action_approval.sql`
