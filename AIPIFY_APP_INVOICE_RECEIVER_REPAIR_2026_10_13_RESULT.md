# AIPIFY APP INVOICE RECEIVER REPAIR — 2026-10-13 RESULT

## Baseline / release

- **origin/main before work:** `f2f45362` (RESULT IDs for billing/modules #171)
- **Prior LIVE:** PR #170 · `dpl_E12F3QPqXrkkkVaf8CHHc4tNrCgg`
- **Branch:** `feature/app-invoice-receiver-repair-2026-10-13`
- **Feature head / PR / merge / APP deploy:** _(filled after LIVE)_
- **Canonical domain:** `https://app.aipify.ai`
- **Frozen Website Kompis protected files touched:** **0**

## Root cause — raw locale keys (“NEXT DUE TITLE”, “Empty”, …)

`/app/account/invoices` loaded dictionary splits `portalStructure` + `dashboard` only.  
`customerApp.enterpriseInvoicing.*` (including `customerWorkspace`) lives in **`locales/*/customer-app/core.json`**. Missing keys were humanized by `humanizeTranslationKey()` → Title Case fragments in Norwegian UI.

**Fix:** load `core` alongside existing splits on the invoices page.

## UX fixes

| Issue | Fix |
|-------|-----|
| Billing Profile Toggle | **Removed** entirely from customer invoice panel (no profile editor; APP remains receiver-only) |
| Green empty hero | Neutral card + “No upcoming invoice” + explanation |
| Thin “Empty” stripe | Professional history empty state with title + body |
| Overdue chip | “Payment required” / localized equivalent |

## Data sources (unchanged)

- Read: `GET /api/enterprise-invoicing/center?scope=tenant` → `enterprise_invoices`
- Pay CTA: only if verified `https` payment URL (still absent on type)
- PDF: none offered (issuer PDF still not exposed)
- **APP CREATES INVOICES = NO**

## Flags

- **APP CREATES INVOICES** = **NO**
- **BILLING PROFILE TOGGLE REMOVED** = **YES**
- **REAL PDF/PAY LINK ONLY** = **YES** (no fake controls)
- **FROZEN WEBSITE KOMPIS DIFF** = **0**
- **OWNER VISUAL ACCEPTANCE** = **PENDING**
- **SAFE TO FREEZE APP DESIGN** = **NO**
- **Safari authenticated visual** = **NOT RUN**

## Changed files

- `app/app/account/invoices/page.tsx`
- `components/shared/enterprise-invoicing/EnterpriseInvoiceDetailsPanel.tsx`
- `lib/enterprise-invoicing/types.ts`, `labels.ts`
- `lib/enterprise-invoicing/invoice-receiver-locale.test.ts`
- Locales en/no/sv/da/pl/uk `customer-app/core.json` + `platform.json` (empty-state strings)
- This RESULT
