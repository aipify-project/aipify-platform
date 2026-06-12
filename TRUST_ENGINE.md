# ABOS Trust Engine

**Extends Phase 76 · Trust foundation for ABOS**

The ABOS Trust Engine is the organizational trust foundation for the Aipify Business Operating System — transparency, explainability, confidence communication, accountability, auditability, and consistency monitoring. It **extends** [TRUST_TRANSPARENCY_EXPLAINABILITY_PHASE76.md](./TRUST_TRANSPARENCY_EXPLAINABILITY_PHASE76.md); it is **not** a duplicate engine.

**Feature owner:** Customer App · Route `/app/trust` · APIs `/api/aipify/trust/*`, `/api/aipify/explanations/*`

**Distinct from:** [TRUST_REPUTATION_ENGINE_PHASE_A72.md](./TRUST_REPUTATION_ENGINE_PHASE_A72.md) — A.72 tracks entity-scoped reputation signals at `/app/trust-reputation-engine`. Phase 76 + ABOS Trust Engine covers decision explainability and operational trust transparency.

---

## Philosophy

Trust is earned continuously — through transparency, explainability, auditability, predictability, governance, and human oversight. Aipify never asks users to trust AI blindly.

## Mission

Every important decision can be understood, reviewed, audited, and trusted.

## ABOS principle

> Trust cannot be demanded — it is earned through consistent transparency and accountable assistance.

## Explainability framework

Every important decision explanation should address:

| Element | Purpose |
|---------|---------|
| **Why** | Reasoning and decision summary |
| **Sources** | Information used (metadata only) |
| **Assumptions** | Rules applied and contextual assumptions |
| **Alternatives** | Options considered |
| **Confidence** | High, medium, or low — with honest communication |

## Transparency requirements

- No important decision without explanation
- Confidence levels communicated honestly — never false certainty
- Human override and escalation paths always visible
- Explanations never expose secrets, API keys, or cross-tenant data
- Governance and approval policies supplement — never bypass — explainability

## Confidence communication

| Level | When to use | Example phrasing |
|-------|-------------|------------------|
| **High** | Strong evidence, clear rules, clear reasoning | "Aipify is confident in this recommendation based on clear rules and strong supporting evidence." |
| **Moderate** | Moderate evidence, partial certainty | "Aipify has moderate confidence — review the reasoning and confirm before acting." |
| **Low** | Limited information | "Confidence is limited — Aipify recommends human review or escalation before proceeding." |

Programmatic phrases: `lib/internal-language-model/trust-engine-vocabulary.ts` · `CONFIDENCE_PHRASES`

## Accountability principles

- Humans retain responsibility for consequential decisions
- Overrides are logged and auditable
- Escalation is preferred over invented reasoning
- Feedback improves explainability — never punishes users for questioning

## Auditability fields

Explanation events and trust audit logs capture: actor, event type, timestamp, override reason, feedback rating, and metadata summaries — never raw customer content.

## Consistency monitoring

The Trust Score and dashboard monitor:

- Explanation coverage across decision types
- View rate and user engagement with explanations
- Override and escalation frequency
- Feedback satisfaction trends
- Cross-module explainability alignment (governance, actions, support, automation)

## Self Love (A.76)

Self Love monitors trust health — explanation gaps, override spikes, low-confidence clusters, and feedback patterns — and suggests transparency improvements without compromising safety or privacy.

## Relationship Intelligence connection

Organizational relationship context (A.78) complements trust explainability: relationship-aware decisions should reference relationship metadata in explanations where relevant, without exposing private communications. Personal RSI (Phase 33) remains separate at `/app/assistant/relationships`.

---

## Implementation map

| Concern | Location |
|---------|----------|
| Phase 76 explainability | `decision_explanations`, `explanation_events`, `explainability_trust_metrics` |
| Dashboard RPCs | `get_trust_dashboard()`, `get_trust_card()` |
| ABOS spec alignment | `supabase/migrations/20260926000000_trust_engine_abos_spec_alignment.sql` |
| Client types & parse | `lib/aipify/trust-engine/` |
| UI | `components/app/trust-engine/TrustDashboardPanel.tsx` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/trust-engine-abos.txt` |
| ILM vocabulary | `lib/internal-language-model/trust-engine-vocabulary.ts` |
| Reputation (A.72) | `/app/trust-reputation-engine` — complements, does not replace |
| Action & Approval | `/app/approvals`, Human Oversight A.40 |
| Trust Architecture | [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) — data ownership and storage boundaries |
| Trust & Action Engine | [TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md) — Phase 30 approval levels |

## Routes

| Route | Purpose |
|-------|---------|
| `/app/trust` | Trust Score, ABOS trust framing, recent explanations, feedback |
| `/app/trust/explanations/[id]` | Full explanation detail with override and feedback |

## Knowledge Center

- Category: `trust`
- FAQ: `content/knowledge/aipify/trust/faq/trust-faq.md`, `trust-engine-abos-faq.md`
- ABOS article: `content/knowledge/aipify/abos/articles/trust-and-transparency.md`

## i18n

`customerApp.trustEngine.*` in en/no/sv/da
