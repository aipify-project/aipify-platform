# AIPIFY — KOMPIS WEB FREE 150 / PAID 2500 — BILLING · LICENSE · DOMAIN · QUOTA AUDIT V1

**Job type:** READ-ONLY technical mapping  
**Date:** 2026-10-13  
**origin/main SHA audited:** `6454e59ae7fd0a402dade634e8e570cbb8d128e6`  
**Prior APP context (not reopened):** Invoice receiver PR #172 / `dpl_2WG1QsXfw7pTCrMPePieJTtwHi75`; billing/modules PR #170  

## Executive verdict

| Product rule (new) | Can implement on existing schema alone? | Status |
|--------------------|-------------------------------------------|--------|
| Free **150 AI answers total** per site license (no card, no monthly reset) | **NO** — answer-quota meter MISSING | **MISSING** |
| Threshold notices at 30 / 10 / 0 (+ APP + email, localized) | **NO** — no customer transactional email catalog; no quota events | **MISSING** |
| Paid **2500 / month** per site; monthly or annual payment; monthly quota renewal | **NO** — no WK Stripe SKU; annual Price wiring PARTIAL; no monthly answer meter | **MISSING** / **PARTIAL** platform billing |
| Verified upgrade: free 150 → paid 2500 without double-counting | **NO** — no free lifetime meter to migrate | **MISSING** |
| Multi-site per org + site selector + per-site FAQ/knowledge/license/quota | Schema multi-install **EXISTING**; APP site selector **MISSING**; FAQ tenant-primary with optional install | **PARTIAL** |
| APP invoices read-only | **EXISTING** (PR #172) | **EXISTING** |
| Fail-closed entitlement beyond Stripe | License/domain/install gates **EXISTING** | **EXISTING** |
| 3-day payment grace as Kompis Web policy | Engine constant **EXISTING** for license service status — **not** approved as WK commercial decision | **EXISTING (generic)** / **UNDECIDED (WK)** |

**This audit wrote nothing to DB, Stripe, or Production.**  
**Frozen Website Kompis Public Chain protected runtime files touched: 0** (read-only inspection of 46 paths).  
**No code change · no PR · no deploy · no migration · no payment · no email send.**

---

## A. Customer / site / license

### Canonical identity bridge — EXISTING

```
auth.users → users.company_id → companies
companies ←1:1→ customers (company_id)
customers.id = organizations.id   (explicit tenant bridge)
```

| Piece | Status | Evidence |
|-------|--------|----------|
| Companies / customers / organizations | EXISTING | `20260610150000_multi_tenant_foundation.sql`, `20260610190000_…`, `20260706000000_…phase_a1.sql` |
| APP org context | EXISTING | `lib/tenant/resolve-app-organization-context.ts` · `get_app_organization_context` |
| Multi-org selection | EXISTING | `selection_required` + tenant bootstrap (org switcher, **not** site) |
| Parallel module tables | PARTIAL | `organization_modules` vs `tenant_modules` (customer-scoped commercial packages) |

### Multi-site / multi-install — PARTIAL

| Layer | Status | Evidence |
|-------|--------|----------|
| Many installs per company/customer | EXISTING | `installations` · `assert_license_capacity` (`p_check_installation` / `p_check_domain`) · `20260610290000_license_domain_foundation.sql` |
| Plan caps (`max_installations` / `max_domains`) | EXISTING | `plans` / `subscriptions` |
| APP **site selector** (Website Kompis) | **MISSING** | No SiteSelector under `components/app/website-kompis/`; connection UI is org/tenant aggregate |
| Dual domain stores | PARTIAL | `organization_domains` (APP UI) vs `customer_domains` (runtime) — Build 66 documents SOT gap |
| WK activation requires verified+active domain + install | EXISTING | `activate_website_kompis_for_domain` · `20261932800000_website_kompis_domain_activation_binding.sql` |

**Org- vs site-scoped today**

| Surface | Primary scope | Site/install dimension |
|---------|---------------|------------------------|
| Public FAQ | `tenant_id` (customers) | Optional `install_id` / `domain` (`tenant_public_companion_faq_items`) |
| Install config | tenant + install | Unique per install |
| Public site index | tenant + verified_host | Optional install |
| Connection / license panel | org/tenant aggregate | Per-domain install binding (masked) |
| Bedrift / EKE | tenant (internal) | Must stay private — not public retrieval |

### Website Kompis vs Kompis Bedrift — PARTIAL

| | Website Kompis | Kompis Bedrift |
|--|----------------|----------------|
| Nav | `KOMPIS_WEB_FLAT_NAV` · `moduleKey: website_kompis` | Separate Bedrift nav |
| Module gate | Hard `is_tenant_module_enabled('website_kompis')` fail-closed | Soft / no dedicated `tenant_modules` row yet |
| Knowledge | Public FAQ / site index | EKE internal — **must never** feed public ask |

### Lifetime / free-once / grandfather — PARTIAL / MISSING

| Concern | Status | Notes |
|---------|--------|-------|
| Lifetime as plan/billing presentation | EXISTING | Platform license overview · `license_type` / lifetime seeds |
| Free **150 lifetime answers once per real site** | **MISSING** | No site-scoped answer lifetime ledger |
| Prevent reinstall/recreate resetting free quota | **MISSING** | Needs durable site identity (domain fingerprint / verified domain id) + ledger |
| Automatic migrate Lifetime → Free/Paid | **MISSING** (good) | Must stay explicit grandfather policy — do **not** auto-suspend test/legacy tenants |

### Minimal safe multi-site model (proposal — not implemented)

1. Keep `organizations`/`customers` as account; installs + verified `customer_domains` as sites.  
2. Add APP **site selector** bound to install/domain id.  
3. Scope FAQ/knowledge writes to selected site (`install_id` + verified domain).  
4. Scope **quota ledger** and **license entitlement** to site license id.  
5. Account-level invoice list; line items reference site license (schema gap today).  
6. Preserve existing rows; no destructive remap of Lifetime without owner migration plan.  
7. Domain policy (www/apex/subdomain, migration to new domain without free-quota reset) = **OWNER DECISION**.

---

## B. Answer metering / cost / abuse

### Authoritative public ask flow — EXISTING

| Layer | Path |
|-------|------|
| HTTP | `POST /api/marketing/companion/ask` · `app/api/marketing/companion/ask/route.ts` **[FROZEN]** |
| Orchestration | `lib/marketing/public-companion-ask.ts` **[FROZEN]** |
| Provider HTTP | `lib/kompis-operator/grounded-completion.ts` → OpenAI-compatible `/chat/completions` |
| Grounded synthesis | `lib/marketing/website-kompis-grounded-answer.ts` **[FROZEN]** |
| Cost gate | `lib/marketing/website-kompis-public-ai-cost-controls.ts` **[FROZEN]** |
| Trust | `website-kompis-licensed-availability-server.ts` **[FROZEN]** — install + verified domain |

### What exists vs product meter (150 / 2500)

| Concern | Status | Evidence |
|---------|--------|----------|
| Public AI **reserve/finalize** (provider call slots) | PARTIAL | Cost-controls TS + SQL `20261937700000_…` marked **PROPOSAL ONLY — NOT APPLIED** in repo; runtime may fail-closed without Core RPC |
| Proposed limit | PARTIAL | **60 grounded provider calls / hour / tenant** — **not** monthly answers, **not** 150 lifetime |
| Idempotency key on ask reserve | PARTIAL | RPC supports; ask path does not pass key |
| Token units on finalize | PARTIAL | Omitted on public finalize |
| **Billable “answer” counter (150/2500)** | **MISSING** | No product answer ledger |
| Deterministic FAQ/index/page answers | EXISTING | Bypass paid provider — unlimited by current cost control |
| Free-tier 100/month or 7-day trial in WK ask | **MISSING** | No product copy/code (7-day appears only as site-index stale window elsewhere) |
| Ask IP/visitor rate limit | MISSING | Visitor key used for **feedback** rate limit only |
| Domain spoof resistance | EXISTING | Verified domain + install binding; client domain not trusted alone |
| Streaming | MISSING | Single JSON response |

### Recommended billable “answer” definition (proposal)

**Count once** when: authenticated public ask completes a **visitor-visible assistant answer** that is allowed by policy **and** would have required (or reserved) a paid provider call **or** is explicitly classified as a metered completion under owner policy.

**Do not count (proposal defaults — OWNER CONFIRM):**

- Hard deny / private-scope / disabled install  
- Provider failure before any completion (if reservation released — today reserved_count is **not** released on error)  
- Pure client retry of identical idempotent key after prior finalize  
- Feedback posts  

**Ambiguity (OWNER DECISION):** Should deterministic FAQ/index/page answers consume the 150/2500 customer meter? Today they do **not** consume the provider cost gate. Product copy says “AI-svar” — likely **provider_grounded only**, but must be locked before build.

### Cut-off at 0 — proposal

1. Server check **before** provider reserve (and ideally before any paid call).  
2. Return controlled localized upgrade message; **no** further provider HTTP.  
3. Deterministic FAQ may still answer if OWNER allows non-metered paths.  
4. Fail closed if ledger RPC unavailable.  
5. Embed cannot raise quota by spoofing host — reuse verified install/domain trust.

### Internal provider cap — EXISTING pattern / separate from customer meter

Reuse hourly reservation style as **internal** cost ceiling (distinct from customer 150/2500). Do not invent dollar caps without telemetry (token finalize currently incomplete on public path).

### Paid monthly reset — MISSING (design needed)

| Topic | Proposal |
|-------|----------|
| Period | Calendar month or subscription `current_period_start` from Stripe (prefer Stripe period) |
| Timezone | UTC or tenant billing TZ — **OWNER DECISION** |
| Annual payment | Charge yearly; **grant 2500 each month** for 12 periods — not one uncontrolled year pool |
| Mid-cycle upgrade free→paid | Start paid period at upgrade instant; free remaining unused; **do not** subtract free consumed from first 2500 |
| Webhook out-of-order | Idempotent by Stripe `event.id` (today **MISSING**) + license state machine |

---

## C. Stripe / payment / subscription

**No `stripe` npm package** — raw REST in `lib/billing/stripe-client.ts`.

| Capability | Status | Evidence |
|------------|--------|----------|
| Checkout Session (subscription mode) | EXISTING | `createStripeCheckoutSession` · `POST /api/billing/create-checkout-session` |
| Customer Portal | EXISTING | `createStripePortalSession` · `POST /api/billing/create-portal-session` |
| Stripe Customer CRUD | MISSING | Checkout may pass `customer` / `customer_email` only |
| Product / Price APIs | MISSING / PARTIAL | Env `STRIPE_PRICE_ID_STARTER` / `STRIPE_PRICE_ID_{plan}` |
| Website Kompis Stripe SKUs (free/paid monthly/annual) | **MISSING** | No WK price IDs |
| Annual vs monthly Price selection | PARTIAL | DB `billing_cycle` monthly/yearly; public catalog monthly; **no** `_YEARLY` env prices |
| Webhook route | EXISTING | `app/api/webhooks/stripe/route.ts` |
| Signature verification | PARTIAL | HMAC only if secret **and** header present; else accepts unverified |
| Event idempotency (Stripe `event.id`) | **MISSING** | `payment_events` uses coalesce→`gen_random_uuid()` |
| Subscription lifecycle in Core | PARTIAL | `handle_payment_webhook_event` · statuses active/past_due/cancelled/trialing |
| Trial | EXISTING | Hardcoded **14 days** in checkout body — **conflicts** with new “no trial for free Kompis Web” rule if reused blindly |
| Tax/VAT | PARTIAL | App-side checkout VAT engine (NO/EU); **not** Stripe Tax on session |
| Proration API | MISSING | |
| Dunning (Stripe Smart Retries) | MISSING | Platform past-due ops UI PARTIAL |
| Sync Stripe Invoice → `enterprise_invoices` | **MISSING** | Parallel systems |
| Demo fallback | EXISTING | Missing `STRIPE_SECRET_KEY` / price → `demoMode: true` |

**LIVE vs DEMO:** Repo supports both. Production key presence = **UNKNOWN** from code alone (env not audited / not printed).

**Critical:** Entitlement must remain Core license/module/domain/install fail-closed — **never** Stripe status alone.

---

## D. Invoices and email

### Invoices — EXISTING issuer / EXISTING APP receiver / MISSING site lines

| Item | Status | Paths |
|------|--------|-------|
| Issuer | EXISTING | Platform/Core `enterprise_invoices` + RPCs · `EnterpriseInvoicesPanel` (`scope=platform`) |
| APP receiver | EXISTING | `/app/account/invoices` · PR #172 · no create · no Billing Profile Toggle |
| Pay URL / real PDF | MISSING | Honest unavailable UX |
| Invoice lines → site license | **MISSING** on enterprise path | Phase 586 `aipify_billing_invoice_records.invoice_lines` jsonb = PARTIAL unused |
| Stripe invoice document sync | MISSING | |

### Email — PARTIAL / MISSING for customer billing

| Item | Status | Notes |
|------|--------|-------|
| Resend transport | EXISTING | Partner outbox only (`lib/partner-communications-email/send.ts`) |
| `locales/**/emails/` catalogs | **MISSING** | Directory absent |
| payment_failed / upgrade / quota 30·10·0 / suspend templates | **MISSING** bodies | Enums/labels/queues exist without Resend templates |
| Announcement center email channel | PARTIAL | No Resend send path found |
| 30/10/0 threshold mail | **MISSING** | |
| Silent fake-success without `RESEND_API_KEY` | PARTIAL risk | Partner send returns `sent` when key missing |

**Language:** APP invoice UI covers en/no/sv/da/pl/uk. Customer transactional mail catalogs = hole. Knowledge language ≠ APP UI language (existing rule).

---

## E. Security / freeze / compatibility

| Control | Status |
|---------|--------|
| Tenant isolation + RLS on Core tables | EXISTING pattern |
| WK domain verification before activate | EXISTING |
| Module entitlement fail-closed (`website_kompis`) | EXISTING |
| Public ask trust (install + verified domain) | EXISTING |
| Bedrift knowledge excluded from public retrieval | EXISTING product separation (must preserve) |
| License payment grace constant 3 days | EXISTING in `lib/license/engine.ts` (`PAYMENT_GRACE_PERIOD_DAYS`) — **not** locked as WK commercial policy |
| Lifetime/legacy auto-move to free/paid | MUST NOT — grandfather policy required |

### Frozen Website Kompis Public Chain (46)

Manifest: `docs/integrations/website-kompis-public-chain-frozen-manifest.json` · `protectedRuntimeFiles` **count = 46**.

**If a future quota gate needs to meter public ask, these frozen files are the likely reopening set (owner-named approval required):**

1. `app/api/marketing/companion/ask/route.ts`  
2. `lib/marketing/public-companion-ask.ts`  
3. `lib/marketing/website-kompis-public-ai-cost-controls.ts`  
4. `lib/marketing/website-kompis-grounded-answer.ts` (if gate timing changes)  
5. `components/embed/WebsiteKompisEmbedWidget.tsx` + `lib/marketing/website-kompis-visitor-tone.ts` (exhausted UX)  
6. Possibly `lib/marketing/website-kompis-public-ask-trace.ts`  

**Safer first:** new Core tables/RPCs for answer ledger **outside** frozen files; wire only after explicit reopen. Prefer fail-closed deny **before** provider call without rewriting retrieval/ranking.

**Audit frozen diff = 0** (no file modifications to protected set).

---

## Data / authorization sketch (one org · many sites)

```
Organization / Customer (account login)
├── Users / roles (shared)
├── Billing profile / Stripe customer (account)     [PARTIAL today]
├── Invoices (account read-only list)              [EXISTING enterprise_invoices]
│     └── Lines → site license refs                [MISSING]
├── Site A: install + verified domain(s)
│     ├── website_kompis entitlement               [EXISTING module gate]
│     ├── FAQ / knowledge / languages (site-scoped)[PARTIAL — tenant primary]
│     ├── Free lifetime answer ledger (150)         [MISSING]
│     └── Paid subscription → 2500/mo meter         [MISSING]
└── Site B: separate install/domain/license/meter   [schema capacity EXISTING; APP selector MISSING]
```

Fail-closed chain for ask:

`verified install+domain → module entitlement → (future) answer quota → (existing) AI cost reserve → provider`.

---

## Owner decisions still open

1. **Prices / currency** for monthly and annual paid Kompis Web (explicitly not set in this job).  
2. **What counts as billable AI-svar** (provider_grounded only vs all visitor answers).  
3. **Domain identity** for free-once (apex vs www; subdomain; domain migration without free reset).  
4. **Payment grace / suspend** for Kompis Web — 3-day engine exists globally; **not approved** as WK policy.  
5. **Timezone / period anchor** for paid monthly renewal under annual payment.  
6. **Grandfather** rules for Lifetime / pilot / test tenants.  
7. **Whether deterministic answers remain free** after AI quota = 0.  
8. **Which Stripe Products/Prices** to create (Dashboard vs API) — requires separate billing authorization.  
9. **Whether public ask frozen files may be reopened** for quota UX, or ledger enforced only via new Core + minimal ask hook.  
10. **Email transport for customer billing** (extend Resend beyond partner vs new provider).

---

## Risk list (highest first)

1. Webhook signature optional + missing Stripe `event.id` idempotency → duplicate activations / quota grants.  
2. Checkout defaults **14-day trial** — wrong for “no trial; free 150 then pay”.  
3. Metering only provider calls today → unlimited deterministic answers; product expectation mismatch.  
4. Dual domain SOT → wrong site binding / quota on wrong install.  
5. No APP site selector → operators manage multi-site incorrectly.  
6. Stripe Invoice ≠ `enterprise_invoices` → APP invoice surface stays empty for card customers.  
7. Silent email “sent” without Resend key → false confidence on notices.  
8. Touching frozen ask chain without owner reopen → contract violation.  
9. Auto-applying free/paid to Lifetime tenants → commercial/trust damage.  
10. `cus_*` vs UUID bridge fragility in webhook → failed entitlement updates.

---

## Proposed build queue (DO NOT EXECUTE)

| # | Job | Depends on | Existing schema enough? | Sensitive auth required? |
|---|-----|------------|-------------------------|--------------------------|
| 1 | Core answer ledger: free 150 lifetime per site license + atomic consume + abuse/idempotency + cut-off RPC | Owner decisions 2–3, 7 | **NO — new SQL/RLS/RPC** | **YES** (schema + possibly frozen ask wire) |
| 2 | APP site selector + site-scoped FAQ/knowledge/license/usage views | Multi-site policy; domain SOT plan | PARTIAL (UI yes; SOT/FAQ scoping may need SQL) | Domain/SOT migration = **YES** if unifying tables |
| 3 | Meter UX 150→2500 + APP notices 30/10/0 + i18n | Job 1 | PARTIAL (APP UI) | Email catalogs = new; mail send = **YES** if production mail |
| 4 | Stripe Checkout monthly/annual WK prices + activation gates fail-closed + webhook idempotency repair | Prices (owner); Job 1 | PARTIAL Stripe shell | **YES** (Stripe products/prices, secrets, webhook) |
| 5 | Invoice/receipt sync or line items per site license + dunning/suspend policy + owner test | Jobs 1+4; grace policy | **NO** for line items / Stripe sync | **YES** (billing + possibly enterprise invoice schema) |

**If order must change:** Fix webhook idempotency + signature **before** any paid activation that grants quota (else unsafe). Can run as 4a before 4.

**Test ports (future jobs):** unit/contract for ledger; multi-tenant isolation; webhook replay; upgrade without double-count; site selector ACL; frozen WK diff 0 unless reopened; no Production loadtest; Safari auth visual separate.

---

## Capability matrix (summary)

| Area | EXISTING | PARTIAL | MISSING | UNKNOWN |
|------|----------|---------|---------|---------|
| Org/tenant bridge | ✓ | dual module tables | | |
| Multi-install capacity | ✓ | | APP site selector | |
| Domain verify + WK activate | ✓ | dual domain SOT | | |
| WK module entitlement | ✓ | Bedrift module soft | | |
| Lifetime license presentation | ✓ | | grandfather migration policy | |
| Public ask + provider | ✓ | | | |
| Provider hourly cost reserve | | ✓ proposal/RPC | monthly answer meter | Core apply state in prod |
| Free 150 / paid 2500 | | | ✓ | |
| Threshold emails 30/10/0 | | | ✓ | |
| Stripe Checkout/Portal | ✓ | demo fallback | WK SKUs; annual prices | Prod keys live? |
| Webhook crypto + idempotency | | ✓ | event.id uniqueness | |
| APP invoice receiver | ✓ | | pay/PDF; site lines | |
| Customer billing email catalogs | | partner Resend | `locales/**/emails` | |
| Frozen WK (46) | protected | | | |

---

## File / route / API map (audit anchors)

**License / install / domain:** `lib/license/engine.ts`, `lib/domain-license/`, `lib/website-kompis-connection/`, `lib/commercial-packages/`, `assert_license_capacity`, `get_customer_license_center`, `get_domain_license_center`, `activate_website_kompis_for_domain`

**Ask / cost:** `app/api/marketing/companion/ask/route.ts`, `lib/marketing/public-companion-ask.ts`, `website-kompis-public-ai-cost-controls.ts`, `grounded-completion.ts`, migration `20261937700000_…`

**Stripe:** `lib/billing/stripe-client.ts`, `app/api/billing/create-checkout-session/route.ts`, `create-portal-session`, `app/api/webhooks/stripe/route.ts`, `handle_payment_webhook_event`

**Invoices:** `lib/enterprise-invoicing/`, `app/api/enterprise-invoicing/`, `app/app/account/invoices/page.tsx`, Platform `enterprise-invoices`

**Email:** `lib/partner-communications-email/`, `lib/global-announcements/`, revenue notification queues (phase295) — no customer billing template tree

**Prior RESULT refs:** `AIPIFY_APP_INVOICE_RECEIVER_REPAIR_2026_10_13_RESULT.md`, `AIPIFY_APP_BILLING_MODULES_FUNCTIONAL_BUILD_2026_10_13_RESULT.md`, `AIPIFY_KOMPIS_WEB_CONNECTION_LICENSE_DOMAIN_VISIBILITY_BUILD_66_RESULT.md`

---

## Confirmation flags

- **DB WRITES** = **NO**  
- **STRIPE WRITES / test charges** = **NO**  
- **EMAIL SENDS** = **NO**  
- **CODE / PR / DEPLOY** = **NO**  
- **FROZEN WEBSITE KOMPIS DIFF** = **0**  
- **SECRETS / PII / card data in report** = **NO**  
- **IMPLEMENTATION STARTED** = **NO**  
- **OWNER VISUAL ACCEPTANCE** = N/A (audit)  
- **SAFE TO FREEZE APP DESIGN** = **NO** (unchanged)

---

## Stop

Audit complete. **Do not start implementation** until Svein authorizes a named build job (and separately authorizes any SQL, Stripe product/price creation, secrets, or frozen-chain reopen).
