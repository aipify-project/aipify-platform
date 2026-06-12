# Implementation Blueprint — Phase 101: Commerce Intelligence Engine

**Feature owner:** Customer App  
**Implementation:** [Commerce Intelligence Engine — Phase 101](./COMMERCE_INTELLIGENCE_ENGINE_PHASE101.md)

This document defines **Phase 101 — Commerce Intelligence Engine** of the Aipify Business Operating System (ABOS). It extends repo Phase 101 at `/app/commerce-intelligence` with ABOS blueprint scaffolding — wisdom-guided commercial intelligence without hype or guaranteed promises.

> **Mapping:** ABOS Implementation Blueprint Phase 101 maps to **Commerce Intelligence Engine repo Phase 101** at `/app/commerce-intelligence`. Preserves ALL baseline `_cie_*` RPC and table behavior. **Distinct from Commerce Performance & Profit repo Phase 104** at `/app/commerce-performance` (profit/operations cross-link). **Distinct from Revenue Intelligence Blueprint Phase 39** at `/app/commercial` (subscription MRR/ARR only).

## Mission

Commercial outcomes through opportunity discovery, product intelligence, and market awareness.

## Core philosophy

**Wisdom guides commerce — sustainable opportunities aligned with strengths and customer needs.**

## ABOS principle

**Wisdom not speculation — Aipify Commerce Companion informs and prepares product research, trend awareness, margin analysis, and supplier evaluation; humans approve every import and commercial decision.**

## Objectives

| Objective | Description |
|-----------|-------------|
| **Trend intelligence** | Market trend awareness — signals without hype or urgency pressure |
| **Product opportunity discovery** | Discover products that fit customer needs, store identity, and margin goals |
| **Margin intelligence** | Margin and profitability analysis before commitment |
| **Supplier insights** | Supplier evaluation, reliability signals, and risk awareness |
| **Store fit analysis** | Catalog alignment with audience, category, and brand identity |
| **Commerce strategy connection** | Connect opportunities to purpose, sustainable growth, and customer needs |

## Commerce insight sources

Platform install catalog, trend signals, competitor metadata, supplier profiles, margin analyses, store fit reports, Business DNA tone, and integration connectors — metadata only.

## Trend intelligence (🦉 🌹 🔔)

Awareness not hype:

| Emoji | Focus |
|-------|-------|
| 🦉 | What trend signals mean for your store — context before action |
| 🌹 | Seasonal and audience-fit opportunities — aligned with strengths |
| 🔔 | When to pause before chasing popularity — human approval always |

## Product opportunity discovery

Discovery runs, opportunity scores, recommendation types, watchlists, and risk flags — no automatic import without approval.

## Margin intelligence

Landed cost, gross/net margin estimates, margin classification, and risk notes — wisdom before scale.

## Supplier insights (🦉 🌹 🔔)

| Emoji | Focus |
|-------|-------|
| 🦉 | Delivery, defect rate, and price stability patterns |
| 🌹 | Trusted suppliers for testing vs high-risk alternatives |
| 🔔 | When supplier risk should block impulsive product tests |

## Companion guidance (🦉 🌹 🔔)

Commerce Companion scaffolds research and evaluation — never promises guaranteed success or pushes impulsive imports.

## Commerce strategy connection

Purpose alignment (Blueprint Phase 95), sustainable growth pacing, customer needs first, Decision Support cross-link — opportunities must fit values and long-term trust.

## Self Love connection

Patience and disciplined decisions — commercial growth at a human pace:

*"Patience and disciplined decisions beat impulsive product launches — sustainable commerce grows one thoughtful choice at a time."*

Route `/app/self-love-engine` — principle only.

## Trust connection

Transparent intelligence sources, human approval for imports, explainable opportunity scores, full audit via commerce intelligence audit log.

## Limitation principles

**Wisdom not speculation:**

- No guaranteed success promises
- No impulsive product decisions driven by trend hype alone
- No popularity-only recommendations that ignore store fit or values
- No ignoring stated purpose, margin thresholds, or supplier risk signals

## Distinctions

| Surface | Route | Distinction |
|---------|-------|-------------|
| Commerce Intelligence (repo Phase 101) | `/app/commerce-intelligence` | **This blueprint extends** — discovery, trends, margins, suppliers |
| Commerce Performance & Profit (Phase 104) | `/app/commerce-performance` | Profit/operations — cross-link, not duplicate |
| Revenue Intelligence Blueprint Phase 39 | `/app/commercial` | Subscription MRR/ARR only |
| Strategic Intelligence A.31 | `/app/strategic-intelligence-foundation-engine` | Strategic signals — cross-link |
| Curiosity A.87 / Phase 80 | `/app/curiosity-discovery-engine` | Opportunity exploration — cross-link |

## Dogfooding

**Sportsklær.no:** product research, supplier evaluation, margin analysis, store fit for active lifestyle catalog.  
**Aipify Group:** internal validation of Commerce Companion tone, limitation principles, and KC FAQ.

## Vision

*"We understand our commercial opportunities more clearly than ever before."*

## Technical

| Item | Location |
|------|----------|
| Baseline migration | `supabase/migrations/20260630000000_commerce_intelligence_engine_phase101.sql` |
| Blueprint migration | `supabase/migrations/20261124000000_implementation_blueprint_phase101_commerce_intelligence.sql` |
| Prefix | `_cibp101_*` |
| Dashboard RPC | `get_commerce_intelligence_dashboard()` — all baseline fields + `commerce_intelligence_blueprint` block |
| Card RPC | `get_commerce_intelligence_card()` — baseline + Phase 101 framing |
| ILM | `lib/internal-language-model/implementation-blueprint-phase101-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/commerce-intelligence/faq/implementation-blueprint-phase101-faq.md` |
