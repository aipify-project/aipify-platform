# Implementation Blueprint Phase 6 — Action & Approval Foundation FAQ

## What is Implementation Blueprint Phase 6?

The sixth implementation phase of Aipify Business Operating System (ABOS). It aligns the Trust & Action Engine (Phase 30) Approval Center with ABOS action governance — safe execution with human oversight.

## What is the core philosophy?

**Assist. Recommend. Execute responsibly.** Aipify never performs irreversible or sensitive actions without appropriate authorization.

## What is the ABOS principle for this phase?

Automation should strengthen human capability. Not replace human responsibility.

## Where is Phase 6 implemented?

In the existing Approval Center at `/app/approvals`, extending Trust & Action Engine (Phase 30). No new tables — metadata alignment via `get_customer_approvals_center()`.

## What are the low, medium, and high action categories?

| Category | Approval | Examples |
|----------|----------|----------|
| **Low** | Automatic execution permitted | Draft responses, reminders, reports, knowledge recommendations |
| **Medium** | Human review recommended | Approved emails, documentation updates, support tickets, meetings |
| **High** | Explicit approval required | Delete data, permission changes, financial actions, external publish |

Categories map to Trust Action levels 0–4. Level 4 (critical) is AI prohibited.

## What must users understand before approving?

What is proposed, why it is recommended, which systems are affected, whether approval is required, and whether the action succeeded.

## How does Self Love relate to actions?

Self Love (A.76 planned) encourages thoughtful action — discouraging impulsive decisions and promoting sustainable practices. **Scaffold only** until Self Love Engine ships; it does not bypass approval gates.

## What are the Phase 6 success criteria?

Aipify can recommend actions, approval workflows function correctly, high-risk actions require authorization, audit trails are preserved, and users trust the action framework — computed live on the Approval Center dashboard.

## What related routes should I know?

- **Approval Center:** `/app/approvals`
- **Human Oversight Engine (A.40):** `/app/human-oversight-engine`
- **Secure AI Actions (A.3):** `/app/secure-ai-actions`
- **Trust & Explainability:** `/app/trust`
- **Governance & Policy (A.14):** `/app/governance-policy-engine`
- **Action Center (AEF):** `/app/action-center`

## What migration applies?

`supabase/migrations/20260951000000_implementation_blueprint_phase6_action_approval.sql`
