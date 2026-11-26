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
- `docs/platform/sql-candidates/csp_sales_email_crm_v1.sql` — PREPARED_ONLY canonical V2. Hash method: `shasum -a 256` of the exact file bytes. The digest is only in `csp_sales_email_crm_v1.sql.sha256`. Do not paste it into the SQL file. The earlier recorded digest `ed24863a…` does not match any committed blob and is retired.
- Seller UI: `/partners/marketing/email-templates` and `/partners/marketing/email-inbox`
- Canonical API: `/api/certified-sales-partner/email/marketing-send`, `/inbound`, `/notifications`, `/thread`
- Platform admin events: `/api/platform/sellers/sales-email/events`
- Shared: `components/branding/PoweredByAipifyFooter.tsx`

## Canonical config

`CSP_SALES_EMAIL_OUTBOUND=owner_approved`  
`CSP_SALES_EMAIL_LAWFUL_BASIS=owner_recorded`  
`CSP_SALES_EMAIL_ALLOWLIST`  
`CSP_SALES_EMAIL_REPLY_DOMAIN`  
`CSP_SALES_EMAIL_TOKEN_SECRET`  
`RESEND_WEBHOOK_SECRET` or `CSP_SALES_EMAIL_INBOUND_SECRET`  
`RESEND_API_KEY`

`CSP_MARKETING_EMAIL_SEND_ENABLED` and `CSP_EMAIL_INBOUND_WEBHOOK_SECRET` are retired and do not unlock anything.

From stays `Aipify Group AS <partners@aipify.ai>`. Reply-To is `Aipify <reply+{token}@{CSP_SALES_EMAIL_REPLY_DOMAIN}>` and is set only on an authorized sales send.

## Rollout

Staging approval and Production approval are separate. This change does not apply SQL, does not set secrets, does not change DNS, and does not send mail.

Staging, after approval: apply the SQL file whose `shasum -a 256` matches the sibling digest, on a Staging database that already has `csp_partner_profiles`, `csp_sales_products`, `csp_product_certifications`, `auth.uid()`, and `is_platform_admin()`. Then set the config above for one allowlisted recipient. Send one message. Reply once. Confirm one lead, one unread notification, no new `csp_commission_ledger` row, and no access for a second seller.

Production, after Staging passes and a second approval: apply the same file bytes, then repeat one approved send and one reply. Do not call `csp_sales_email_purge_expired`.

Staging has since applied `csp_sales_email_crm_v1.sql` at the digest above. `service_role` still has TRUNCATE, REFERENCES, TRIGGER, and MAINTAIN on the seven new tables because postgres default privileges granted them and the original file did not revoke `service_role`. The prepared fix is `docs/platform/sql-candidates/csp_sales_email_crm_v1_revoke_service_table_privileges_v1.sql`. It is not applied. Production must not apply the original file alone. The next approval is that patch on Staging. A later Production approval, if given, applies the original file and then the patch, in that order.

## Compensation

If the new tables were applied and must be removed, drop only the `csp_sales_email_*` tables and functions created by this file, in dependency order, after exporting any rows the owner wants to keep. Do not delete historical CSP sales, settlements, or commission ledger rows. Do not run the retention function as part of rollback. The unapplied V1 table names were never created by this file.

## Production gates (owner)

- SQL apply Staging, then Production, as two approvals (`docs/platform/sql-candidates/csp_sales_email_crm_v1.sql`, digest from `shasum -a 256` of that file, recorded in the sibling `.sha256`)  
- `RESEND_API_KEY`, SPF/DKIM, inbound domain, `RESEND_WEBHOOK_SECRET` or `CSP_SALES_EMAIL_INBOUND_SECRET`  
- `CSP_SALES_EMAIL_OUTBOUND=owner_approved` plus lawful basis, allowlist, reply domain, and token secret  
- Exact test send to an owner-approved recipient (not hardcoded in app)  
- Consent/legal basis for marketing category  

## E2E status

`REAL_INBOUND_E2E_BLOCKED` — inbound webhook + CRM tables not Production-applied; no owner-approved live send/reply demonstrated.

## Status vocabulary

Outbound: `draft` · `queued` · `accepted_by_provider` · `delivered` · `bounced` · `failed`  
Never equate API 200 or `recorded` with delivered.
