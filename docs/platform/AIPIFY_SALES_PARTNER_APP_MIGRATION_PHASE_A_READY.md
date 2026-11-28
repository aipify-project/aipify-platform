# AIPIFY_SALES_PARTNER_APP_MIGRATION_PHASE_A_READY

**Status:** READY  
**Phase:** A — IA / route / access contract only  
**Repo:** `aipify-project/aipify-platform`  
**Branch:** `feat/sales-partner-app-migration-phase-a-v1`  
**Preflight:** `AIPIFY_SALES_PARTNER_APP_MIGRATION_PREFLIGHT_READY`  
**Code contract:** `lib/sales-partner-app-migration/phase-a-contract.ts`  
**Tests:** `lib/sales-partner-app-migration/phase-a-contract.test.ts`

**Non-effects:** no SQL · no Production write · no redirects · no `/partners` retirement · no APP shell/nav cutover · no Agent 2 dependency/catalog SQL · no Agent 3 support file edits · no Stripe/checkout/gates · no commission rate changes

**Queued unchanged:** Production Persistence UI E2E BLOCKED (no Platform Admin session) · product-editor polish · Provisjonspriser polish

---

## Contract summary

| Item | Decision |
|------|----------|
| Future authenticated shell | **APP only** (`/app/sales-partner/*`) |
| Layout | `APP_CONTENT_MAX_WIDTH_PX=1560`, `AppLayoutClasses.pageWidth` / `pagePaddingX` |
| Identity | CSP `partner_identity` — **no** automatic APP product entitlement |
| Programs | Aipify certified CSP ≠ future external paid tenant seller module (not built in A/B) |
| Data | Reuse `csp_*` + `/api/certified-sales-partner/*` — no parallel store |
| Public | Keep `/p/*`, `/s/*`, cert verify, registration landings |
| Platform | `/platform/sellers/*` stays separate |
| Excluded | `/app/growth-partner/*`, `/app/partners` (certification engine), other sales engines |

---

## Route matrix (old → new)

Authoritative table: `SALES_PARTNER_APP_ROUTE_MATRIX` in `phase-a-contract.ts`.

| Capability | Current `/partners` | Target APP |
|------------|---------------------|------------|
| overview | `/partners` | `/app/sales-partner` |
| products | `/partners/marketing/product-catalog` | `/app/sales-partner/products` |
| links | `/partners/referrals/links` | `/app/sales-partner/links` |
| sales_page | `/partners/sales-page` | `/app/sales-partner/sales-page` |
| leads | `/partners/customers/leads` | `/app/sales-partner/leads` |
| customers | `/partners/customers/prospects` | `/app/sales-partner/customers` |
| pipeline | `/partners/customers/pipeline` | `/app/sales-partner/pipeline` |
| commissions | `/partners/settlement` (**CSP canonical**) | `/app/sales-partner/commissions` |
| academy | `/partners/academy/training` | `/app/sales-partner/academy` |
| certificates | `/partners/academy/certifications` | `/app/sales-partner/certificates` |
| tools | `/partners/marketing/assets` | `/app/sales-partner/tools` |
| materials | `/partners/marketing/assets?section=library` | `/app/sales-partner/materials` (distinct route) |
| email_templates | `/partners/marketing/email-templates` | `/app/sales-partner/email-templates` |
| messages | `/partners/account/messages` | `/app/sales-partner/messages` (thin host → Phase C reuse TBD) |
| notifications | `/partners/account/notifications` | reuse `/app/notifications` when proven |
| profile | `/partners/account/profile` | reuse `/app/profile` when proven |
| help | `/partners/account/settings` | reuse `/app/support` (Agent 3 fence) |

### Live APP binding gaps (proven — fix in Phase B bindings, not cutover)

| Nav id | Live href | Issue |
|--------|-----------|-------|
| `salesPartnerCustomers` | `/partners/customers` | missing page root |
| `salesPartnerAcademy` | `/partners/academy` | missing page root |
| `salesPartnerCommissions` | `/partners/business-continuity/commission` | diverges from CSP `/partners/settlement` |

---

## Access / role / tenant matrix

Statuses allowed (proven = `partner-access.ts`): `approved` · `active` · `certified` · `in_academy`  
Server gate: `lib/partners-portal/server-access.ts` (Growth **or** CSP). Suspended = hard deny.

| Actor | Module visible | Panel allowed |
|-------|----------------|---------------|
| APP customer, no partner | no | no |
| CSP approved seller | yes | yes |
| CSP suspended | no | no |
| Dual-role company + CSP | yes (identity) | yes; generic login prefers APP |
| Unauthenticated | no | no |
| Platform Admin | no (uses `/platform`) | no |

**Isolation gap (unknown / future):** external paid Sales Partner module per customer tenant — not designed; Phase A forbids building commercial multi-tenant seller engine. No cross-tenant ledger/settlement.

---

## Product display contract

- Authoritative: Product Center / Core (`csp_sales_products`, variant prices)  
- `publish_sale` vs `publish_app` remain distinct  
- Seller sees: images, info, price variants, commission, Info/Del, attribution link  
- Seller must **not** get a customer purchase CTA  
- No hard-coded prices; no Agent 2 dependency/catalog SQL in this stream  

---

## Migration requirements (Phase B — not fixed in old portal now)

1. **portal_load_60_120s** — `CspPortalSessionProvider` + portal RPC / `core-rpc` / layout gate  
2. **messages_missing_send** — `PartnersMessagesCenterPanel` composer/thread visibility  
3. **materials_section_query_panel_switch** — replace `?section=library` with `/app/sales-partner/materials`  

---

## Phase B exact next scope (order)

From `SALES_PARTNER_PHASE_B_FILE_PLAN`:

1. `lib/sales-partner-app-migration/phase-b-hosts.ts`  
2. `app/app/sales-partner/layout.tsx` (partner_identity gate + APP shell)  
3. `app/app/sales-partner/page.tsx`  
4. `app/app/sales-partner/products/page.tsx`  
5. Remaining thin host pages per matrix  
6. Locales `en/no/sv/da/pl/uk` (+ Buddy ES where applicable)  
7. `phase-b-hosts.test.ts`  

Still **no** `/partners` redirects/retirement (Phase D + owner YES).  
Phase C: shared APP surfaces.  
Phase D: controlled panel retirement.

---

## Proven vs unknown

See `SALES_PARTNER_PHASE_A_PROVEN_VS_UNKNOWN` in contract module.

**Proven:** CSP nav coverage · binding gaps · settlement canonical · statuses · 1560 width · dual-role login preference · manifest `partner_identity`  
**Unknown:** external tenant paid-module schema · messages merge into APP comms  

---

## Test plan (Phase A automated + later E2E)

Automated now: `npx tsx --test lib/sales-partner-app-migration/phase-a-contract.test.ts`

Later (Phase B+): ordinary APP customer · CSP seller · dual-role · unauthenticated · suspended · tenant isolation.

---

## STOP

No runtime cutover. Merge of **docs + contract tests only** after green checks.
