# Implementation Blueprint Phase 27 — Financial Operations & Accounting Integration FAQ

## What is Phase 27 of the Implementation Blueprint?

Phase 27 aligns the Integration Engine (Phase A.8) with ABOS financial operations requirements — trusted Fiken and Stripe integrations, operational awareness, and workflow coordination without replacing accountants or accounting systems.

## Why Integration Engine and not Commercial Packages?

Commercial Packages (`/app/settings/billing`) manages tenant billing and module licensing. Integration Engine (`/app/integration-engine`) manages **external system connections** — Stripe payment events, Fiken accounting sync awareness, webhooks, and credential vault. Phase 27 extends Integration Engine RPCs only.

## What is the primary strategy?

| System | Role |
|--------|------|
| **Fiken** 🇳🇴 | Primary accounting — source of truth for bookkeeping |
| **Stripe** 💳 | Primary payments — events and subscription signals |
| **Stripe → Fiken** | Coordination model — Fiken remains authoritative |
| **Aipify** | Operational awareness layer — monitor, surface, coordinate |

## What may Aipify assist with?

Subscription awareness, revenue visibility, failed payment notifications, financial task reminders, invoice follow-up coordination, executive financial summaries, and workflow coordination between Stripe and Fiken — metadata only.

## What should Aipify NOT become?

A bookkeeping system, tax engine, regulatory reporting platform, or replacement for accountants. Aipify does not silently auto-post to accounting without explicit approval.

## How are credentials and financial data protected?

Credentials remain in `integration_credential_vault` server-side. Financial engagement summaries use counts and connection status only — no payment amounts, PAN, or ledger content.

## What are the Phase 27 success criteria?

Stripe→accounting flow awareness, Fiken source-of-truth strategy, visibility via engagement summary, admin effort reduction via sync/webhook scaffold, trust boundaries documented, and cross-links distinct from billing and subscription engines — computed live via `_foaibp_blueprint_success_criteria()`.

## Where does dogfooding happen?

**Aipify Group** validates Stripe events, Fiken sync awareness, executive summaries, and subscription monitoring internally. **Unonight** is the future commerce pilot.

## What related surfaces should I use instead?

| Need | Route |
|------|-------|
| Tenant billing | `/app/settings/billing` |
| Plan modules | `/app/subscription-plan-management-engine` |
| License status | `/app/license` |
| Executive summaries | `/app/executive-insights-engine` |
| Payment-sensitive actions | `/app/approvals` |
