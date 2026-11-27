# Platform Kunder Complete Customer 360 V1 — delivery report

**Date:** 2026-11-27  
**Branch:** `fix/platform-kunder-customer-360-v1-20261127`  
**Feature owner:** PLATFORM ADMIN  
**SQL / Stripe / email / Production Core writes:** not in scope (no migration in this PR)

## Delivered

1. **Kunder hub** with horizontal tabs: Oversikt | Organisasjoner | Kundesuksess  
   - Shell: `components/platform/customers/PlatformCustomersHubShell.tsx`  
   - Tabs: `PlatformCustomersHubTabs.tsx`  
   - Config: `lib/platform/customers-hub.ts`  
   - Support remains a link to existing `/platform/support` (no parallel Support build)

2. **Overview** (`/platform/customers/overview`)  
   - KPIs from authoritative portal APIs: customers, customer-success, dashboard  
   - Fail-closed: API/RPC failure shows **Not available**, never a fake `0`  
   - KPI definitions documented in UI + `CUSTOMERS_KPI_DEFINITIONS`  
   - Scope: non-platform customer organizations (documented; Core RPC ownership unchanged)

3. **Organizations** (`/platform/customers`)  
   - Existing register wrapped in hub  
   - Client pagination (25/page), search/filters preserved  
   - Status as **icon + text** via `AipifyStatusBadge`  
   - GET `/api/platform-portal/customers` now requires auth + platform profile before RPC

4. **Customer Success** (`/platform/customer-success`)  
   - Existing actionable overview wrapped in hub  
   - Fail-closed KPI values on load error  
   - Status as icon + text  
   - No new CRM, no churn scores, no email campaigns

5. **Customer 360 detail**  
   - Status badges moved to icon + text (read-only surface unchanged; no identity/role writes)

6. **i18n**  
   - `platform.customersHub.*` + pagination/status keys in `en/no/sv/da/pl/uk/es`

7. **Tests**  
   - `npx tsx lib/platform/customers-hub.test.ts` — 6/6 pass

## Explicit non-goals (unchanged)

- Product Center V4, APP Support ticket Core, Sales Partner / CSP portal, Kompis public chain  
- No SQL migrations, no Stripe/payment writes, no email send, no customer delete  
- No new CRM task engine

## Remaining owner gates

- **OWNER_BROWSER_QA_PENDING** — authenticated Platform Admin browser walk of Oversikt → Organisasjoner → Kundesuksess → customer detail → Support link  
- No Core SQL candidate from this job
