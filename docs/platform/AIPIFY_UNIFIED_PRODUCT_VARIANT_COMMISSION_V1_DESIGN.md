# AIPIFY_UNIFIED_PRODUCT_VARIANT_COMMISSION_V1 — Phase 1 Design

| Field | Value |
|-------|--------|
| Date | 2026-11-28 |
| Repo | `aipify-project/aipify-platform` |
| Phase | **1 — design only** |
| Gates | `NO_SQL_APPLY` · `NO_PRODUCTION_WRITE` · `NO_STRIPE_CHANGE` · `NO_PAYMENT` · `NO_COMMISSION_CHANGE` · `NO_MERGE` |
| **Status** | **`AIPIFY_UNIFIED_PRODUCT_VARIANT_COMMISSION_DESIGN_READY`** |

Authoritative create surface: **Platform Admin → Opprett produkt** (`/platform/sellers/products/new` · edit `/platform/sellers/products/[productKey]`).

---

## 1. Current-state map (verified)

### 1.1 Live Core tables (Staging `auedugihkduoaikfusqe` · Production `qbcqoixhrvhnuwphefvw`)

| Table | Role today | Gap vs goal |
|-------|------------|-------------|
| `csp_sales_products` | Master product (`id`, `product_key`, `fixed_commission_amount`, `currency`, `commission_model`, `percent_rate`, `percent_basis`, `publish_*`) | Commission is **product-level**, not variant × period |
| `csp_commission_rate_versions` | Historical **fixed** amounts per `product_id` + `effective_from` | No `variant_key`, no `billing_interval`, no percent columns |
| `csp_qualified_sales` | Sale rows with **snapshotted** `snapshot_amount` / `snapshot_rate_version_id` | Must remain immutable for existing rows |
| `csp_commission_ledger` | Ledger lines tied to qualified sales | Must not rewrite history |
| `csp_product_locale_copy` | Locale copy | Unrelated to commission math |
| `csp_product_certifications` | Partner product certification | Unrelated |

**Not present** on Staging or Production:

- `csp_product_variants`
- `csp_product_variant_prices`

Candidate (PREPARED_ONLY): `docs/platform/sql-candidates/csp_product_variants_billing_v1.sql`  
(prices + VAT label; **no commission columns**).

### 1.2 Production product / rate snapshot (read-only)

| product_key | fixed_commission_amount | rate version amount |
|-------------|------------------------:|--------------------:|
| `kompis_web` | 500 NOK | 500 |
| `kompis_bedrift` | 800 NOK | 800 |
| `aipify_voice` | 0 NOK | 0 |

`qualified_sales` count on Production at design time: **0** (still protect snapshot contract).

### 1.3 Code already aligned (partial)

| Module | What it does | Limit |
|--------|--------------|-------|
| `lib/product-catalog/commission-rules.ts` | Interval qualification: month → 2nd paid period; year/one_time → 1st; renewals excluded | Fixed model only; percent blocked |
| `lib/product-catalog/percent-commission-contract.ts` | Documents preferred basis `net_ex_vat_after_discount`; **not activatable** | Needs Core settlement |
| `lib/certified-sales-partner/commission-rules.ts` | Product-level fixed snapshot + **two paid periods for all** | Must be aligned to interval rules in later phase |
| `ProductVariantBuilder` | UI drafts month/year/one_time prices | Local state until variant SQL |
| `ProductShopifyEditor` | Create/edit product; single fixed commission field | Not variant-scoped |
| `/platform/sellers/commission-rates` | Lists `csp_commission_rate_versions` | Read-only product-level; not same editor as Opprett produkt |

### 1.4 Authoritative UI ownership

| Concern | Owner surface |
|---------|---------------|
| Create / edit product, variants, prices, commission rules | **Opprett produkt** (Shopify-style editor) |
| View / edit same commission rules (no second truth) | **Provisjonspriser** (`commission-rates`) — thin client over same Core RPCs |
| Seller / partner panels | **Read Core only** — never hardcode product, price, or commission |

---

