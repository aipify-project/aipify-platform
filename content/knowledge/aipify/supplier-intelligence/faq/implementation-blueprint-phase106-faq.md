# Supplier Intelligence & Relationship (ABOS Phase 106) — FAQ

## What is Blueprint Phase 106?

**Supplier Intelligence & Relationship Engine** extends repo Phase 106 at `/app/supplier-intelligence` with ABOS partnership stewardship scaffolding — supplier health, diversification, relationship records, and stewardship recommendations. Humans remain accountable for every supplier decision.

## How is this different from Dropshipping Operations Phase 103?

**Dropshipping Operations** (`/app/dropshipping-operations`) handles operational supplier monitoring for dropshipping — fulfillment, delivery risks, watchlists, and escalations. **Supplier Intelligence Phase 106** handles partnership stewardship — relationship quality, diversification, renewal prep, and long-term supplier portfolio health. Cross-link, not duplicate.

## How is this different from Commerce Intelligence Phase 101?

**Commerce Intelligence** (`/app/commerce-intelligence`) discovers products and supplier scores before catalog commitment. **Supplier Intelligence Phase 106** stewards existing supplier relationships after products are in the portfolio.

## What safety principles apply?

- `auto_replacement_disabled` true by default — no automatic supplier replacement
- Partnership not extraction — no encouraging unnecessary supplier switching
- Human oversight required for supplier relationship changes
- Cross-link **Trust & Action** at `/app/approvals` for sensitive decisions

## What cross-links does Phase 106 include?

Dropshipping Operations Phase 103 · Commerce Intelligence Phase 101 · Commerce Performance Phase 104 · Multi-Store Phase 105 · Marketplace Governance Phase 90 · Meeting Companion Phase 72 · Integration Engine A.8 · Trust & Action `/app/approvals` · Self Love A.76 · Knowledge Center

## What privacy principles apply?

Business metadata only — health scores, relationship summaries, diversification alerts. No raw supplier PII beyond business contact summaries. Platform sees aggregates only.

## Where is the technical implementation?

Baseline migration `20260720000000_supplier_intelligence_relationship_engine_phase106.sql`, blueprint migration `20261128000000_implementation_blueprint_phase106_supplier_intelligence_relationship.sql`, helpers `_sirbp106_*` (never collide with `_sir_*`), ILM `implementation-blueprint-phase106-supplier-intelligence-relationship.txt`, vocabulary `lib/internal-language-model/implementation-blueprint-phase106-vocabulary.ts`, i18n `customerApp.supplierIntelligence.*`
