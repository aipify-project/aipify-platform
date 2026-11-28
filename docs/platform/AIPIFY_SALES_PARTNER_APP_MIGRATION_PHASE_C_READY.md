# AIPIFY_SALES_PARTNER_APP_MIGRATION_PHASE_C_READY

**Status:** READY for PR  
**Phase:** C  
**Based on:** Phase B PR #512 / `7581e4361`

## Delivered

| Item | Notes |
|------|--------|
| APP-host href map | `phase-c-shared-surfaces.ts` — CSP nav/topbar/messages/notifications map to `/app/sales-partner/*` |
| Thin hosts | `notifications`, `profile`, `help` added |
| Portal load timeout | Client abort `20s` on `/api/certified-sales-partner/portal` |
| Topbar unread | Parallel messages + email fetches (no CRM serialization) |
| Messages send | Composer always visible when inbox usable; visible `#7C3AED` send + icon |
| Feedback send | Visible gradient fallback; sticky CTA |
| Feedback guidelines | Partner uses public `/knowledge/articles/...` (no customer APP bounce) |
| Individual APP icons | Distinct icons per salesPartner* nav id |
| Support Ticket System | **BLOCKED** — Agent 3 fence; VoC path only |

## Explicit non-effects

- No `/partners` retirement  
- No SQL / Stripe / gates / Agent 2–3 Support-Redis edits  
- No commercial Sales Partner license activation  
- No auto merge of CSP payout/cert into `/app/profile`  
- Persistence E2E still BLOCKED  

## Signed-in QA

Requires authorized CSP session — report BLOCKED if unavailable (no credential guess).
