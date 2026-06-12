# Dropshipping Operations Center (ABOS Phase 103) — FAQ

## What is Blueprint Phase 103?

**Dropshipping Operations Center Engine** extends repo Phase 103 at `/app/dropshipping-operations` with ABOS operations scaffolding — supplier monitoring, order visibility, delivery intelligence, and profitability insights. Wisdom guides operations; humans remain accountable for every supplier action.

## How is this different from Product Automation Phase 102?

**Product Automation** (`/app/product-automation`) handles import, translation, SEO enrichment, and content approval after discovery. **Dropshipping Operations Phase 103** handles ongoing supplier monitoring, order health, delivery risks, escalations, and operational recommendations — import vs operations.

## How is this different from Commerce Intelligence Phase 101?

**Commerce Intelligence** (`/app/commerce-intelligence`) discovers products, trends, margins, and supplier scores before commitment. **Dropshipping Operations Phase 103** monitors live operations — fulfillment, delivery, refunds, and supplier performance after products are in the catalog.

## How is this different from Commerce Performance Phase 104?

**Commerce Performance & Profit** (`/app/commerce-performance`) focuses on profit intelligence and executive commerce reporting. **Phase 103** provides operational scaffolding with a cross-link to Phase 104 for detailed margin analysis — not a duplicate profit dashboard.

## What is the Phase 102 / Phase 103 collision note?

Roadmap text once listed "Phase 102 Dropshipping" but the repo assigns **Dropshipping to Phase 103** and **Product Automation to Phase 102**. This is documented in `_docbp103_distinction_note()` and this FAQ.

## What approval principles apply?

- Manual supplier actions — humans accountable
- `auto_actions_disabled` true by default — no silent auto-removal
- Supplier escalations return `requires_approval: true`
- Sensitive supplier actions cross-link **Trust & Action** at `/app/approvals`

## What cross-links does Phase 103 include?

Integration Engine A.8 · Commerce Intelligence Phase 101 · Product Automation Phase 102 · Commerce Performance Phase 104 · Trust & Action `/app/approvals` · Platform Install Phase 100 · Support Operations · Business DNA · Decision Support · Self Love A.76 · Knowledge Center

## What privacy principles apply?

Operational metadata only — supplier health scores, delivery risk summaries, order health trends. No raw customer PII, payment records, or chat content. Platform sees aggregates only.

## Where is the technical implementation?

Migration `20261126000000_implementation_blueprint_phase103_dropshipping_operations.sql`, helpers `_docbp103_*` (never collide with `_doc_*`), ILM `implementation-blueprint-phase103-dropshipping-operations.txt`, vocabulary `lib/internal-language-model/implementation-blueprint-phase103-vocabulary.ts`, i18n `customerApp.dropshippingOperations.*`