## 2. Target data model (exact)

### 2.1 Principles

1. One product identity: `csp_sales_products.id` / `product_key` — **IDs preserved**.
2. Variants and interval prices are first-class Core rows (extend existing candidate).
3. Commission rules are versioned per **`(product_id, variant_key, billing_interval)`**.
4. Prices stored **ex VAT** (`vat_label = 'exclusive'` for new writes; display “ekskl. MVA”).
5. Historical `csp_commission_rate_versions` and all `csp_qualified_sales` / ledger rows stay unchanged.
6. New products/variants use the same schema — no per-SKU special cases.

### 2.2 Tables

#### A. Keep / apply (from existing candidate, additive)

`csp_product_variants` · `csp_product_variant_prices` as in `csp_product_variants_billing_v1.sql`, with these **design constraints**:

- `billing_interval ∈ ('month','year','one_time')`
- New Platform writes set `vat_label = 'exclusive'` (never invent Stripe objects; `provider_price_id` optional mapping only)
- Single-price products: one active variant (e.g. `variant_key = 'default'`) with exactly one active price interval

#### B. New Core table (Phase 2 SQL candidate — not written/applied in Phase 1)

```text
csp_variant_commission_rate_versions
  id                          uuid PK
  product_id                  uuid NOT NULL → csp_sales_products(id)
  variant_key                 text NOT NULL
  billing_interval            text NOT NULL CHECK (month|year|one_time)
  model                       text NOT NULL CHECK (fixed|percent)
  amount                      numeric     -- required when model=fixed (major currency units)
  rate_pct                    numeric     -- required when model=percent (0–100)
  currency                    text NOT NULL
  percent_basis               text        -- required when model=percent;
                                          -- authoritative: net_ex_vat_after_discount
  effective_from              timestamptz NOT NULL
  created_at                  timestamptz NOT NULL DEFAULT now()
  created_by                  uuid NULL  -- platform admin auth id when known
  supersedes_id               uuid NULL  -- prior version row (optional chain)
  notes                       text NULL  -- internal admin note only
```

Indexes:

- `(product_id, variant_key, billing_interval, effective_from DESC)` for pick-effective
- FK integrity to product; soft consistency with variants via `(product_key derived from product, variant_key)` in RPC validation

Check constraints:

- `fixed` ⇒ `amount IS NOT NULL AND amount >= 0 AND rate_pct IS NULL`
- `percent` ⇒ `rate_pct IS NOT NULL AND rate_pct >= 0 AND rate_pct <= 100 AND amount IS NULL`
- `percent_basis` only when `percent` (default / only allowed value initially: `net_ex_vat_after_discount`)

#### C. Compatibility columns on `csp_sales_products` (read path)

Keep existing:

- `fixed_commission_amount`, `commission_model`, `percent_rate`, `percent_basis`

**Semantics after cutover (read):**

- Deprecated as **source of truth** for new settlement.
- Still readable for legacy UI fallback until backfill verified.
- New writes from Opprett produkt update **variant commission versions**; optionally mirror a “display default” onto product row for backward-compatible list cards (same values as default variant’s primary interval) — never the reverse as authority.

#### D. Immutable history

| Object | Rule |
|--------|------|
| Existing `csp_commission_rate_versions` rows | **No UPDATE of amount/currency/effective_from**; retain forever |
| Existing `csp_qualified_sales.snapshot_*` | **Never recalculate** |
| Existing ledger lines | **Never rewrite amounts** |
| New sales after cutover | Snapshot from `csp_variant_commission_rate_versions` (+ bind `variant_key`, `billing_interval` on sale when columns added in a later additive migration) |

**Optional additive columns on `csp_qualified_sales` (future, separate SQL):**  
`variant_key`, `billing_interval`, `snapshot_model`, `snapshot_rate_pct`, `snapshot_basis` — nullable for legacy rows.

### 2.3 Qualification contract (authoritative)

