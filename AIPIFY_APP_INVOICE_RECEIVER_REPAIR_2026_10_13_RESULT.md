# AIPIFY APP INVOICE RECEIVER REPAIR — 2026-10-13 RESULT

## Baseline / release

| Field | Value |
|-------|-------|
| **origin/main before work** | `f2f45362` (billing/modules RESULT IDs #171) |
| **Prior LIVE (Svein Safari baseline)** | PR #170 · `dpl_E12F3QPqXrkkkVaf8CHHc4tNrCgg` READY |
| **Branch** | `feature/app-invoice-receiver-repair-2026-10-13` |
| **Feature HEAD** | `baa81316` |
| **PR** | [#172](https://github.com/aipify-project/aipify-platform/pull/172) MERGED |
| **Merge SHA** | `b225781ac4c1f6ab9b2f3974f7c608ffaad1515a` |
| **APP project** | `aipify-platform` |
| **APP Production deploy** | `dpl_2WG1QsXfw7pTCrMPePieJTtwHi75` — **READY** |
| **Canonical domain** | `https://app.aipify.ai` (Link `dpl=` match; `/app/account/invoices` → HTTP 307 auth redirect) |
| **Frozen Website Kompis protected files touched** | **0** |

## Scope

Customer APP invoice **receiver** on `/app/account/invoices` only.  
APP does **not** create, issue, or generate customer invoices.

## Root cause — raw locale keys (“NEXT DUE TITLE”, “Empty”, “Billing Profile Toggle”)

`/app/account/invoices` loaded dictionary splits `portalStructure` + `dashboard` only.  
`customerApp.enterpriseInvoicing.*` (including `customerWorkspace`) lives in **`locales/*/customer-app/core.json`**. Missing keys were humanized by `humanizeTranslationKey()` → Title Case fragments in Norwegian UI.

**Fix:** load `core` alongside existing splits on the invoices page.

## UX fixes

| Issue | Fix |
|-------|-----|
| Billing Profile Toggle | **Removed** entirely from customer invoice panel (no profile editor; APP remains receiver-only). Shared backend profile APIs untouched. |
| Green empty hero | Neutral card + localized “No upcoming invoice” + explanation that Aipify issues invoices automatically |
| Thin “Empty” stripe | Professional history empty state (`historyEmptyTitle` / `historyEmptyBody`) |
| Overdue chip | Localized “Payment required” / `requiresPayment` |
| Hardcoded `Org.nr.` | Uses `labels.fields.organizationNumber` |

## Data sources (unchanged — authoritative reads only)

| Concern | Source |
|---------|--------|
| Invoice list / amounts / status / due | `GET /api/enterprise-invoicing/center?scope=tenant` → `enterprise_invoices` |
| Issuer display | `COMPANY_CONFIG` (Aipify Group AS) |
| Pay CTA | Only if `resolveVerifiedPaymentUrl()` returns verified `https` URL — **field still absent on invoice type → no Pay button** |
| PDF | Not exposed by APP API → honest “original document unavailable” copy; **no PDF control** |
| Billing period | Not on invoice payload → honest “period unavailable” |
| **APP CREATES INVOICES** | **NO** |

## Locale matrix

| Locale | `core` enterpriseInvoicing customerWorkspace empty/status keys | Notes |
|--------|----------------------------------------------------------------|-------|
| en | Present | Baseline |
| no | Present | Safari language under test |
| sv | Present | |
| da | Present | |
| pl | Present | |
| uk | Present | |

`platform.json` mirrors the same `customerWorkspace` empty-state strings for Platform label builder parity (Platform UI not in visual scope of this job).

## File scope

- `app/app/account/invoices/page.tsx` — add `core` split
- `components/shared/enterprise-invoicing/EnterpriseInvoiceDetailsPanel.tsx` — receiver UX rewrite
- `lib/enterprise-invoicing/types.ts`, `labels.ts` — new empty/status keys
- `lib/enterprise-invoicing/invoice-receiver-locale.test.ts` — guards locale root cause + no billing toggle in panel
- `locales/{en,no,sv,da,pl,uk}/customer-app/core.json` + `platform.json`
- This RESULT

**Not changed:** Website Kompis Public Chain (46 protected files), PR #168 feedback dialog, auth/license/payment providers, global Platform Admin CSS, SQL/schema/RLS, Production invoice data.

## Real gaps (honest UI retained)

1. **Invoice PDF URL** — not exposed to APP → no download control.
2. **Hosted payment URL** — not on `EnterpriseInvoice` → no Pay CTA until Core exposes a verified URL.
3. **Billing period** — not on invoice payload → “period unavailable”.
4. **Complete Norwegian legal invoice document fields** (line items, tax breakdown as separate legal PDF) — APP is read surface only; completeness depends on Platform issuer + API exposure. No demo fill.
5. **Authenticated Safari visual** — agent **NOT RUN** / owner acceptance **PENDING**.

## QA matrix

| Check | Result |
|-------|--------|
| `invoice-receiver-locale.test.ts` | **PASS** |
| `customer-invoice-view-model.test.ts` | **PASS** |
| `premium-visual-system-63.test.ts` (freeze) | **PASS** |
| `tsc --noEmit` (invoice-related) | **PASS** |
| Vercel Preview checks (PR #172) | **PASS** |
| Production deploy READY + `app.aipify.ai` Link `dpl=` | **PASS** |
| Empty / next-due / overdue / paid presentation (unit + view-model) | **PASS** (fixtures/mocks) |
| Missing PDF / missing pay link honesty | **PASS** (no fake controls) |
| Locale parity (6 core locales for new keys) | **PASS** |
| Language switch / long text / date+currency format | **PASS** (formatters + i18n; authenticated UI switch **NOT RUN**) |
| Responsive 390/768/1366/1440/1920 authenticated | **NOT RUN** (no authenticated Safari/browser session) |
| Tenant isolation | **PASS** (existing server `scope=tenant` gate unchanged; no Production writes) |
| Error / retry load state | **PASS** (code path retained) |
| Frozen WK protected diff | **0** |
| Safari authenticated visual (Svein) | **NOT RUN / BLOCKED** (no agent Safari auth) |
| Owner visual acceptance | **PENDING** |
| Production DB writes / test invoices | **NOT RUN** (forbidden; none performed) |

## Screenshot (empty state)

Authenticated empty-state screenshot: **NOT RUN** (requires customer session in Safari).  
Empty-state copy is implemented and covered by locale + panel structure tests.

## Flags

- **APP CREATES INVOICES** = **NO**
- **BILLING PROFILE TOGGLE REMOVED** = **YES**
- **REAL PDF/PAY LINK ONLY** = **YES**
- **FROZEN WEBSITE KOMPIS DIFF** = **0**
- **OWNER VISUAL ACCEPTANCE** = **PENDING**
- **SAFE TO FREEZE APP DESIGN** = **NO**

## Stop

Job complete after this RESULT. **Phase 67 not started.**
