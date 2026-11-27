# AIPIFY_PERSONAL_SALES_INTEREST_ACTIVATION_JOB_V1

**Status:** READY_FOR_EXACT_YES — do not run until a separate owner YES cites this file.  
**Repo:** aipify-project/aipify-platform  
**Production Core:** `qbcqoixhrvhnuwphefvw`  
**Code LIVE:** PR #481 · merge `63ef64cc017146f7116b9738e614a61c0886dd63`  
**service_role EXECUTE:** already granted on `register_personal_sales_page_interest(text×6, boolean, text)`

## Scope (only this)

Flip the public interest form gate from OFF to ON. Nothing else.

## Non-goals

- No SQL apply  
- No email sending  
- No Stripe / commission changes  
- No Production seed / fixture leads in the activation commit itself  
- No layout redesign  

## Single code change

File: `lib/personal-sales-page/lead-gate.ts`

```ts
export function personalSalesLeadEnabled(): boolean {
  return true;
}
```

Keep `PERSONAL_SALES_LEAD_GATE` comment updated to reflect `live` (optional string constant only).  
Do not change route validation, CRM lists, or RPC names.

## Controlled smoke after LIVE (owner-approved, then delete)

1. Use one **active + certified** Growth Partner slug on Staging first (`auedugihkduoaikfusqe`), then optionally one Production smoke with a clearly labeled throwaway email owned by Aipify, immediately closed/deleted via CRM after verification.  
2. Assert: store → CRM list_own → Platform list_platform.  
3. Assert: duplicate email → `duplicate` / not a second row (unique index).  
4. Assert: no consent → 400; honeypot filled → closed; `seller_id` → 400.  
5. Assert: closed/invalid code → form not shown; register returns `closed`.  
6. Delete the smoke lead(s). Do not leave Production test leads.

## Rollback

Revert `personalSalesLeadEnabled()` to `return false` and redeploy. Existing leads remain in `growth_partner_ops_leads`; no data deletion on rollback.

## Exact YES required to activate

```text
YES — activate public personal sales interest form
file: lib/personal-sales-page/lead-gate.ts
change: personalSalesLeadEnabled() return true
Production project qbcqoixhrvhnuwphefvw
NO SQL · NO email · NO Stripe · NO commission
```
