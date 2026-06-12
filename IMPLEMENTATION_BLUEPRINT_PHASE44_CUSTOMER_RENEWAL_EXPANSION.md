# Implementation Blueprint — Phase 44: Customer Renewal & Expansion Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Renewal & Expansion**

> **Naming collision:** **Autonomous Execution Framework Phase 44** lives at `/app/action-center` (AEF) — controlled business action execution. **Blueprint Phase 44** is partner renewal & expansion coaching within Sales Expert OS — documented in `_crebp_distinction_note()`.

> **Mapping:** Extends Sales Expert OS A.95 — cross-links Revenue Intelligence Phase 39 (`/app/commercial`), Customer Success A.26, Partner Success A.73, Performance Phase 41, Coach Phase 45, Business Packs A.43, Self Love A.76 — never duplicates commercial modules or `commercial_*` operational tables.

## Mission

Help Sales Experts nurture long-term customer partnerships through renewal awareness, health insights, and consultative expansion — never aggressive upsell.

## Core philosophy

**Renewals should feel intentional, not accidental. Customer health metadata supports care — never surveillance or blame.**

## ABOS principle

Aipify Business Operating System (ABOS) partnerships grow when organizations succeed — humans decide, Aipify prepares renewal conversations with clarity.

## Objectives

| Key | Focus |
|-----|-------|
| **Renewal awareness** | Upcoming renewals, anniversaries, intentional follow-up windows |
| **Health monitoring** | Aggregate engagement, adoption, readiness — metadata only |
| **Expansion recommendations** | Consultative opportunities — never aggressive upsell |
| **Success planning** | Success review questions and next-year outcomes |
| **Risk support** | At-risk signals with prevention guidance — support, not blame |
| **Relationships** | Celebration moments and long-term partnership continuity |

## Renewal dashboard

Upcoming renewals · recently renewed · anniversaries · readiness indicators · at-risk count

Companion examples 🔔🌹 — intentional preparation, not pressure.

Live summary from `_crebp_renewal_summary(organization_id)` — derives from `organization_sales_expert_customers` plus `commercial_renewal_events` / `commercial_customer_health_scores` (Phase 93) when tables exist — empty-safe.

## Customer health insights

Aggregate engagement signals only:

- Login frequency patterns
- Training completion metadata
- Support volume trends (no ticket bodies)
- Knowledge Center usage counts
- Workflow adoption metadata

Cross-link **Revenue Intelligence Phase 39** at `/app/commercial` for MRR/ARR operational layer — do not duplicate.

## Success review questions

| Category | Focus |
|----------|-------|
| Outcomes achieved | Operational improvements since adoption |
| Challenges addressed | Honest friction and expectation gaps |
| Future value | Where Aipify may help in the next 12 months |
| Next year success | What successful partnership looks like |

## Expansion opportunities

Consultative categories: team members · Business Packs A.43 · executive/support/commerce/strategic intelligence modules.

Tone: **consultative_not_aggressive** — understand workflow before recommending.

## Renewal playbooks

Cross-links **Sales Coach Phase 45** — structure not scripts:

| Window | Guidance |
|--------|----------|
| **30 days** | Review health metadata, schedule success review, confirm onboarding outcomes |
| **14 days** | Share value summary, address follow-ups, prepare talking points |
| **Renewal week** | Relationship-focused check-in, celebrate progress, confirm next-year criteria |

## Customer celebration experiences 🌹🔔❤️

Voluntary, warm celebration guidance — cross-links Performance Phase 41 bell moments and Gratitude A.89.

## Churn prevention support 🦉🌹

Prevention not blame — early at-risk signals, honest conversations, Customer Success A.26 cross-link.

## Sales Expert insights

Renewal forecasts · expansion recommendations · customer journey visibility · engagement summaries — metadata only.

## Self Love connection (A.76)

Renewal season can be demanding — clarity not anxiety. Route: `/app/self-love-engine`.

## Trust connection

Sales Experts understand:

- How renewal summary derives from customer and optional commercial metadata
- Health insights are aggregate — no raw email, chat, orders, or financial PII
- Expansion scaffolds are consultative — Sales Experts decide every conversation
- Phase 39 covers subscription revenue operations — Phase 44 covers partner customer relationships

## Distinctions

| Surface | Route | Purpose |
|---------|-------|---------|
| AEF Phase 44 | `/app/action-center` | Controlled business action execution |
| Revenue Intelligence Phase 39 | `/app/commercial` | MRR/ARR, renewals operational layer |
| Customer Success A.26 | `/app/customer-success-engine` | Organization customer success |
| Sales Expert OS Phase 44 | `/app/sales-expert-engine` | Partner renewal & expansion tab |

## Integration links

Revenue Intelligence Phase 39 · Customer Success A.26 · Partner Success A.73 · Performance Phase 41 · Coach Phase 45 · Business Packs A.43 · Gratitude A.89 · Self Love A.76

## Technical delivery

| Artifact | Path |
|----------|------|
| Migration | `supabase/migrations/20260996000000_implementation_blueprint_phase44_customer_renewal_expansion.sql` |
| Types / parse | `lib/aipify/sales-expert-operating-system/types.ts`, `parse.ts` |
| UI tab | `RenewalExpansionTab` in `SalesExpertEngineDashboardPanel.tsx` |
| i18n | `customerApp.salesExpertEngine.*` en/no/sv/da |
| ILM | `implementation-blueprint-phase44-vocabulary.ts`, corpus txt |
| FAQ | `content/knowledge/aipify/sales-expert-engine/faq/implementation-blueprint-phase44-faq.md` |

## Dogfooding

Aipify Group Sales Experts use the Renewal & Expansion tab internally first — validate playbook tone, celebration language, and commercial cross-link honesty before broader partner rollout.

## Success criteria

Live via `_crebp_blueprint_success_criteria(organization_id)` — renewal dashboard, health signals, consultative expansion tone, playbooks, AEF distinction documented, Self Love connection, renewal summary metadata.

## Vision

Long-term partnerships grow through honest preparation. Customer health is metadata for care. Expansion when it genuinely helps. Celebrate progress 🌹🔔 — relationships matter as much as subscriptions.
