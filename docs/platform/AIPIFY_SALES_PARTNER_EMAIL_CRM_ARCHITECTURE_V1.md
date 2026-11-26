# Aipify Sales Partner — Email / CRM / Platform Finish V1

**Base:** `origin/main` @ `dddddae3a` (#380)  
**Branch:** `feat/sales-partner-email-crm-platform-finish-v1-20261126`  
**Worktree:** `/Users/veltrix/Development/aipify-sales-partner-email-crm-platform-finish-v1-20261126`

## Ownership

| Area | Owner this job | Notes |
|------|----------------|-------|
| Outbound marketing email templates + seller send UI | This job | Fail-closed until Resend + consent + owner send approval |
| Inbound reply → lead → notify | This job (contract + harness) | `REAL_INBOUND_E2E_BLOCKED` without verified inbound domain/webhook |
| Platform sellers nav short labels + Powered by footer | This job | Isolated locale/shell edits |
| CSP messages Core (#362 Staging) | Existing | Reuse for admin↔partner; do not mix channels unmarked |
| Website Kompis Public Chain | Frozen | Do not touch |
| Customer Sales Partner SaaS module | **Out of scope** | Boundary only |

## Existing anchors

- Sales copy: `lib/certified-sales-partner/sales-materials-catalog.ts`
- Attribution links: `lib/certified-sales-partner/attribution-policy.ts` → `/p/{code}/{product}`
- Lifecycle Resend: `lib/certified-sales-partner/onboarding-email.ts` (`partners@aipify.ai`)
- Partner messages APIs: `/api/certified-sales-partner/messages*`
- Marketing Center: `CertifiedSalesPartnerMarketingCenter.tsx`
- Platform sellers nav: `lib/platform/nav-config.ts` + `locales/*/platform.json`

## New modules (this job)

- `lib/certified-sales-partner/email-templates/` — approved template registry, placeholders, locale gate (no silent EN fallback)
- `lib/certified-sales-partner/email-outbound/` — send gate, idempotency, rate limit, delivery status honesty
- `lib/certified-sales-partner/email-inbound/` — webhook signature contract, correlation token, quarantine
- `docs/platform/sql-candidates/csp_sales_email_crm_v1.sql` — PREPARED_ONLY
- Seller UI: `/partners/marketing/email-templates`
- Platform UI: sellers materials/templates admin + shortened nav labels
- Shared: `components/branding/PoweredByAipifyFooter.tsx`

## Production gates (owner)

- SQL apply Staging → Production (`docs/platform/sql-candidates/csp_sales_email_crm_v1.sql`, content SHA256 `ed24863a…` in `.sha256`)  
- `RESEND_API_KEY`, SPF/DKIM, inbound domain, `CSP_EMAIL_INBOUND_WEBHOOK_SECRET`  
- `CSP_MARKETING_EMAIL_SEND_ENABLED=1` for any real outbound marketing send  
- Exact test send to owner-approved recipient (not hardcoded in app)  
- Consent/legal basis for marketing category  

## E2E status

`REAL_INBOUND_E2E_BLOCKED` — inbound webhook + CRM tables not Production-applied; no owner-approved live send/reply demonstrated.

## Status vocabulary

Outbound: `draft` · `queued` · `accepted_by_provider` · `delivered` · `bounced` · `failed`  
Never equate API 200 or `recorded` with delivered.