| Interval | Accrue when | Pending | Renewals |
|----------|-------------|---------|----------|
| `month` | 2nd successful **paid** period | After 1st paid period | **No** commission |
| `year` | 1st successful paid annual charge | — | **No** renewal commission |
| `one_time` | 1st successful paid capture | — | N/A |

Refunds / chargebacks / cancel: reclassify status; **do not delete** history (existing CSP behavior).

Percent accrual (when Core later activates settlement): compute on **`net_ex_vat_after_discount`** of the qualifying invoice capture; round half-up in invoice currency minor units. **Not activated in Phase 1–2 UI-only work** without separate settlement YES.

### 2.4 Tax / Stripe display (clarify only — `NO_STRIPE_CHANGE`)

| Layer | Rule |
|-------|------|
| Core price amount | Stored **ex VAT** |
| Platform Admin UI | Label prices “ekskl. MVA” / exclusive |
| Catalog display | Show exclusive amount + VAT note; never invent inclusive total without tax engine |
| Stripe (future) | Prefer Stripe **exclusive** tax behavior / `tax_behavior=exclusive` when prices are created — **out of scope this phase**; no Stripe API calls |
| Commission percent basis | Net exclusive of VAT after discount |

---

## 3. UI plan

### 3.1 Opprett produkt (authoritative)

Extend Product Center editor (keep layout):

1. **Product identity** — key, locales, channels (existing).
2. **Variants** — persist via Core RPCs once variant SQL applied (replace local-only draft).
3. **Per variant × interval** price fields (month / year / one_time) — exclusive NOK.
4. **Per variant × interval** commission block:
   - Model: Fast beløp (NOK) | Prosent
   - Fixed: amount
   - Percent: rate % + locked basis label “netto salgsbeløp ekskl. MVA”
   - Effective-from (default now) → inserts **new** rate version (never mutates old)
5. Single-price products: UI offers one variant with one interval; still writes variant + commission version rows.

### 3.2 Provisjonspriser

- Same Core list/upsert RPCs as editor.
- Table columns: product · variant · period · model · amount/rate · effective_from · status.
- Edit opens the **same** form fields (or deep-link into product editor commission section).
- **No parallel storage.**

### 3.3 Seller / partner surfaces

- Continue to load products and commissions from Core overview RPCs / catalog merge.
- Remove any remaining hardcoded commission copy in later implementation PR (audit checklist).
- Fail-closed if variant commission missing for a purchasable interval.

### 3.4 APP / Bedrift regression guardrails

| Flow | Expectation |
|------|-------------|
| APP publish / catalog | Unchanged channel flags; prices remain planned until checkout gate |
| Kompis Bedrift / Kompis Web SALE cards | Still Core-backed titles + commission display from effective rule |
| Entitlements / modules | Untouched |
| Checkout / Stripe | Still blocked — no enablement |

---

## 4. Migration plan (later phases — not applied now)

| Step | Action | Gate |
|------|--------|------|
| M0 | Apply existing `csp_product_variants_billing_v1.sql` (Staging → QA → Production) | Owner YES Staging, then Production |
| M1 | New SQL candidate: `csp_variant_commission_rate_versions` + RPCs `list_` / `upsert_` / `get_effective_` | Owner YES; `NO_COMMISSION_CHANGE` until backfill verified |
| M2 | Backfill: for each `csp_sales_products` + each existing product-level rate version, insert version rows for synthetic `variant_key='default'` and interval(s) present (or `month` if unknown) copying fixed amount; **do not alter** old `csp_commission_rate_versions` |
| M3 | Seed variants/prices for live products from Platform Admin (operator), not from migration hardcoding |
| M4 | Wire Opprett produkt + Provisjonspriser to new RPCs | Code PR |
| M5 | Align CSP earn threshold with interval rules (`lib/certified-sales-partner/commission-rules.ts`) | Code + Core settlement tests |
| M6 | Optional: additive columns on `csp_qualified_sales` for variant/interval snapshots | Separate YES |
| M7 | Percent settlement activation | Separate owner contract — not implied by M1 |

**Rollback:** soft-disable new RPCs; keep old product-level read path; never delete historical rate or sale rows.

---

