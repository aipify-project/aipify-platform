# Unified Customer Profile Complete V1 — delivery report

**Date:** 2026-11-27  
**Branch:** `fix/app-platform-unified-customer-profile-v1-20261127`  
**Base:** `origin/main` (after #425). Parallel Customer 360 hub PR #426 left unmerged — this PR avoids overwriting that hub work.  
**Feature owners:** CUSTOMER APP + PLATFORM ADMIN (read)

## Field → source matrix

| UI field | Person vs org | APP source | Platform 360 source | Persist without SQL? |
|----------|---------------|------------|---------------------|----------------------|
| Full name | Person | `users.full_name` (+ auth metadata) | `customers.full_name` as primary contact | Yes — APP PATCH + sync to `customers.full_name` for owner/admin |
| Login email | Person / identity | `auth.users.email` (locked) | n/a on profile | No change (auth flow) |
| Contact email | Person | not editable here | `customers.email` (identity panel) | Existing Platform identity RPC |
| Phone | Person | `auth.users.phone` / metadata | `customers.phone` (enriched) | Yes — APP PATCH + sync |
| Address | Person | unavailable | unavailable | **SQL-BLOCKED** (candidate below) |
| Organization name | Org | `get_app_organization_context.workspace_name` | `customers`/`companies` legal/name | Read-only display fixed |
| Org number / legal | Org | locked / request change | detail RPC | Read-only |
| Company website/phone/address | Org | unavailable until Core | unavailable | **SQL-BLOCKED** |

## What ships now (persisting)

1. APP `/app/profile` shows organization name from workspace context (fixes false “Ingen firmaopplysninger” when org exists).
2. `/app/settings/company-profile` redirects to `/app/profile?tab=company` (one edit surface).
3. Personal editor: labels above fields, country-code phone, cancel/reset, unsaved guard, login-email locked with explanation.
4. APP name/phone save confirms only after server success; owner/admin syncs `customers.full_name` / `customers.phone` so Platform list+360 primary contact can match.
5. Platform Customer 360 detail enriches primary contact name/email/phone from existing `customers` columns (org name stays org name).

## SQL candidate (NOT APPLIED — needs exact owner approval)

**Goal:** durable person address + optional company contact fields without inventing CRM.

Suggested additive migration (author later):  
- `user_profile_contacts` or columns on `users`: `contact_email`, `address_line1`, `address_line2`, `postal_code`, `city`, `country_code`  
- RLS: user can update own row; platform admin read via existing portal definer RPCs  
- Extend `get_platform_portal_customer_detail` to return primary contact + address  
- Rollback: drop new columns/table only  

**SHA256:** prepare at apply-approval time. Staging first. No Production apply in this job.

## Tests

- `npx tsx lib/app/account-profile/account-profile.test.ts`
- `npx tsx lib/app/account-profile/phone.test.ts`
- `npx tsx lib/platform-portal/customer-detail.test.ts` (parser still accepts payloads; primary contact null when absent)

## Remaining gates

- **OWNER_BROWSER_QA_PENDING** — APP owner: open Kundeforhold → save name/phone → hard refresh → Platform Customer 360 shows primary contact (not org name as person).
- **PR #426** Customer 360 hub — merge separately; rebase if needed.
- Address / company website write path remains Core-blocked until SQL approval.
