# Implementation Blueprint — Phase 104: Commerce Performance & Profit Engine

**Feature owner:** Customer App  
**Implementation:** [Commerce Performance & Profit Engine — Phase 104](./COMMERCE_PERFORMANCE_PROFIT_ENGINE_PHASE104.md)

This document defines **Phase 104 — Commerce Performance & Profit Engine** of the Aipify Business Operating System (ABOS). It extends repo Phase 104 at `/app/commerce-performance` with ABOS blueprint scaffolding — meaningful profitability insights without growth-at-any-cost framing.

> **Mapping:** ABOS Implementation Blueprint Phase 104 maps to **Commerce Performance & Profit Engine repo Phase 104** at `/app/commerce-performance`. Preserves ALL baseline `_cpp_*` RPC and table behavior. **Distinct from Commerce Intelligence Blueprint Phase 101** at `/app/commerce-intelligence` (discovery/opportunity). **Distinct from Revenue Intelligence Blueprint Phase 39** at `/app/commercial` (subscription MRR/ARR only).

## Mission

Transform financial and operational data into meaningful profitability insights.

## Core philosophy

**More sales ≠ better business — balance growth with profitability; wisdom guides ambition.**

Revenue measures activity. Profitability reflects sustainability. Human oversight remains central — Aipify does not replace professional financial expertise.

## ABOS principle

**Sustainability not extraction — Aipify Commerce Companion informs and prepares profit visibility, product performance, cost awareness, and strategic prioritization; humans retain financial oversight and commercial decisions.**

## Objectives

| Objective | Description |
|-----------|-------------|
| **Profit visibility** | Clear gross and net profit signals across products and categories |
| **Product performance** | Which products drive revenue vs sustainable profit contribution |
| **Revenue intelligence** | Revenue trends with margin context — not volume alone |
| **Cost awareness** | Supplier, shipping, platform, advertising, and refund cost visibility |
| **Strategic prioritization** | Focus on profitable growth opportunities over noise |
| **Sustainable growth** | Long-term business health over short-term metric spikes |

## Performance dashboard

Revenue, gross/net profit, AOV, product profitability, CAC, return/refund rates, conversion trends, and top categories — metadata patterns from connected commerce and accounting integrations.

## Profit intelligence (🦉 🌹 🔔)

| Emoji | Focus |
|-------|-------|
| 🦉 | Margin observations and cost pressure signals — context before scaling |
| 🌹 | Products and categories with sustainable profit contribution |
| 🔔 | When return rates, ad spend, or weak margins need human review |

## Product performance insights

Highest revenue and profit contributors, lowest performing SKUs, declining demand signals, and exceptional satisfaction patterns — prepared for human prioritization.

## Growth quality analysis

Revenue growth → margin impact → operational complexity → customer satisfaction → long-term sustainability — stepwise evaluation, not growth-at-any-cost.

## Cost visibility

Supplier expenses, shipping, platform subscriptions, advertising spend, and refund impacts — operational intelligence layer; Fiken remains accounting source of truth.

## Companion guidance (🦉 🌹 🔔)

Commerce Companion scaffolds profitability review — never replaces accountants or promises guaranteed margin improvement.

## Pricing insights (🦉 🌹 🔔)

| Emoji | Focus |
|-------|-------|
| 🦉 | When pricing may not cover landed cost and ad spend |
| 🌹 | Categories where thoughtful pricing supports sustainable margins |
| 🔔 | When discounting or ad scaling compresses net profit |

## Commerce strategy connection

Product alignment with profitable growth, meaningful investments, and manageable operational complexity — cross-link Purpose & Values Phase 95 and Decision Support.

## Self Love connection

Sustainable pacing in commercial ambition — profitability clarity reduces stress from rushed scaling.

Route `/app/self-love-engine` — principle only.

## Leadership insights

📈 Profitability summaries · 🦉 Margin observations · 🌹 Sustainable growth framing · 🔔 Areas for exploration — executive-ready metadata, humans decide.

## Trust connection

Transparent profit signals, human approval for performance actions, explainable classifications, full audit via commerce performance audit log.

## Limitation principles

**Sustainability not extraction:**

- Avoid growth-at-any-cost framing
- Avoid short-term-only optimization that ignores margin
- Avoid ignoring customer experience for volume metrics
- Avoid treating metrics as the sole definition of success

## Distinctions

| Surface | Route | Distinction |
|---------|-------|-------------|
| Commerce Performance & Profit (repo Phase 104) | `/app/commerce-performance` | **This blueprint extends** — product/commerce profitability |
| Commerce Intelligence Blueprint Phase 101 | `/app/commerce-intelligence` | Discovery/opportunity — cross-link |
| Product Automation Phase 102 | `/app/product-automation` | Catalog automation — cross-link |
| Dropshipping Operations Phase 103 | `/app/dropshipping-operations` | Operational margin/supplier context |
| Revenue Intelligence Blueprint Phase 39 | `/app/commercial` | Subscription MRR/ARR only — NOT product profit |
| Financial Operations / Fiken | Integration Engine | Fiken = accounting source of truth; Aipify = operational intelligence |

## Dogfooding

**Sportsklær.no:** Shopify catalog profit contribution, seasonal margin patterns, supplier landed cost awareness.  
**Fiken & Stripe:** honest scaffolds — accounting truth in Fiken; operational signals in Aipify.  
**Aipify Group:** internal validation of limitation principles, leadership insights tone, and KC FAQ.

## Vision

*"We finally understand what truly drives profitability in our business."*

## Technical

| Item | Location |
|------|----------|
| Baseline migration | `supabase/migrations/20260703000000_commerce_performance_profit_engine_phase104.sql` |
| Blueprint migration | `supabase/migrations/20261127000000_implementation_blueprint_phase104_commerce_performance_profit.sql` |
| Prefix | `_cppbp104_*` |
| Dashboard RPC | `get_commerce_performance_dashboard()` — all baseline fields + `commerce_performance_blueprint` block |
| Card RPC | `get_commerce_performance_card()` — baseline + Phase 104 framing |
| ILM | `lib/internal-language-model/implementation-blueprint-phase104-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/commerce-performance/faq/implementation-blueprint-phase104-faq.md` |