## 5. RPC contract (planned)

| RPC | Purpose |
|-----|---------|
| `get_csp_product_variants_bundle(product_key)` | Existing candidate — extend response with `commission_rules[]` |
| `upsert_csp_product_variant` / `_price` | Existing candidate |
| `list_csp_variant_commission_rates(product_id\|null)` | Platform Provisjonspriser + editor |
| `upsert_csp_variant_commission_rate(payload)` | Insert-only new version (`effective_from`); reject in-place amount edits |
| `get_effective_csp_variant_commission(product_id, variant_key, interval, at)` | Settlement / snapshot helper |

All: `security definer`, platform-admin write; partner/APP read only published catalog projections.

---

## 6. Test contract

### 6.1 Code tests (implementable without SQL apply)

| ID | Assertion |
|----|-----------|
| T-C1 | `qualifyFixedCommission` month/year/one_time matches §2.3 |
| T-C2 | Percent UI helpers never mark activatable while Core blocked |
| T-C3 | Field ownership: commission authority = Core variant rates (after cutover flag) |
| T-C4 | Seller panel fixtures contain **no** hardcoded product_key prices/commissions |
| T-C5 | Editor payload validates exclusive VAT label for new prices |
| T-C6 | Single-variant product serializes one interval commission rule |

### 6.2 Staging Core tests (after M0–M2 YES)

| ID | Assertion |
|----|-----------|
| T-S1 | Upsert variant + price + commission version idempotent by natural keys |
| T-S2 | Editing commission creates new `effective_from` row; prior row unchanged |
| T-S3 | Backfill leaves `csp_commission_rate_versions` and any sales untouched |
| T-S4 | `get_effective` picks latest version ≤ `at` per variant×interval |
| T-S5 | APP/Bedrift publish flags unchanged by commission upsert |
| T-S6 | Partner catalog read returns rules from Core only |

### 6.3 Explicit non-tests this program

- No live Stripe price create
- No payment capture
- No Production commission ledger mutation
- No merge until owner opens implementation phase

---

## 7. What can be ordinary code vs Core

| Work | Type | Phase |
|------|------|-------|
| Design (this doc) | Docs | **1 — done** |
| Align CSP earn helpers to interval rules (pure functions + unit tests) | **Code** | 2a (safe, no money movement) |
| Opprett produkt UI: per-variant commission fields (fail-closed persist until RPC) | **Code** | 2a |
| Provisjonspriser UI bind to same client types | **Code** | 2a |
| Harden “no hardcode” seller catalog tests | **Code** | 2a |
| Exclusive VAT labels in editor/catalog copy (i18n) | **Code** | 2a |
| Apply / extend variant + commission SQL + RPCs | **Core SQL** | 2b — owner YES |
| Backfill default variant commission versions | **Core SQL** | 2b — owner YES |
| Snapshot variant/interval on new sales | **Core SQL** | 2c |
| Stripe exclusive tax_behavior | **Stripe** | Separate program |
| Percent payout activation | **Core settlement** | Separate YES |

---

## 8. Implementation sequence (after this design — not started)

1. Owner accepts this design (`DESIGN_READY`).
2. Code PR: UI + pure qualification alignment + tests (no SQL).
3. Owner YES: Staging apply variants SQL (M0) if not yet applied.
4. Owner YES: Staging apply variant commission versions (M1–M2) + QA.
5. Wire persistence; Staging E2E create product → Provisjonspriser shows same rules.
6. Separate Production YES; APP/Bedrift regression checklist.
7. Stop before Stripe/payment/percent activation unless separately approved.

---

## 9. Out of scope (hard)

- SQL apply / Production writes  
- Stripe API or Dashboard changes  
- Payment capture / settlement runs  
- Changing historical commissions or sales  
- Merging implementation PRs in Phase 1  
- Hardcoding Kompis Web / Bedrift prices in seller UI  

---

## 10. Status

**`AIPIFY_UNIFIED_PRODUCT_VARIANT_COMMISSION_DESIGN_READY`**

Stop before implementation.
