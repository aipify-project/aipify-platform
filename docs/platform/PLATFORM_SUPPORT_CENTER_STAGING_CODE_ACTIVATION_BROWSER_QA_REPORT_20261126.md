# Support Center — Staging code activation + browser QA report

**Final status:** `BLOCKED_NO_STAGING_BOUND_APP`  
**Date (UTC):** 2026-11-26  
**Worktree:** `/Users/veltrix/Development/aipify-platform-support-center-v1-20261126b`  
**Branch:** `feat/platform-support-center-v1-20261126b`  
**PR:** https://github.com/aipify-project/aipify-platform/pull/400 (**not merged**; diverged from current `main`)

## Environment map (verified)

| Layer | Value |
|-------|--------|
| Vercel project | `aipify-platform` (`prj_tPgcqwgUAAkGvBy802arVXVYf1fv`) |
| Custom environments | **none** |
| `NEXT_PUBLIC_SUPABASE_URL` targets | production + preview + development → **same** |
| Bound Core host | `qbcqoixhrvhnuwphefvw.supabase.co` (**Production Core**) |
| Staging Core (SQL green) | `auedugihkduoaikfusqe` — **not** used by Preview/Production app |
| Latest PR Preview | `dpl_147CuLFYGZYXeBn4dQjH6zCRHDHd` — **ERROR** (`lint_or_type_error`: `archived` on template type) |
| Production deploy | main / Production Core — Support Center gates closed; Support RPCs **absent** on Production |

Preview ≠ Staging. Activating gates globally would target Production Core (forbidden and RPCs missing).

## Gates before → after

| Gate | Before | After (this job) |
|------|--------|------------------|
| Read `RPC_CONNECTED` / feature | compile-time `false` | **Runtime Staging-Core-bound** (`auedugihkduoaikfusqe` only) |
| Write `RPC_CONNECTED` / feature | compile-time `false` | **Runtime Staging-Core-bound** + live RPC wiring |
| Intake `RPC_CONNECTED` / feature | `false` | **`false`** (Staging batch had no intake create RPCs) |
| Email send | `false` | **`false`** (unchanged; drafts use `blocked_unconfigured`) |
| Template / signature Core persist | `false` | **`false`** (no Core CRUD RPCs in batch) |
| Production with current env | closed | **still closed** (app URL is Production Core) |

Code: `lib/platform-portal/support-center/staging-core-activation.ts`  
Also: TS fix for template `archived` filter; write route passes Supabase RPC client; external reply stores draft without claiming sent.

## Browser QA

| Area | Result | Kind |
|------|--------|------|
| Web `/contact/support` → Support Center | **Blocked** — app not Staging-bound; intake RPCs absent | blocked |
| CSP partner intake | **Blocked** — same | blocked |
| Platform list/filter/status/note/draft | **Blocked** — Preview→Production Core; RPCs absent there | blocked |
| Templates/signature UI | Partial local store only; Core persist off | API/local only |
| Isolation / non-admin deny | Covered earlier by Staging SQL harness (not browser) | Core SQL verified previously — **not** browser proof |
| Desktop / mobile layout | Not run | blocked |
| Email queued/sent | Confirmed OFF in code + prior Staging SQL verify | API/code |
| CSP/CRM untouched | No CRM env/SQL changes this job | verified by scope |

Local fixture / Staging SQL verify ≠ browser proof.

## Cleanup

No browser fixtures created. No Production SQL. No secrets/DNS/email provider changes. CSP/CRM data not mutated.

## Precise blocker

1. Vercel Preview/Production/Development all bind to **Production Core** `qbcqoixhrvhnuwphefvw`.  
2. Support Center SQL is live only on **Staging Core** `auedugihkduoaikfusqe`.  
3. No custom Staging environment exists. Changing Preview Supabase URL/keys is a **secrets/env** change → requires **separate exact owner YES**.  
4. Without that bind, browser QA against Staging Core cannot run; flipping gates for current Preview would hit Production (unsafe + RPCs missing).

## Code shipped in this job (safe)

- Staging-Core-bound activation (Production remains closed under current env)
- Write RPC wiring for note / draft / status / assign when Staging-bound
- Preview build TS fix (`archived` filter)
- Focused tests green (activation, read adapter, intake, support-center)

## Next single owner decision (do not execute here)

**Approve a Staging-bound app environment** for Preview (or a custom env) that sets Supabase URL + anon/service keys to `auedugihkduoaikfusqe` only (no Production keys), then redeploy PR #400 Preview and re-run the authorized browser QA pack.  
Separate later: intake create SQL (if web/CSP intake required), Production SQL, email OFF→ON, code merge to main after green browser QA.

**Production:** unchanged. **Email:** OFF.
