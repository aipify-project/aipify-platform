# Partner Settlement & Self-Billing Engine — Phase 334

**Feature owner:** GROWTH PARTNER PORTAL

**Route:** `/partner/settlements`

**Migration:** `20261668000000_partner_settlement_self_billing_engine_phase334.sql`

## Purpose

At month end, Aipify prepares settlement drafts for Growth Partners with approved qualifying sales. Partners review and approve; Aipify generates legal self-billing invoices from the partner business to **Aipify Group AS** (Bergen, Norway) for accounting.

## Flow

1. Collect approved partner sales for the month (Phase 333 commission records).
2. Calculate commission totals.
3. Generate monthly settlement draft (`prepare_partner_monthly_settlement`).
4. Show settlement in Partner Portal.
5. Partner accepts self-billing agreement (required once).
6. Partner approves settlement.
7. Legal invoice generated with per-partner sequential numbering.
8. Invoice structured for Fiken-ready incoming supplier invoice payload.
9. Payment status tracked; history visible in portal.

## Empty settlement rule

If partner has zero approved sales / zero commission / no payable settlement:

- No draft, invoice, or accounting push is created.
- Portal shows: **No payable settlement this month.**

## APIs

- `GET /api/partner/settlements`
- `GET /api/partner/settlements/history`
- `GET /api/partner/settlements/[id]`
- `POST /api/partner/settlements/prepare`
- `POST /api/partner/settlements/agreement`
- `POST /api/partner/settlements/approve`

## Settlement statuses

`draft` · `awaiting_partner_approval` · `approved` · `invoice_generated` · `sent_to_accounting` · `paid` · `rejected` · `cancelled`

## RPCs

Helpers: `_gps334_*`

- `get_partner_settlements`
- `get_partner_settlements_history`
- `get_partner_settlement`
- `prepare_partner_monthly_settlement`
- `accept_partner_self_billing_agreement`
- `approve_partner_settlement`

## Tables

`growth_partner_portal_self_billing_agreements` · `growth_partner_portal_settlements` · `growth_partner_portal_settlement_items` · `growth_partner_portal_settlement_invoice_sequences` · `growth_partner_portal_settlement_invoices` · `growth_partner_portal_settlement_audit_logs`

## Partner approval text

> I confirm that this settlement is correct and authorize Aipify Group AS to generate this invoice on behalf of my business.

## Design principle

**Sell. Review. Approve. Get paid.** — Aipify handles administration.
