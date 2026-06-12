# Implementation Blueprint — Phase 102: Product Automation Engine

**Feature owner:** Customer App  
**Implementation:** [Product Automation Engine — Phase 102](./PRODUCT_AUTOMATION_ENGINE_PHASE102.md)

This document defines **Phase 102 — Product Automation Engine** of the Aipify Business Operating System (ABOS). It extends repo Phase 102 at `/app/product-automation` with ABOS blueprint scaffolding — automation that supports creativity and consistency while humans retain strategic control.

> **Mapping:** ABOS Implementation Blueprint Phase 102 maps to **Product Automation Engine repo Phase 102** at `/app/product-automation`. Preserves ALL baseline `_pae_*` RPC and table behavior. **Distinct from Dropshipping Operations repo Phase 103** at `/app/dropshipping-operations` (supplier and operational context cross-link). **Distinct from Commerce Intelligence Blueprint Phase 101** at `/app/commerce-intelligence` (discovery vs post-approval automation).

## Mission

Streamline product operations via automation, localization, and optimization with strategic oversight.

## Core philosophy

**Automation supports creativity and consistency — humans own strategic decisions.**

## ABOS principle

**Humans in control — Aipify Product Companion prepares import, translation, rewriting, SEO, and category suggestions; humans choose draft, review, or approved publish paths. No silent auto-publish.**

## Objectives

| Objective | Description |
|-----------|-------------|
| **Product import automation** | Import from Shopify, WooCommerce, CSV, supplier feeds — awaiting review by default |
| **Localization & translation** | no/en/sv/da/de/fr and additional language scaffold — human review before publish |
| **Brand voice rewriting** | Professional, luxury, sport performance, and custom brand voice modes |
| **SEO optimization** | Title, meta, keywords, structured data recommendations — apply with approval |
| **Category & quality readiness** | Category suggestions and quality validation before store-ready status |
| **Approval workflow integration** | Draft, human review, and optional auto paths — cross-link Trust & Action and Workflow Orchestration |

## Product import automation

Supplier feeds, platform install catalog, CSV/XML/API imports — all products land in `awaiting_review` until human approval. Cross-link Commerce Intelligence Phase 101 for pre-import discovery.

## Product translation

Supported locales: **no**, **en**, **sv**, **da**, **de**, **fr** plus additional languages scaffold. Translation versions stored for review — never silent overwrite of published content.

## Product rewriting (🦉 🌹 🔔)

| Emoji | Focus |
|-------|-------|
| 🦉 | Brand voice consistency — tone, forbidden terms, preferred terminology |
| 🌹 | Creative enhancement without losing product truth — sport performance, luxury, minimalistic modes |
| 🔔 | When rewriting should pause for human review — low confidence or brand-sensitive categories |

## SEO optimization

Title length, keywords, meta descriptions, headings, internal links, structured data, image alt, FAQ content — recommendations with priority and rationale; human applies or dismisses.

## Category recommendations (🦉 🌹 🔔)

| Emoji | Focus |
|-------|-------|
| 🦉 | Primary and secondary category fit — collection assignments with confidence |
| 🌹 | Tags and merchandising alignment with store identity |
| 🔔 | When category confidence is low — human review before publish |

## Product quality checks

Missing images, thin descriptions, price anomalies, duplicate titles, inventory gaps — quality warnings with severity; resolved before approval when possible.

## Companion guidance (🦉 🌹 🔔)

Product Companion scaffolds automation steps — warm, optional, non-intrusive. Never auto-publishes or bypasses approval.

## Workflow automation

Pipeline steps: **import → translate → rewrite → SEO → categories → approval → publish**. Bulk automation queues with human checkpoint before publish. Cross-link Workflow Orchestration Phase 86 for multi-step approval orchestration.

## Approval principles

| Mode | Description |
|------|-------------|
| **Draft** | Save prepared content without publishing — default safe path |
| **Human review** | Mandatory approval before publication — `auto_publish_disabled` default true |
| **Auto publish** | Tenant-controlled opt-in only — never default; Trust & Action context for sensitive changes |
| **Approval workflows** | Cross-link `/app/approvals` and Workflow Orchestration Phase 86 |

## Self Love connection

Sustainable catalog pacing — batch automation without burnout:

*"We accomplished in minutes what previously required hours — without sacrificing quality or strategic judgment."*

Route `/app/self-love-engine` — principle only.

## Trust connection

Transparent automation steps, explainable SEO and category suggestions, audited approval decisions, metadata-only bulk summaries — full audit via product automation audit log.

## Distinctions

| Surface | Route | Distinction |
|---------|-------|-------------|
| Product Automation (repo Phase 102) | `/app/product-automation` | **This blueprint extends** — import through publish preparation |
| Commerce Intelligence (Phase 101) | `/app/commerce-intelligence` | Discovery and opportunity evaluation — cross-link before import |
| Dropshipping Operations (Phase 103) | `/app/dropshipping-operations` | Supplier monitoring and order health — operational cross-link |
| Workflow Orchestration (Phase 86) | `/app/workflow-orchestration-engine` | Multi-step approval orchestration — cross-link |
| Trust & Action | `/app/approvals` | Human review before publish — mandatory checkpoint |

## Dogfooding

**Sportsklær.no:** Shopify catalog import, Nordic locale translation (no/sv/da), sport performance rewriting, SEO for active lifestyle products, supplier sync context.  
**Aipify Group:** internal validation of Product Companion tone, approval principles, and KC FAQ.

## Vision

*"We accomplished in minutes what previously required hours."*

## Technical

| Item | Location |
|------|----------|
| Baseline migration | `supabase/migrations/20260701000000_product_automation_engine_phase102.sql` |
| Blueprint migration | `supabase/migrations/20261125000000_implementation_blueprint_phase102_product_automation.sql` |
| Prefix | `_paebp102_*` |
| Dashboard RPC | `get_product_automation_dashboard()` — all baseline fields + `product_automation_blueprint` block |
| Card RPC | `get_product_automation_card()` — baseline + Phase 102 framing |
| ILM | `lib/internal-language-model/implementation-blueprint-phase102-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/product-automation/faq/implementation-blueprint-phase102-faq.md` |
