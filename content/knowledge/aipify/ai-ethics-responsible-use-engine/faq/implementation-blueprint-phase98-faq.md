# Implementation Blueprint Phase 98 — Trust, Ethics & Human Governance FAQ

## What is Phase 98 of the Implementation Blueprint?

Phase 98 adds the **Trust, Ethics & Human Governance Engine** to the **AI Ethics & Responsible Use Engine (Phase A.46)** at `/app/ai-ethics-responsible-use-engine`. It provides governance framing for deploying and using Aipify responsibly — ethical awareness, human oversight, and values-aligned practices.

## Does Phase 98 create a new route?

No. Phase 98 **extends** the existing engine at `/app/ai-ethics-responsible-use-engine`. It layers on **Phase 54** (`_escgbp_*`) and **Phase 65** (`_cecbp_*`) — all prior fields are preserved.

## How is this different from Aipify Constitution repo Phase 98?

**Aipify Constitution & Core Principles (repo Phase 98)** at `/app/constitution` stores founding principles and stakeholder commitment records. **Blueprint Phase 98** handles **trust, ethics, and human governance for Aipify deployment** on the A.46 ethics engine — cross-link only, never duplicate constitution tables.

## How is this different from Phase 54 and Phase 65?

**Phase 54** governs companion ethics, emotional safety, and autonomy tiers. **Phase 65** adds the Companion Evolution Council for values-driven capability review. **Phase 98** adds **deployment governance** — human-in-the-loop domains, governance principles, companion transparency, privacy principles, and ethical review practices for responsible Aipify use.

## What are the ethical questions?

From `_tehgbp98_ethical_questions()` — 🦉 human judgment, 🌹 trust impact, ❤️ dignity and autonomy, 🔔 unintended consequences.

## What is human in the loop?

Always human-only or human-confirmed for **employment**, **legal**, **financial**, **sensitive communications**, and **strategic** decisions — from `_tehgbp98_human_in_the_loop()`.

## What is companion transparency?

Aipify must explain **why**, **what information** informed a suggestion, **limitations**, and **uncertainty** — from `_tehgbp98_companion_transparency()`.

## What are privacy principles?

Never: hidden automation, manipulation, surveillance, removing accountability, or dignity tradeoffs — from `_tehgbp98_privacy_principles()`.

## How does Self Love connect?

**Self Love A.76** influences governance culture. Spec quote: *Technology should support humanity, not diminish it — Aipify exists to augment people, not replace their judgment or worth.*

## What cross-links does Phase 98 include?

Governance & Policy A.14, Trust & Action Phase 30, Trust Engine Phase 76, Human Oversight A.40, Compliance A.29, Security & Trust A.18, Workflow Orchestration Phase 86, Organizational Memory Phase 94, Meeting Companion A.61, Inclusion & Humanity A.83, Purpose & Values Phase 95, and Constitution repo Phase 98.

## What does engagement summary show?

Live counts from `_tehgbp98_engagement_summary(organization_id)` — approved/proposed use cases, overdue reviews, high-risk active, recent ethics audit events (90 days), governance health. Metadata only.

## What are the Phase 98 success criteria?

Computed live by `_tehgbp98_success_criteria(organization_id)`: objectives, ethical questions, governance principles, human in the loop, companion transparency, privacy principles, ethical review practices, values-aligned governance, approved use cases, integration links, distinction note.

## Where does dogfooding happen?

**Aipify Group AS** validates governance for Meeting Companion, Sales Expert, Executive Companion, Autonomous Ops approvals, and Organizational Memory permissions. **Unonight** pilots ethics use case registry and trust trend review.

## Where is the dashboard?

`/app/ai-ethics-responsible-use-engine` — RPCs `get_ai_ethics_responsible_use_engine_dashboard()` and `get_ai_ethics_responsible_use_engine_card()` include `trust_ethics_human_governance_blueprint`.

Migration: `supabase/migrations/20261121000000_implementation_blueprint_phase98_trust_ethics_human_governance.sql`
