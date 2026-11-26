# CSP Sellerpanel Functional Acceptance V4 — Closure

**PR:** https://github.com/aipify-project/aipify-platform/pull/363  
**Branch:** `feat/csp-sellerpanel-functional-acceptance-v4-20261126`  
**Baseline:** `1d23f9640` (#362 LIVE)  
**Goal status:** `CODE_READY` for messaging UX + materials workflow; `CODE_READY_BLOCKED` for link deactivate Core RPC until owner SQL apply; full `AIPIFY_CSP_SELLERPANEL_FUNCTIONAL_COMPLETE_LIVE_VERIFIED` deferred until Staging E2E with isolated partner + deactivate SQL applied.

## Delivered

1. **Admin recipient picker** — searchable name/status/reference; no UUID paste; blocks suspended/rejected/under_review.
2. **Profile Send message** — Messages tab compose + conversation history for the open partner.
3. **Partner notifications** — unread Core admin messages only; honest empty/error.
4. **Help contact** → `/partners/account/messages`.
5. **Link deactivate** — App PATCH + UI fail-closed; SQL candidate PREPARED_ONLY  
   `docs/platform/sql-candidates/csp_deactivate_attribution_link_v4.sql`  
   SHA `b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3`
6. Matrix: `docs/platform/csp-sellerpanel-functional-matrix-v4.md`  
7. Ownership vs #361: `docs/platform/csp-v4-ownership-vs-app-361.md`

## Hard constraints kept

- Unonight CSP suspended unchanged  
- Zero Kompis Public Chain / Academy exam / Stripe / APP #361 takeover  
- No Production mass messages; 0 messages / 0 published materials in Production at check time  

## Owner next

1. Approve Staging apply of deactivate SQL → verify → Production apply  
2. Staging isolated partner E2E for admin↔partner messaging (not Production partners)  
3. Merge #363 when checks green → Production deploy verify  
