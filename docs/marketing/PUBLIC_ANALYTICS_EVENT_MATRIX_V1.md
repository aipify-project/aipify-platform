# Public analytics event matrix V1

**Source of truth:** `lib/product-analytics/events.ts` · consent `lib/product-analytics/consent.ts` · GA4 `lib/product-analytics/ga4.ts` · page_view `lib/product-analytics/page-view.ts`  
**Shell:** `MarketingAnalyticsShell` + `AnalyticsConsentProvider` on `(kompis-sales)` and `(marketing)`.  
**Rules:** No extra tags · no duplicate SPA page_view · no PII/case body · Platform/Super excluded · purchase only after Core-confirmed payment (Agent 1).

| Event | Producer | Trigger | Consent | Dedupe | Owner |
|---|---|---|---|---|---|
| `page_view` | `product-analytics/page-view` via MarketingAnalyticsShell | Route change on public shells | Required | Path sanitize; SPA single fire | Shared marketing |
| `sign_up` | APP /start funnel | Workspace establish success | Required | Core-validated identity | APP / Agent 2 CX |
| `login` | Auth | Successful login | Required | Session | Auth |
| `begin_checkout` | Commerce | Server-confirmed checkout start | Required | `CORE_VALIDATED_EVENTS` | Agent 1 |
| `purchase` | Commerce | Server-confirmed payment | Required | `CORE_VALIDATED_EVENTS` — never click | Agent 1 |
| `module_view` | APP catalog | Module detail view | Required | — | Agent 2 |
| `module_activate` | APP | Core activation success | Required | Core-validated | Agent 2 |
| `trial_start` | Billing | Core trial window | Required | Core-validated | Agent 1 |
| `subscription_upgrade` | Billing | Core upgrade | Required | Core-validated | Agent 1 |
| `partner_referral_visit` | `/s/[code]` · `/p/*` | Attribution hit | Required | Code id only | Growth Partners |
| `partner_application_submit` | `/growth-partners` | Application submit success | Required | Application id | Growth Partners |
| `academy_started` · `academy_exam_completed` | Partners academy | Course/exam | Required | — | Partners |

**Not tracked (by design):** Support case bodies · internal notes · Platform Admin actions · Super Admin · secrets · email addresses in params (`sanitizeProductAnalyticsParams`).

**Gaps / follow-ups (no secret changes):** Confirm Production GA4 measurement ID already wired; do not rotate IDs in this job. No live purchase tests.
