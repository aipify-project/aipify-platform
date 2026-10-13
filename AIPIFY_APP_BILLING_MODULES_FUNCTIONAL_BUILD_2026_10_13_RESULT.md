# AIPIFY APP BILLING + MODULES FUNCTIONAL BUILD — 2026-10-13 RESULT

## Baseline / release

- **origin/main before work:** `13fe8a26` (feedback/footer RESULT IDs / PR #169)
- **Branch:** `feature/app-billing-modules-functional-2026-10-13`
- **Feature head:** `b38e0b96` (fix on `ae15a526`)
- **PR:** [#170](https://github.com/aipify-project/aipify-platform/pull/170) MERGED
- **Merge-SHA:** `d0ee7b0b9a421f3ee88f52e0b5eb787be4ba4b21`
- **APP deploy:** `dpl_E12F3QPqXrkkkVaf8CHHc4tNrCgg` — **READY**
- **Canonical domain:** `https://app.aipify.ai` (Link `dpl=` match; `/app/account/invoices` → HTTP 307 auth redirect)
- **Frozen Website Kompis protected files touched:** **0**

## Call-graph status (invoice)

| Link | Status | Evidence |
|------|--------|----------|
| Tenant → `GET /api/enterprise-invoicing/center?scope=tenant` | **VERIFIED** | `EnterpriseInvoiceDetailsPanel` |
| RPC `get_enterprise_invoice_billing_center` → `enterprise_invoices` | **VERIFIED** | existing route + types |
| Amount / currency / tax / total / due / status / KID / bank_reference | **VERIFIED** | `EnterpriseInvoice` fields |
| Issuer payee display | **VERIFIED** | `COMPANY_CONFIG` (Aipify Group AS) — display only |
| Billing period start–end | **UNKNOWN** | not on invoice type; UI shows honest unavailable |
| Hosted payment URL / checkout | **UNKNOWN** | no field; Pay CTA gated off unless future `https` URL |
| Original legal PDF from issuer | **UNKNOWN / stub** | `/pdf` returns `text/plain` — **no Download PDF button** (no fake PDF) |
| Mark-paid / destructive finance actions | **NOT IN SCOPE** | unchanged |

## Norwegian invoice field map (display)

| Field | Source | UI |
|-------|--------|-----|
| Invoice number | `invoice_number` | Yes |
| Issue date | `created_at` | Yes (as invoice date) |
| Seller name / org.nr. | `COMPANY_CONFIG` | Hero payee block |
| Buyer | billing profile / tenant_name | Profile panel |
| Description / product line | `description` | Details |
| Net / tax / total / currency | amount fields | Details |
| Due date | `due_date` | Hero + cards |
| KID / bank reference | `dnb_kid`, `bank_reference` | Pay-help when present |
| Period from–to | — | Gap reported |
| Original PDF | — | Gap; no fake download |

## Modules / products

| Source | Status |
|--------|--------|
| `get_customer_modules_center` via `/api/commercial-packages/modules` | **VERIFIED** list + enable/disable PATCH |
| Prices on module cards | **UNKNOWN** — never invented |
| Buy / upgrade checkout from module card | **NOT offered** (upgrade-required copy only) |
| Design Studio + Aipify Translator | **PLANNED** presentation only (`Coming later`) — no purchase/credits |

## Locale matrix

| Locale | Invoice `customerWorkspace` | Modules planned keys |
|--------|----------------------------|----------------------|
| en | Complete | Complete |
| no | Complete | Complete |
| sv | Complete | Complete |
| da | Complete | Complete |
| pl | Complete (enterpriseInvoicing subtree filled) | Complete |
| uk | Complete (enterpriseInvoicing subtree filled) | Complete |

## QA gates

| Gate | Result |
|------|--------|
| View-model unit test | PASS |
| Fake Pay / fake PDF | **Not shipped** |
| Production payment | **NOT RUN** (no verified URL) |
| Cross-tenant IDOR | Existing center RPC auth — **NOT re-audited** beyond reuse |
| Safari visual | NOT RUN |
| OWNER VISUAL ACCEPTANCE | PENDING |
| SAFE TO FREEZE APP DESIGN | **NO** |

## Changed files (inventory)

- `components/shared/enterprise-invoicing/EnterpriseInvoiceDetailsPanel.tsx`
- `lib/enterprise-invoicing/customer-invoice-view-model.ts` (+ test)
- `lib/enterprise-invoicing/types.ts`, `labels.ts`, `index.ts`
- `app/app/account/invoices/page.tsx`
- `components/app/settings/ModulesAdminPanel.tsx`
- `lib/commercial-packages/modules-panel-labels.ts`
- `app/app/settings/modules/page.tsx`, `app/app/kompis-bedrift/modules/page.tsx`
- Locales: `customer-app/core.json`, `customer-app/settings.json`, `platform.json` (en/no/sv/da/pl/uk)
- This RESULT
