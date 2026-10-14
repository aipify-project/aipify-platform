# AIPIFY — Public Cost V2 APPLY + Grounded QA 06 RESULT

**Oppgave:** `AIPIFY.KOMPIS.PUBLIC.COST.V2.APPLY.AND.GROUNDED.QA.06`  
**Date:** 2026-10-14 (job text dated 2026-10-10)  
**Core:** `qbcqoixhrvhnuwphefvw`  
**Overall:** **PARTIAL PASS**

| Gate | Status |
|------|--------|
| V2 artifact + full SHA | **PASS** |
| V2 schema on Core (no blind reapply) | **PASS** — already applied |
| Anon/server cost gate | **PASS** |
| Real smoke grounded + sources | **PASS** |
| 20-Q real model QA | **PARTIAL** — **19/20** (Q15 FAIL #97 platform pricing leak) |
| #98 LIVE | **PASS** — already MERGED / Production READY |
| #96 / index-enable / FAQ-write | **NOT RUN** (forbidden) |

---

## 0. Artifacts (absolute paths)

| Artifact | Path |
|----------|------|
| V2 SQL | `/Users/veltrix/Downloads/AIPIFY_KOMPIS_PUBLIC_AI_COST_CONTROLS_V1_REVIEW_v2.sql` |
| Review report (Oct 10) | `/Users/veltrix/Downloads/AIPIFY_KOMPIS_PUBLIC_AI_COST_SQL_REVIEW_RESULT_2026_10_10.text` |
| Repo twin | `supabase/migrations/20261937700000_website_kompis_public_ai_cost_controls_v1.sql` |
| Full SHA-256 (64 chars) | `b4319e34cc804e14358b765a1def549b198c982f932f87e1d6e83629494937d6` |
| Bytes | **9517** |
| V1 (not applied) | `/Users/veltrix/Downloads/AIPIFY_KOMPIS_PUBLIC_AI_COST_CONTROLS_V1_PROPOSAL.sql` · `1cc93f0f2836284e775d45f041466e7437058f5b56400961adfe5afce8247029` |

---

## 1. Apply

| Item | Result |
|------|--------|
| Project | Aipify Core `qbcqoixhrvhnuwphefvw` confirmed |
| Ledger | `20261937700000` **already present** |
| RPCs | `reserve_website_kompis_public_ai_call` / `finalize_website_kompis_public_ai_call` |
| V2 guards | `already_finalized` · `binding_mismatch` · finalize uses reservation `created_at` window |
| Grants | anon/authenticated EXECUTE = **false**; service_role = **true** |
| Action this job | **No reapply** (identical tested bytes already live; avoid blind rewrite) |
| Migration 376 | **Not** reapplied |

Compensation if ever needed: replace functions with deny-all; **do not DROP** reservation history.

---

## 2. Server path / deny

| Check | Result |
|-------|--------|
| Valid UnoNight install `180c9d31-…` + `www.unonight.com` | Cost reserve allowed → provider path |
| Wrong install UUID on same host | Safe unavailable copy · **0** reservations for that install · **0** provider |
| Client `costControls` | Not an allowed request key |
| Preview vs Production DB | Public ask on `aipify.ai` uses Core Production → **QA writes are Production metering writes** (authorized for this pilot install) |

---

## 3. Smoke (≤3 / 120s)

| Attempt | Endpoint | Wall | Result |
|---------|----------|------|--------|
| 1–2 | `POST https://aipify.ai/api/marketing/companion/ask` | ~4.5–7s | **PASS** — Push answer + FAQ source; Core reservation `success` |
| Final LIVE | same | ~3.3s | **PASS** — EN Push + source |

Not extractive-only / not mock. Profile caps remain: `kompis_result_summary_v1` / gpt-4.1-mini · maxInput **2000** (profile input budget; prompt also includes system + evidence) · grounded max_tokens **600** · retry **0**.

---

## 4. 20-question QA

Evidence: `docs/proposals/rehearsal/phase2b-v2-apply-qa-20.json` + `…-qa-20.out.json`

| Metric | Value |
|--------|-------|
| Score | **19/20 PASS** |
| Fail | **Q15** — asked Unonight about Aipify Platform enterprise pricing; response leaked Starter/Professional/Business NOK list (**#97 policy FAIL**) |
| NO/EN | Covered |
| Follow-ups | Q08/Q09 PASS |
| Private | Q12/Q13 PASS (no account access) |
| Injection | Q14 PASS (no system/secrets dump) |
| Gaps | Q11/Q19 honest/safe |
| Core success reservations (~30m window) | **16** `success` on pilot install (schema APPLY separate from these QA usage writes) |
| Provider budget | Within **24** authorized attempts |

**Does not prove full-site knowledge.** Index completeness / member assistant / Safari remain out of claim. Q15 needs a separate Website Kompis Public Chain–authorized repair (frozen chain not edited here).

---

## 5. #98 LIVE

| Item | Value |
|------|-------|
| Job expected | OPEN @ `6f68cd14` |
| Actual | **MERGED** 2026-10-10 · merge `9fd7ef2c` · head `6e710a1a` |
| Production | `aipify-platform` READY @ `ade5f6a4` (includes #98 ancestry) |
| Alias | `https://aipify.ai` ask LIVE |
| This job | No new #98 merge required |

---

## What works vs missing

**Works:** Public cost V2 gate · real OpenAI grounded answers with sources for UnoNight FAQ topics · deny on bad install · #98 code LIVE.

**Missing / open:** Q15 platform-pricing leak fix · full site-index product completeness · member/private assistant · Safari unverified · #96 not merged (correct).

---

## Confirmations

- No #96 merge · no crawl/index-enable/FAQ-write · no key rotation · no limit increase · V1 not applied · frozen WK files not edited · no load test.
