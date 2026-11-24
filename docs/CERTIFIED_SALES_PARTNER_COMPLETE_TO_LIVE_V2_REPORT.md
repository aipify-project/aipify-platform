# Certified Sales Partner — Complete-to-Live V2 Report

**Date:** 2026-11-25  
**PR:** https://github.com/aipify-project/aipify-platform/pull/345  
**Branch:** `feat/certified-sales-partner-complete-v1`  
**Verified base:** `origin/main` @ `c7995407c`  
**Migration (unchanged SHA):** `20261941000000_certified_sales_partner_core_v1.sql`  
**SHA-256:** `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95`  
**SQL applied:** NO (Staging/Production) — separate Gate S/P required  
**Kompis Public Chain:** untouched (diff evidence: no protected paths)

## Module status

| Module | Code complete | Tests | Backend active | Production | Blocker |
|---|---|---|---|---|---|
| Domain commission / 2-period earn | Yes | PASS | No | FAIL-CLOSED | SQL + Stripe consent |
| Academy 80% server score + Kompis blocked | Yes | PASS | No | FAIL-CLOSED | SQL answer-key RPCs |
| Settlement transitions (manual bank) | Yes | PASS | No | FAIL-CLOSED | SQL + finance role proof |
| Registration validation + public form | Yes | PASS | No | FAIL-CLOSED UI | SQL `csp_register_*` |
| Bank profile (IBAN/local, masked) | Yes | PASS | No | FAIL-CLOSED | SQL vault/persist |
| Attribution policy + `/p/...` channel/bot | Yes | PASS | Partial reuse GP RPC | FAIL-CLOSED for CSP ledger | SQL CSP attribution |
| Locked email templates | Yes | PASS | No | FAIL-CLOSED | SQL templates + sender approval |
| Platform Selgere pages | Yes (honest not-ready) | Nav PASS | No | FAIL-CLOSED | SQL |
| Partner portal CSP IA | Yes | — | No | FAIL-CLOSED | SQL portal bundle |
| Payment event mapper API | Yes | PASS | No | FAIL-CLOSED | Secret + SQL + payment consent |
| Kompis helper | Honest BLOCKED | PASS | N/A | BLOCKED | Existing read-only chain not wired |

## Journey matrix (V2)

| # | Journey | Status |
|---|---|---|
| 1 | Recruit → register → admin review → approved | DELVIS — form + APIs fail-closed; Core write BLOCKED |
| 2 | Academy → 80% → cert → link; Kompis blocked | DELVIS — scoring + API; live course data BLOCKED |
| 3 | Admin product + fixed commission | DELVIS — Platform pages; publish RPC BLOCKED |
| 4 | Personal link 90d first-valid-touch | DELVIS — route + policy; CSP ledger BLOCKED |
| 5 | Stripe #1 → awaiting month 2 | BLOKKERT — no payment consent / Core |
| 6 | Stripe #2 → one commission | BLOKKERT — same |
| 7 | Monthly settlement manual payout | DELVIS — transition rules + API; live batch BLOCKED |
| 8 | Profile + bank | DELVIS — validation/mask; persist BLOCKED |
| 9 | Locked email / social / leads | DELVIS — locked template engine; send BLOCKED |
| 10 | Selgere + i18n | IMPLEMENTERT+VERIFISERT (UI + locales); data LIVE no |
| 11 | Kompis | BLOKKERT honest |

## Owner approvals still required

1. **Gate S/P SQL:** apply exact migration SHA `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95` (then follow-on RPC bodies for register/exam/settlement/payment — stubs only today).
2. **Payment consent** for controlled Stripe period #1/#2 tests.
3. **Email sender/domain** before live partner mail.
4. Ordinary APP merge of #345 when CI/preview/security are genuinely green (Ignored Build Step ≠ full preview proof).

## End state

**APP control plane + domain rules + fail-closed APIs + registration UX: READY FOR MERGE as non-LIVE scaffolding.**  
**Commercially LIVE certified sales/commission/payout: NOT COMPLETE.**
