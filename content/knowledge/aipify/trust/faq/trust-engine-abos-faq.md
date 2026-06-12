# ABOS Trust Engine — FAQ

## What is the ABOS Trust Engine?

The ABOS Trust Engine extends Phase 76 Trust Transparency & Explainability at `/app/trust`. It is the organizational trust foundation for ABOS — transparency, explainability, confidence communication, accountability, auditability, and consistency monitoring. See [TRUST_ENGINE.md](../../../../TRUST_ENGINE.md).

## How is this different from Trust & Reputation Engine (A.72)?

**Phase 76 + ABOS Trust Engine** (`/app/trust`) explains individual decisions, tracks Trust Score, and supports overrides and feedback. **Trust & Reputation Engine A.72** (`/app/trust-reputation-engine`) tracks entity-scoped reputation signals for workflows, automations, and knowledge. They complement each other — reputation signals inform trust; explainability earns it.

## What is the ABOS principle on trust?

> Trust cannot be demanded — it is earned through consistent transparency and accountable assistance.

Aipify never asks users to trust AI blindly. Trust is earned continuously through explainability, governance, and human oversight.

## What is the explainability framework?

Every important decision explanation addresses five elements: **Why** (reasoning), **Sources** (information used), **Assumptions** (rules applied), **Alternatives** (other paths considered), and **Confidence** (honest high, moderate, or low communication).

## How does Aipify communicate confidence?

**High** — strong evidence and clear rules: Aipify is confident based on clear rules and supporting evidence. **Moderate** — partial certainty: review reasoning before acting. **Low** — limited information: human review or escalation recommended. Never false certainty.

## What are transparency requirements?

No important decision without explanation. Confidence communicated honestly. Human override and escalation paths always visible. Explanations never expose secrets or cross-tenant data. Governance supplements explainability — never bypassed.

## What accountability principles apply?

Humans retain responsibility for consequential decisions. Overrides are logged and auditable. Escalation is preferred over invented reasoning. Feedback improves explainability — questioning is encouraged.

## What does Self Love monitor for trust?

Self Love (A.76) monitors trust health — explanation gaps, override spikes, low-confidence clusters, and feedback patterns — and suggests transparency improvements without compromising privacy or safety.

## How does Relationship Intelligence connect?

Organizational Relationship Intelligence (A.78) complements trust explainability. Relationship-aware decisions may reference metadata summaries in explanations — never raw communications, impersonation, or automated personal messages.

## What is monitored for consistency?

Explanation coverage, view rates, override and escalation frequency, feedback satisfaction, and cross-module explainability alignment across governance, actions, support, and automation.

## Where can I learn more?

- Trust Dashboard: `/app/trust`
- ABOS article: [Trust and Transparency](../../abos/articles/trust-and-transparency.md)
- Trust Architecture: [TRUST_ARCHITECTURE.md](../../../../TRUST_ARCHITECTURE.md)
